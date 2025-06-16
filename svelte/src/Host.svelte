<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  import QRCode from 'qrcode';
  
  import Lobby from './components/Lobby.svelte';
  import CategorySelection from './components/CategorySelection.svelte';
  import QuestionView from './components/QuestionView.svelte';
  import TruthReveal from './components/TruthReveal.svelte';
  import Scoreboard from './components/Scoreboard.svelte';
  import GameEnd from './components/GameEnd.svelte';
  
  let socket;
  let gameState = {
    state: 'lobby',
    players: [],
    currentRound: 1,
    totalRounds: 3,
    currentQuestion: 1
  };
  let currentQuestion = null;
  let timer = 0;
  let qrCodeUrl = '';
  let serverUrl = '';
  let truthRevealData = null;
  let scoreboardData = null;
  let gameEndData = null;
  
  // Debug reactive statement
  $: console.log('Host gameState changed:', gameState);
  
  // Get server URL for QR code
  async function getServerInfo() {
    try {
      const response = await fetch('/api/server-info');
      const data = await response.json();
      serverUrl = data.playerUrl;
      qrCodeUrl = await QRCode.toDataURL(serverUrl);
    } catch (error) {
      console.error('Failed to get server info:', error);
      serverUrl = window.location.origin + '/player';
      qrCodeUrl = await QRCode.toDataURL(serverUrl);
    }
  }
  
  function initSocket() {
    socket = io();
    
    socket.on('connect', () => {
      console.log('Host connected to server');
      socket.emit('request_game_state');
    });
    
    socket.on('game_state_update', (data) => {
      // Force reactivity by creating a new object
      gameState = { ...data };
    });
    
    socket.on('category_selection_start', (data) => {
      gameState = { ...gameState, state: 'category_selection' };
      currentQuestion = {
        categories: data.categories,
        selectorName: data.selectorName
      };
    });
    
    socket.on('question_reading_start', (data) => {
      gameState = { ...gameState, state: 'question_reading' };
      currentQuestion = data;
    });
    
    socket.on('lie_submission_start', (data) => {
      gameState = { ...gameState, state: 'lie_submission' };
    });
    
    socket.on('option_selection_start', (data) => {
      gameState = { ...gameState, state: 'option_selection' };
      currentQuestion = { ...currentQuestion, options: data.options };
    });
    
    socket.on('truth_reveal_start', (data) => {
      gameState = { ...gameState, state: 'truth_reveal' };
      truthRevealData = data;
    });
    
    socket.on('scoreboard_update', (data) => {
      gameState = { ...gameState, state: 'scoreboard' };
      scoreboardData = data;
    });
    
    socket.on('game_ended', (data) => {
      gameState = { ...gameState, state: 'game_ended' };
      gameEndData = data;
    });
    
    socket.on('timer_update', (data) => {
      timer = data.secondsRemaining;
    });
    
    socket.on('player_joined', (data) => {
      if (data.gameState) {
        gameState = data.gameState;
      }
    });
    
    socket.on('player_left', (data) => {
      if (data.gameState) {
        gameState = data.gameState;
      }
    });
  }
  
  function startGame() {
    socket.emit('start_game');
  }
  
  onMount(async () => {
    await getServerInfo();
    initSocket();
  });
  
  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });
</script>

<main class="host-container">
  
  {#if timer > 0}
    <div class="timer-display" class:urgent={timer <= 5}>
      <div class="timer-circle">
        <span class="timer-text">{timer}</span>
      </div>
    </div>
  {/if}
  
  <div class="game-content">
    {#if gameState.state === 'lobby'}
      <Lobby {gameState} {qrCodeUrl} {serverUrl} onStart={startGame} />
    {:else if gameState.state === 'category_selection'}
      <CategorySelection {currentQuestion} />
    {:else if gameState.state === 'question_reading' || gameState.state === 'lie_submission'}
      <QuestionView {currentQuestion} state={gameState.state} />
    {:else if gameState.state === 'option_selection'}
      <QuestionView {currentQuestion} state={gameState.state} />
    {:else if gameState.state === 'truth_reveal'}
      <TruthReveal data={truthRevealData} />
    {:else if gameState.state === 'scoreboard'}
      <Scoreboard data={scoreboardData} />
    {:else if gameState.state === 'game_ended'}
      <GameEnd data={gameEndData} />
    {/if}
  </div>
  
</main>

<style>
  .host-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
  }
  
  
  .timer-display {
    position: absolute;
    top: 2rem;
    right: 2rem;
    z-index: 20;
  }
  
  .timer-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  }
  
  .timer-display.urgent .timer-circle {
    background: #ff4757;
    animation: pulse 0.5s infinite alternate;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.1); }
  }
  
  .timer-text {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }
  
  .timer-display.urgent .timer-text {
    color: white;
  }
  
  .game-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2rem;
    min-height: 0;
  }
  
  
  @media (max-width: 768px) {
    .timer-circle {
      width: 60px;
      height: 60px;
    }

    .timer-text {
      font-size: 1.4rem;
    }

  }
</style>