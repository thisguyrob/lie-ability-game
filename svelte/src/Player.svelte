<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  import './player-mobile.css';
  
  import PlayerJoin from './components/player/PlayerJoin.svelte';
  import PlayerWaiting from './components/player/PlayerWaiting.svelte';
  import PlayerCategorySelect from './components/player/PlayerCategorySelect.svelte';
  import PlayerQuestionView from './components/player/PlayerQuestionView.svelte';
  import PlayerLieSubmit from './components/player/PlayerLieSubmit.svelte';
  import PlayerOptionSelect from './components/player/PlayerOptionSelect.svelte';
  import PlayerTruthReveal from './components/player/PlayerTruthReveal.svelte';
  import PlayerScoreboard from './components/player/PlayerScoreboard.svelte';
  
  let socket;
  let playerId = null;
  let playerName = '';
  let gameState = {
    state: 'lobby',
    players: [],
    currentRound: 1,
    totalRounds: 3,
    currentQuestion: 1
  };
  
  // Initialize from localStorage if available
  if (typeof window !== 'undefined') {
    const savedPlayerId = localStorage.getItem('lie-ability-player-id');
    const savedPlayerName = localStorage.getItem('lie-ability-player-name');
    if (savedPlayerId && savedPlayerName) {
      playerId = savedPlayerId;
      playerName = savedPlayerName;
      console.log('Restored player data from localStorage:', { playerId, playerName });
    }
  }
  let subStepInfo = null;
  let timer = 0;
  let currentQuestion = null;
  let truthRevealData = null;
  let scoreboardData = { players: [] };
  let connectionStatus = 'disconnected';
  let reconnectAttempts = 0;
  let maxReconnectAttempts = 5;
  let reconnectTimeout = null;
  let isReconnecting = false;
  
  // Debug reactive statement
  $: console.log('Player gameState changed:', gameState);
  
  function initSocket() {
    socket = io({
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000
    });
    
    socket.on('connect', () => {
      console.log('Player connected to server');
      connectionStatus = 'connected';
      reconnectAttempts = 0;
      isReconnecting = false;
      
      // Clear any reconnection timeout
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      
      // Request current game state
      socket.emit('request_game_state');
      
      // If we have a playerId, try to rejoin the game
      if (playerId && playerName) {
        console.log('Attempting to rejoin game as:', playerName);
        socket.emit('rejoin_game', { playerId, playerName });
        
        // Set a timeout to clear player data if rejoin doesn't succeed within 3 seconds
        setTimeout(() => {
          // If we still don't have a valid game state with this player after 3 seconds,
          // assume the rejoin failed and clear the data
          if (playerId && !gameState.players.find(p => p.id === playerId)) {
            console.log('Rejoin timeout - player not found in game state, clearing saved data');
            clearPlayerData();
          }
        }, 3000);
      }
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Player disconnected from server:', reason);
      connectionStatus = 'disconnected';
      
      // Only attempt manual reconnection for certain disconnect reasons
      if (reason === 'io server disconnect' || reason === 'transport close') {
        attemptReconnection();
      }
    });
    
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      connectionStatus = 'error';
      attemptReconnection();
    });
    
    socket.on('player_joined_response', (data) => {
      if (data.success) {
        playerId = data.player.id;
        playerName = data.player.name;
        gameState = data.gameState;
        
        // Save to localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('lie-ability-player-id', playerId);
          localStorage.setItem('lie-ability-player-name', playerName);
        }
        
        console.log('Successfully joined as:', data.player);
        console.log('Initial game state after join:', gameState);
      } else {
        console.error('Failed to join:', data.error);
        alert('Failed to join: ' + data.error);
      }
    });
    
    socket.on('game_state_update', (data) => {
      // Force reactivity by creating a new object
      gameState = { ...data };
      
      // Update current question if provided in game state
      if (data.currentQuestionData) {
        currentQuestion = data.currentQuestionData;
      }
    });
    
    socket.on('sub_step_info', (data) => {
      subStepInfo = data;
      if (data.question) {
        currentQuestion = data.question;
      }
      if (data.options) {
        currentQuestion = { ...currentQuestion, options: data.options };
      }
    });
    
    socket.on('category_selection_start', (data) => {
      gameState = { ...gameState, state: 'category_selection' };
      currentQuestion = {
        categories: data.categories,
        selectorName: data.selectorName,
        selectorId: data.selectorId
      };
    });
    
    socket.on('question_reading_start', (data) => {
      gameState = { ...gameState, state: 'question_reading' };
      currentQuestion = data;
    });
    
    socket.on('lie_submission_start', (data) => {
      gameState = { ...gameState, state: 'lie_submission' };
    });
    
    socket.on('option_selection_start', () => {
      gameState = { ...gameState, state: 'option_selection' };
    });
    
    socket.on('truth_reveal_start', (data) => {
      truthRevealData = data || {
        category: 'Unknown',
        question: 'Loading...',  
        truth: { answer: 'Loading...' },
        lies: [],
        truthVoters: [],
        truthPoints: 1000
      };
      gameState = { ...gameState, state: 'truth_reveal' };
    });
    
    socket.on('scoreboard_update', (data) => {
      scoreboardData = data || { players: [] };
      gameState = { ...gameState, state: 'scoreboard' };
    });
    
    socket.on('game_ended', (data) => {
      // Keep showing scoreboard but with game end data
      scoreboardData = {
        ...scoreboardData,
        players: data.finalScores,
        isGameEnd: true,
        winner: data.winner
      };
      gameState = { ...gameState, state: 'scoreboard' };
    });
    
    socket.on('timer_update', (data) => {
      timer = data.secondsRemaining;
    });
    
    socket.on('lie_submitted', (data) => {
      if (data.success) {
        // Update substep info to reflect lie submitted
        subStepInfo = { ...subStepInfo, hasSubmittedLie: true };
      } else {
        alert(data.error || 'Failed to submit lie');
      }
    });
    
    socket.on('option_selected', () => {
      // Update substep info to reflect option selected
      subStepInfo = { ...subStepInfo, hasSelectedOption: true };
    });
    
    socket.on('name_updated', (data) => {
      if (data.success) {
        playerName = data.newName;
        console.log('Name updated to:', data.newName);
      }
    });
    
    socket.on('error', (data) => {
      console.error('Socket error:', data.message);
      
      // If player not found during rejoin, clear localStorage and reset
      if (data.message.includes('Player not found') || data.message.includes('Please join as a new player')) {
        console.log('Player not found on server, clearing saved data and resetting to join screen');
        clearPlayerData();
        
        // Don't show alert for this specific error, just log it
        console.log('Cleared player data, ready to join as new player');
        return;
      }
      
      // Show alert for other errors
      alert('Error: ' + data.message);
    });
  }
  
  function attemptReconnection() {
    if (isReconnecting || reconnectAttempts >= maxReconnectAttempts) {
      return;
    }
    
    isReconnecting = true;
    reconnectAttempts++;
    connectionStatus = 'reconnecting';
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 5000);
    console.log(`Attempting reconnection ${reconnectAttempts}/${maxReconnectAttempts} in ${delay}ms`);
    
    reconnectTimeout = setTimeout(() => {
      if (socket && !socket.connected) {
        socket.connect();
      }
      isReconnecting = false;
    }, delay);
  }
  
  function clearPlayerData() {
    console.log('Clearing player data');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lie-ability-player-id');
      localStorage.removeItem('lie-ability-player-name');
    }
    playerId = null;
    playerName = '';
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      // Page became visible (woke up)
      console.log('Page became visible, checking connection');
      if (socket && !socket.connected) {
        console.log('Socket disconnected while page was hidden, attempting reconnection');
        attemptReconnection();
      } else if (socket && socket.connected) {
        // Even if connected, request fresh game state
        socket.emit('request_game_state');
        if (playerId && playerName) {
          socket.emit('rejoin_game', { playerId, playerName });
        }
      }
    }
  }
  
  function joinGame(name) {
    playerName = name;
    socket.emit('join_game', { playerName: name, playerId: playerId });
  }
  
  function selectCategory(categoryId) {
    socket.emit('select_category', { categoryId });
  }
  
  function submitLie(lie) {
    socket.emit('submit_lie', { lie });
  }
  
  function autoLie() {
    socket.emit('auto_lie');
  }
  
  function selectOption(optionId) {
    socket.emit('select_option', { optionId });
  }
  
  function likeLie(likedPlayerId) {
    socket.emit('like_lie', { likedPlayerId });
  }

  function updateAvatar(emoji, color) {
    socket.emit('update_avatar', { emoji, color });
  }

  function updateName(newName) {
    socket.emit('update_name', { newName });
  }
  
  onMount(() => {
    initSocket();
    
    // Listen for page visibility changes (mobile sleep/wake)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also listen for page focus/blur events as backup
    window.addEventListener('focus', handleVisibilityChange);
  });
  
  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
    
    // Clean up event listeners
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleVisibilityChange);
    
    // Clear any pending reconnection timeout
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
  });
  
  // Helper to check if current player
  $: isCurrentPlayer = playerId !== null;
  $: currentPlayer = gameState.players.find(p => p.id === playerId);
</script>

<main class="player-container">
  <div class="connection-indicator" 
       class:connected={connectionStatus === 'connected'}
       class:reconnecting={connectionStatus === 'reconnecting'}
       class:error={connectionStatus === 'error'}>
    <div class="indicator-dot"></div>
    {#if connectionStatus === 'connected'}
      Connected
    {:else if connectionStatus === 'reconnecting'}
      Reconnecting...
    {:else if connectionStatus === 'error'}
      Connection Error
    {:else}
      Disconnected
    {/if}
  </div>
  
  
  <div class="player-content">
    {#if !isCurrentPlayer}
      <PlayerJoin {connectionStatus} onJoin={joinGame} onClearData={clearPlayerData} />
    {:else if gameState.state === 'lobby'}
      <PlayerWaiting {playerName} {gameState} {currentPlayer} onUpdateAvatar={updateAvatar} onUpdateName={updateName} />
    {:else if gameState.state === 'category_selection'}
      <PlayerCategorySelect 
        {currentQuestion} 
        {playerId} 
        onSelect={selectCategory} 
      />
    {:else if gameState.state === 'question_reading'}
      <PlayerQuestionView {currentQuestion} />
    {:else if gameState.state === 'lie_submission'}
      <PlayerLieSubmit 
        {currentQuestion} 
        {subStepInfo} 
        onSubmit={submitLie} 
        onAuto={autoLie} 
      />
    {:else if gameState.state === 'option_selection' || gameState.state === 'truth_reveal'}
      <PlayerOptionSelect 
        {currentQuestion} 
        {subStepInfo} 
        onSelect={selectOption}
        onLike={likeLie}
      />
    {:else if gameState.state === 'scoreboard'}
      <PlayerScoreboard {scoreboardData} {currentPlayer} />
    {/if}
  </div>
  
  {#if isCurrentPlayer && gameState.state !== 'lobby'}
    <!-- Removed game-info footer for a cleaner interface -->
  {/if}
</main>

<style>
  .player-container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    padding: 1rem;
  }
  
  @media (prefers-color-scheme: dark) {
    .player-container {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
  }
  
  .connection-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    z-index: 10;
  }
  
  .connection-indicator.connected {
    color: #4ade80;
  }
  
  .connection-indicator.reconnecting {
    color: #fbbf24;
  }
  
  .connection-indicator.error {
    color: #ef4444;
  }
  
  .indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    animation: pulse 2s infinite;
  }
  
  .connection-indicator.connected .indicator-dot {
    background: #4ade80;
    animation: none;
  }
  
  .connection-indicator.reconnecting .indicator-dot {
    background: #fbbf24;
    animation: pulse 1s infinite;
  }
  
  .connection-indicator.error .indicator-dot {
    background: #ef4444;
    animation: pulse 0.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  
  .player-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    padding: 2rem 0;
  }
  
  
  @media (max-width: 480px) {
    .player-container {
      padding: 0.5rem;
    }
    
    .connection-indicator {
      top: 0.5rem;
      right: 0.5rem;
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }
    
    /* Removed game-info styles */
  }
</style>