<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  
  // Player-specific components
  import PlayerJoin from './components/player/PlayerJoin.svelte';
  import PlayerLobby from './components/player/PlayerLobby.svelte';
  import PlayerCategorySelect from './components/player/PlayerCategorySelect.svelte';
  import PlayerQuestionReading from './components/player/PlayerQuestionReading.svelte';
  import PlayerLieSubmit from './components/player/PlayerLieSubmit.svelte';
  import PlayerOptionSelect from './components/player/PlayerOptionSelect.svelte';
  import PlayerTruthReveal from './components/player/PlayerTruthReveal.svelte';
  import PlayerScoreboard from './components/player/PlayerScoreboard.svelte';
  
  // State
  let socket;
  let playerData = {
    id: null,
    name: '',
    avatar: { emoji: '😊', color: '#667eea' },
    score: 0,
    connected: false,
    hasJoined: false
  };
  
  let gameState = {
    phase: 'lobby',
    round: 1,
    question: 1,
    subStep: 'waiting',
    players: [],
    currentQuestion: null,
    options: [],
    timer: null
  };
  
  let subStepInfo = {
    isMyTurn: false,
    hasSubmitted: false,
    hasSelected: false,
    canAct: false,
    message: ''
  };
  
  let connectionStatus = 'connecting';
  let errorMessage = '';
  let isReconnecting = false;
  
  // Socket connection and event handlers
  onMount(() => {
    // Check for existing player data in sessionStorage
    const savedPlayerData = sessionStorage.getItem('lieability_player');
    if (savedPlayerData) {
      try {
        const parsed = JSON.parse(savedPlayerData);
        playerData = { ...playerData, ...parsed };
        isReconnecting = true;
      } catch (e) {
        console.warn('Failed to parse saved player data');
      }
    }
    
    // Initialize socket connection
    socket = io();
    
    socket.on('connect', () => {
      connectionStatus = 'connected';
      console.log('Player connected to server');
      
      // If we have existing player data, try to rejoin
      if (isReconnecting && playerData.id && playerData.name) {
        rejoinGame();
      }
      
      requestGameState();
    });
    
    socket.on('disconnect', () => {
      connectionStatus = 'disconnected';
      console.log('Player disconnected from server');
    });
    
    socket.on('connect_error', (error) => {
      connectionStatus = 'error';
      errorMessage = 'Failed to connect to game server';
      console.error('Connection error:', error);
    });
    
    socket.on('player_joined_response', (response) => {
      if (response.success) {
        playerData = { ...playerData, ...response.player, hasJoined: true };
        errorMessage = '';
        
        // Save player data for reconnection
        sessionStorage.setItem('lieability_player', JSON.stringify({
          id: playerData.id,
          name: playerData.name,
          avatar: playerData.avatar
        }));
      } else {
        errorMessage = response.error || 'Failed to join game';
      }
    });
    
    socket.on('game_state_update', (newState) => {
      console.log('Game state update:', newState);
      gameState = { ...gameState, ...newState };
    });
    
    socket.on('sub_step_info', (info) => {
      console.log('Sub step info:', info);
      subStepInfo = { ...subStepInfo, ...info };
    });
    
    socket.on('player_data_update', (data) => {
      console.log('Player data update:', data);
      playerData = { ...playerData, ...data };
    });
    
    socket.on('timer_update', (timerData) => {
      gameState.timer = timerData;
    });
    
    socket.on('error', (error) => {
      errorMessage = error.message || 'An error occurred';
      console.error('Socket error:', error);
      
      // Auto-clear non-critical errors after 10 seconds
      if (!errorMessage.includes('Failed to connect')) {
        setTimeout(() => {
          if (errorMessage === (error.message || 'An error occurred')) {
            errorMessage = '';
          }
        }, 10000);
      }
    });
    
    socket.on('player_reconnected', (data) => {
      if (data.success) {
        playerData = { ...playerData, hasJoined: true };
        gameState = { ...gameState, ...data.gameState };
        errorMessage = '';
        isReconnecting = false;
      } else {
        errorMessage = 'Failed to reconnect';
        isReconnecting = false;
        // Clear saved data if reconnection failed
        sessionStorage.removeItem('lieability_player');
        playerData.hasJoined = false;
      }
    });
  });
  
  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });
  
  // Helper functions
  function requestGameState() {
    if (socket) {
      socket.emit('request_game_state');
    }
  }
  
  function joinGame(name, avatar) {
    if (socket && name.trim()) {
      socket.emit('join_game', {
        name: name.trim(),
        avatar: avatar
      });
    }
  }
  
  function rejoinGame() {
    if (socket && playerData.id && playerData.name) {
      socket.emit('join_game', {
        playerId: playerData.id,
        name: playerData.name,
        avatar: playerData.avatar
      });
    }
  }
  
  function selectCategory(categoryIndex) {
    if (socket) {
      socket.emit('select_category', { categoryId: categoryIndex });
    }
  }
  
  function submitLie(lie) {
    if (socket && lie.trim()) {
      socket.emit('submit_lie', { lie: lie.trim() });
    }
  }
  
  function selectOption(optionIndex) {
    if (socket) {
      socket.emit('select_option', { optionId: optionIndex });
    }
  }
  
  function likeLie(likedPlayerId) {
    if (socket) {
      socket.emit('like_lie', { likedPlayerId });
    }
  }
  
  function clearError() {
    errorMessage = '';
  }
  
  // Computed values
  $: myPlayerData = gameState.players.find(p => p.id === playerData.id) || playerData;
  $: gameInProgress = gameState.phase === 'playing';
</script>

<main class="player-container">
  <!-- Header with player info -->
  {#if playerData.hasJoined}
    <header class="player-header">
      <div class="player-info">
        <div class="player-avatar" style="background: {myPlayerData.avatar.color}">
          {myPlayerData.avatar.emoji}
        </div>
        <div class="player-details">
          <div class="player-name">{myPlayerData.name}</div>
          <div class="player-score">{myPlayerData.score || 0} points</div>
        </div>
      </div>
      
      <div class="connection-status" class:connected={connectionStatus === 'connected'}>
        <div class="status-dot"></div>
      </div>
    </header>
  {/if}
  
  <!-- Error display (auto-hide after 10 seconds for non-critical errors) -->
  {#if errorMessage}
    <div class="error-banner" class:critical={errorMessage.includes('Failed to connect')}>
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-text">{errorMessage}</span>
        <button class="error-close" on:click={clearError} aria-label="Close error">×</button>
      </div>
    </div>
  {/if}
  
  <!-- Main content area -->
  <div class="player-content">
    {#if !playerData.hasJoined}
      <PlayerJoin 
        {connectionStatus}
        {isReconnecting}
        on:join={(e) => joinGame(e.detail.name, e.detail.avatar)}
      />
    {:else if gameState.phase === 'lobby'}
      <PlayerLobby {gameState} {myPlayerData} />
    {:else if gameState.phase === 'playing'}
      {#if gameState.subStep === 'category_selection'}
        <PlayerCategorySelect 
          {gameState} 
          {subStepInfo}
          on:selectCategory={(e) => selectCategory(e.detail.index)}
        />
      {:else if gameState.subStep === 'question_reading'}
        <PlayerQuestionReading {gameState} />
      {:else if gameState.subStep === 'lie_submission'}
        <PlayerLieSubmit 
          {gameState}
          {subStepInfo}
          on:submitLie={(e) => submitLie(e.detail.lie)}
        />
      {:else if gameState.subStep === 'option_selection'}
        <PlayerOptionSelect 
          {gameState}
          {subStepInfo}
          on:selectOption={(e) => selectOption(e.detail.index)}
          on:likeLie={(e) => likeLie(e.detail.index)}
        />
      {:else if gameState.subStep === 'truth_reveal'}
        <PlayerTruthReveal 
          {gameState}
          {myPlayerData}
        />
      {:else if gameState.subStep === 'scoreboard'}
        <PlayerScoreboard {gameState} {myPlayerData} />
      {/if}
    {:else if gameState.phase === 'game_over'}
      <PlayerScoreboard {gameState} {myPlayerData} isGameOver={true} />
    {:else}
      <!-- Fallback waiting state -->
      <div class="waiting-state">
        <div class="waiting-content">
          <div class="spinner"></div>
          <h2>Waiting for game...</h2>
          <p>Please wait while the game loads.</p>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Debug info (development only, minimal) -->
  {#if import.meta.env.DEV && gameState.phase === 'playing'}
    <div class="debug-info">
      <details>
        <summary>🔧</summary>
        <pre>{JSON.stringify({phase: gameState.phase, subStep: gameState.subStep, canAct: subStepInfo.canAct}, null, 2)}</pre>
      </details>
    </div>
  {/if}
</main>

<style>
  .player-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    display: flex;
    flex-direction: column;
  }
  
  .player-header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: var(--space-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .player-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  
  .player-avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xl);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .player-details {
    color: var(--white);
  }
  
  .player-name {
    font-weight: 700;
    font-size: var(--font-size-lg);
    line-height: 1.2;
  }
  
  .player-score {
    font-size: var(--font-size-sm);
    opacity: 0.9;
  }
  
  .connection-status {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  
  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
    background: var(--error);
    transition: all var(--transition);
  }
  
  .connection-status.connected .status-dot {
    background: var(--success);
    animation: pulse 2s infinite;
  }
  
  .error-banner {
    background: rgba(239, 68, 68, 0.9);
    color: var(--white);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .error-content {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  
  .error-icon {
    font-size: var(--font-size-lg);
  }
  
  .error-text {
    flex: 1;
    font-weight: 500;
  }
  
  .error-close {
    background: none;
    border: none;
    color: var(--white);
    font-size: var(--font-size-xl);
    font-weight: bold;
    cursor: pointer;
    padding: var(--space-1);
    border-radius: var(--radius);
    transition: all var(--transition-fast);
  }
  
  .error-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .player-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--space-4);
  }
  
  .waiting-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .waiting-content {
    text-align: center;
    color: var(--white);
  }
  
  .waiting-content h2 {
    margin: var(--space-4) 0 var(--space-2);
    font-size: var(--font-size-2xl);
  }
  
  .waiting-content p {
    opacity: 0.8;
    font-size: var(--font-size-lg);
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid var(--white);
    border-radius: var(--radius-full);
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .debug-info {
    position: fixed;
    bottom: var(--space-3);
    left: var(--space-3);
    background: rgba(0, 0, 0, 0.8);
    color: var(--white);
    padding: var(--space-2);
    border-radius: var(--radius);
    font-size: var(--font-size-xs);
    max-width: 250px;
    max-height: 150px;
    overflow: auto;
    z-index: 1000;
  }
  
  .debug-info summary {
    cursor: pointer;
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  
  
  @media (max-width: 768px) {
    .player-header {
      padding: var(--space-3);
    }
    
    .player-avatar {
      width: 40px;
      height: 40px;
      font-size: var(--font-size-lg);
    }
    
    .player-content {
      padding: var(--space-3);
    }
    
    .debug-info {
      bottom: var(--space-2);
      left: var(--space-2);
      max-width: calc(100vw - var(--space-4));
    }
  }
  
  /* Enhanced touch targets for mobile */
  @media (pointer: coarse) {
    .error-close {
      min-width: 44px;
      min-height: 44px;
    }
  }
</style>