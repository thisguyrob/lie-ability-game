<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  import QRCode from 'qrcode';
  
  // Components
  import Lobby from './components/Lobby.svelte';
  import QuestionView from './components/QuestionView.svelte';
  import TruthReveal from './components/TruthReveal.svelte';
  import Scoreboard from './components/Scoreboard.svelte';
  
  // State
  let socket;
  let gameState = {
    phase: 'lobby',
    round: 1,
    question: 1,
    subStep: 'waiting',
    players: [],
    currentQuestion: null,
    options: [],
    scores: {},
    timer: null,
    hostSubStepInfo: null
  };
  
  let serverInfo = {
    playerUrl: '',
    qrCodeDataUrl: ''
  };
  
  let connectionStatus = 'connecting';
  let errorMessage = '';
  
  // Socket connection and event handlers
  onMount(async () => {
    // Get server info for QR code
    try {
      const response = await fetch('/api/server-info');
      if (response.ok) {
        const info = await response.json();
        serverInfo.playerUrl = info.playerUrl;
        
        // Generate QR code
        serverInfo.qrCodeDataUrl = await QRCode.toDataURL(info.playerUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#374151',
            light: '#ffffff'
          }
        });
      }
    } catch (error) {
      console.error('Failed to get server info:', error);
    }
    
    // Initialize socket connection
    socket = io();
    
    socket.on('connect', () => {
      connectionStatus = 'connected';
      console.log('Host connected to server');
      requestGameState();
    });
    
    socket.on('disconnect', () => {
      connectionStatus = 'disconnected';
      console.log('Host disconnected from server');
    });
    
    socket.on('connect_error', (error) => {
      connectionStatus = 'error';
      errorMessage = 'Failed to connect to game server';
      console.error('Connection error:', error);
    });
    
    socket.on('game_state_update', (newState) => {
      console.log('Game state update:', newState);
      // Ensure players array is always an array
      if (newState.players && !Array.isArray(newState.players)) {
        newState.players = [];
      }
      gameState = { ...gameState, ...newState };
    });

    // Listen for specific player events for real-time updates
    socket.on('player_joined', (data) => {
      console.log('Player joined:', data);
      // Update players list immediately for real-time display
      if (data.player) {
        if (!gameState.players) {
          gameState.players = [];
        }
        const existingIndex = gameState.players.findIndex(p => p.id === data.player.id);
        if (existingIndex === -1) {
          gameState.players = [...gameState.players, data.player];
        } else {
          gameState.players[existingIndex] = data.player;
        }
        // Trigger reactivity
        gameState = gameState;
      }
      // Request fresh game state after a delay to ensure consistency
      setTimeout(() => requestGameState(), 500);
    });

    socket.on('player_left', (data) => {
      console.log('Player left:', data);
      // Remove player immediately for real-time display
      if (data.playerId) {
        if (!gameState.players) {
          gameState.players = [];
        } else {
          gameState.players = gameState.players.filter(p => p.id !== data.playerId);
        }
        // Trigger reactivity
        gameState = gameState;
      }
      // Request fresh game state after a delay to ensure consistency
      setTimeout(() => requestGameState(), 500);
    });

    socket.on('player_reconnected', (data) => {
      console.log('Player reconnected:', data);
      // Request fresh game state since reconnection might change player states
      requestGameState();
    });

    socket.on('player_avatar_updated', (data) => {
      console.log('Player avatar updated:', data);
      // Update specific player's avatar immediately
      if (data.playerId) {
        if (!gameState.players) {
          gameState.players = [];
        } else {
          const playerIndex = gameState.players.findIndex(p => p.id === data.playerId);
          if (playerIndex !== -1) {
            gameState.players[playerIndex].avatar = data.avatar;
            gameState.players = [...gameState.players]; // Trigger reactivity
          }
        }
      }
    });

    socket.on('player_name_updated', (data) => {
      console.log('Player name updated:', data);
      // Update specific player's name immediately
      if (data.playerId) {
        if (!gameState.players) {
          gameState.players = [];
        } else {
          const playerIndex = gameState.players.findIndex(p => p.id === data.playerId);
          if (playerIndex !== -1) {
            gameState.players[playerIndex].name = data.name;
            gameState.players = [...gameState.players]; // Trigger reactivity
          }
        }
      }
    });

    socket.on('host_sub_step_info', (hostInfo) => {
      console.log('Host sub-step info:', hostInfo);
      // Update host-specific sub-step information
      gameState.hostSubStepInfo = hostInfo;
    });
    
    socket.on('timer_update', (timerData) => {
      gameState.timer = timerData;
    });
    
    socket.on('truth_reveal_start', (revealData) => {
      gameState.revealData = revealData;
    });
    
    socket.on('error', (error) => {
      errorMessage = error.message || 'An error occurred';
      console.error('Socket error:', error);
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
  
  function startGame() {
    if (socket && gameState.players.length >= 2) {
      socket.emit('start_game');
    }
  }
  
  function resetGame() {
    if (socket) {
      socket.emit('reset_game');
      // Reset local game state to default
      gameState = {
        phase: 'lobby',
        round: 1,
        question: 1,
        subStep: 'waiting',
        players: [],
        currentQuestion: null,
        options: [],
        scores: {},
        timer: null,
        hostSubStepInfo: null
      };
      // Request fresh game state after reset
      setTimeout(() => requestGameState(), 100);
    }
  }
  
  // Computed values
  $: canStartGame = (gameState.players || []).length >= 2 && gameState.phase === 'lobby';
  $: connectedPlayers = (gameState.players || []).filter(p => p.connected);
  $: gameInProgress = gameState.phase !== 'lobby';
</script>

<main class="host-container">
  <!-- Status Bar (always visible with player count) -->
  <div class="status-bar" class:connected={connectionStatus === 'connected'} 
       class:disconnected={connectionStatus === 'disconnected'}
       class:error={connectionStatus === 'error'}
       class:minimal={connectionStatus === 'connected' && !errorMessage}>
    <div class="container">
      <div class="status-content">
        <!-- Connection status (only show when not connected or has errors) -->
        {#if connectionStatus !== 'connected' || errorMessage}
          <div class="status-indicator">
            <div class="status-dot"></div>
            <span class="status-text">
              {#if connectionStatus === 'connected'}
                🟢 Connected
              {:else if connectionStatus === 'disconnected'}
                🔴 Disconnected
              {:else if connectionStatus === 'error'}
                ⚠️ Connection Error
              {:else}
                🟡 Connecting...
              {/if}
            </span>
          </div>
          
          {#if errorMessage}
            <div class="error-message">{errorMessage}</div>
          {/if}
        {/if}
        
        <!-- Player count (always visible) -->
        <div class="player-count">
          {connectedPlayers.length} player{connectedPlayers.length !== 1 ? 's' : ''} connected
        </div>
      </div>
    </div>
  </div>

  <!-- Main Game Content -->
  <div class="game-content">
    {#if gameState.phase === 'lobby'}
      <Lobby 
        {gameState}
        {serverInfo}
        {canStartGame}
        on:startGame={startGame}
        on:resetGame={resetGame}
      />
    {:else if gameState.phase === 'playing'}
      {#if gameState.subStep === 'category_selection' || gameState.subStep === 'question_reading' || gameState.subStep === 'lie_submission' || gameState.subStep === 'option_selection'}
        <QuestionView {gameState} />
      {:else if gameState.subStep === 'truth_reveal'}
        <TruthReveal {gameState} />
      {:else if gameState.subStep === 'scoreboard'}
        <Scoreboard {gameState} />
      {/if}
    {:else if gameState.phase === 'game_over'}
      <Scoreboard {gameState} isGameOver={true} on:resetGame={resetGame} />
    {/if}
  </div>
  
  <!-- Debug Info (only in development) -->
  {#if import.meta.env.DEV && gameState.phase !== 'lobby'}
    <div class="debug-panel">
      <details>
        <summary>🔧 Debug</summary>
        <pre>{JSON.stringify({phase: gameState.phase, subStep: gameState.subStep, players: gameState.players?.length}, null, 2)}</pre>
      </details>
    </div>
  {/if}
</main>

<style>
  .host-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    position: relative;
  }
  
  .status-bar {
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: var(--space-3) 0;
    transition: all var(--transition);
  }
  
  .status-bar.connected {
    background: rgba(16, 185, 129, 0.1);
  }
  
  .status-bar.disconnected {
    background: rgba(239, 68, 68, 0.1);
  }
  
  .status-bar.error {
    background: rgba(245, 158, 11, 0.1);
  }

  .status-bar.minimal {
    background: rgba(0, 0, 0, 0.05);
    padding: var(--space-2) 0;
  }
  
  .status-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-4);
  }
  
  .status-indicator {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--success);
    animation: pulse 2s infinite;
  }
  
  .status-text {
    color: var(--white);
    font-weight: 600;
    font-size: var(--font-size-sm);
  }
  
  .error-message {
    color: var(--white);
    background: rgba(239, 68, 68, 0.2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius);
    font-size: var(--font-size-sm);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .player-count {
    color: var(--white);
    font-size: var(--font-size-sm);
    opacity: 0.9;
  }
  
  .game-content {
    flex: 1;
    padding: var(--space-6) 0;
  }
  
  .debug-panel {
    position: fixed;
    bottom: var(--space-4);
    right: var(--space-4);
    background: rgba(0, 0, 0, 0.8);
    color: var(--white);
    padding: var(--space-3);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-xs);
    max-width: 300px;
    max-height: 200px;
    overflow: auto;
    z-index: 1000;
  }
  
  .debug-panel summary {
    cursor: pointer;
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  
  .debug-panel pre {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 10px;
    line-height: 1.2;
    white-space: pre-wrap;
    word-break: break-all;
  }
  
  @media (max-width: 768px) {
    .status-content {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-2);
    }
    
    .game-content {
      padding: var(--space-4) 0;
    }
    
    .debug-panel {
      bottom: var(--space-2);
      right: var(--space-2);
      max-width: calc(100vw - var(--space-4));
    }
  }
</style>