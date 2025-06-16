<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  
  import PlayerJoin from './components/player/PlayerJoin.svelte';
  import PlayerWaiting from './components/player/PlayerWaiting.svelte';
  import PlayerCategorySelect from './components/player/PlayerCategorySelect.svelte';
  import PlayerQuestionView from './components/player/PlayerQuestionView.svelte';
  import PlayerLieSubmit from './components/player/PlayerLieSubmit.svelte';
  import PlayerOptionSelect from './components/player/PlayerOptionSelect.svelte';
  import PlayerTruthReveal from './components/player/PlayerTruthReveal.svelte';
  import PlayerScoreboard from './components/player/PlayerScoreboard.svelte';
  import PlayerGameEnd from './components/player/PlayerGameEnd.svelte';
  
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
  let subStepInfo = null;
  let timer = 0;
  let currentQuestion = null;
  let truthRevealData = null;
  let scoreboardData = null;
  let gameEndData = null;
  let connectionStatus = 'disconnected';
  
  // Debug reactive statement
  $: console.log('Player gameState changed:', gameState);
  
  function initSocket() {
    socket = io();
    
    socket.on('connect', () => {
      console.log('Player connected to server');
      connectionStatus = 'connected';
      socket.emit('request_game_state');
    });
    
    socket.on('disconnect', () => {
      console.log('Player disconnected from server');
      connectionStatus = 'disconnected';
    });
    
    socket.on('player_joined_response', (data) => {
      if (data.success) {
        playerId = data.player.id;
        playerName = data.player.name;
        gameState = data.gameState;
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
    });
    
    socket.on('sub_step_info', (data) => {
      subStepInfo = data;
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
      gameState = { ...gameState, state: 'truth_reveal' };
      truthRevealData = data;
    });
    
    socket.on('scoreboard_update', (data) => {
      scoreboardData = data;
      gameState = { ...gameState, state: 'scoreboard' };
    });
    
    socket.on('game_ended', (data) => {
      gameState = { ...gameState, state: 'game_ended' };
      gameEndData = data;
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
    
    socket.on('error', (data) => {
      console.error('Socket error:', data.message);
      alert('Error: ' + data.message);
    });
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
  
  function likeLie(lieId) {
    socket.emit('like_lie', { lieId });
  }
  
  onMount(() => {
    initSocket();
  });
  
  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });
  
  // Helper to check if current player
  $: isCurrentPlayer = playerId !== null;
  $: currentPlayer = gameState.players.find(p => p.id === playerId);
</script>

<main class="player-container">
  <div class="connection-indicator" class:connected={connectionStatus === 'connected'}>
    <div class="indicator-dot"></div>
    {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
  </div>
  
  {#if timer > 0}
    <div class="timer-bar">
      <div class="timer-fill" style="animation-duration: {timer}s"></div>
      <div class="timer-text">{timer}s</div>
    </div>
  {/if}
  
  <div class="player-content">
    {#if !isCurrentPlayer}
      <PlayerJoin {connectionStatus} onJoin={joinGame} />
    {:else if gameState.state === 'lobby'}
      <PlayerWaiting {playerName} {gameState} />
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
    {:else if gameState.state === 'option_selection'}
      <PlayerOptionSelect 
        {currentQuestion} 
        {subStepInfo} 
        onSelect={selectOption} 
      />
    {:else if gameState.state === 'truth_reveal'}
      <PlayerTruthReveal {truthRevealData} onLike={likeLie} />
    {:else if gameState.state === 'scoreboard'}
      <PlayerScoreboard {scoreboardData} {currentPlayer} />
    {:else if gameState.state === 'game_ended'}
      <PlayerGameEnd {gameEndData} {currentPlayer} />
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
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .timer-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;
    z-index: 5;
  }
  
  .timer-fill {
    height: 100%;
    background: linear-gradient(90deg, #4ade80, #eab308, #ef4444);
    width: 100%;
    transform-origin: left;
    animation: timer-countdown linear forwards;
  }
  
  @keyframes timer-countdown {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
  
  .timer-text {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 10;
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