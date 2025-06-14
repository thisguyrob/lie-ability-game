const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const Game = require('./models/Game');
const { SOCKET_EVENTS } = require('./utils/constants');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Configure this for production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Game instance (single game for now)
let game = null;

// Initialize game
async function initializeGame() {
  try {
    console.log('🎮 Creating and initializing game...');
    game = new Game(io);
    await game.init(); // Wait for proper initialization
    console.log('✅ Game initialized and ready');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize game:', error);
    return false;
  }
}

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 [CONNECTION] Client connected: ${socket.id}`);

  // Game should already be initialized by startServer()
  if (!game || !game.initialized) {
    socket.emit(SOCKET_EVENTS.ERROR, { 
      message: 'Server is still initializing. Please wait a moment and try again.' 
    });
    return;
  }

  // Handle player joining
  socket.on(SOCKET_EVENTS.JOIN_GAME, (data) => {
    const { playerName, playerId } = data;
    
    try {
      if (playerId && game.players.has(playerId)) {
        // Reconnecting player
        console.log(`🔄 [PLAYER ACTION] ${playerName} is reconnecting (ID: ${playerId})`);
        const success = game.reconnectPlayer(playerId, socket.id);
        if (success) {
          console.log(`✅ [PLAYER ACTION] ${playerName} reconnected successfully`);
          socket.emit(SOCKET_EVENTS.PLAYER_RECONNECTED, {
            success: true,
            playerId,
            gameState: game.getGameState()
          });
        } else {
          console.log(`❌ [PLAYER ACTION] ${playerName} failed to reconnect`);
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to reconnect' });
        }
      } else {
        // New player
        console.log(`👋 [PLAYER ACTION] New player joining: ${playerName}`);
        const result = game.addPlayer(playerName, socket.id);
        if (result.success) {
          console.log(`✅ [PLAYER ACTION] ${playerName} joined successfully (ID: ${result.player.id})`);
          
          // Send success response to the joining player
          socket.emit(SOCKET_EVENTS.PLAYER_JOINED, {
            success: true,
            player: result.player.getPublicData(),
            gameState: game.getGameState()
          });
          
          // Also send sub-step info so UI knows what to display
          socket.emit('sub_step_info', game.getSubStepInfo(result.player.id));
          
          // The addPlayer method already broadcasts to all players including the new one
        } else {
          console.log(`❌ [PLAYER ACTION] ${playerName} failed to join: ${result.error}`);
          socket.emit(SOCKET_EVENTS.ERROR, { message: result.error });
        }
      }
    } catch (error) {
      console.error('Error in JOIN_GAME:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join game' });
    }
  });

  // Handle game start
  socket.on(SOCKET_EVENTS.START_GAME, () => {
    try {
      const playerId = getPlayerIdBySocketId(socket.id);
      const player = game.players.get(playerId);
      const playerName = player ? player.name : 'Unknown';
      
      console.log(`🚀 [PLAYER ACTION] ${playerName} started the game`);
      
      const result = game.startGame();
      if (!result.success) {
        console.log(`❌ [GAME STATE] Game start failed: ${result.error}`);
        socket.emit(SOCKET_EVENTS.ERROR, { message: result.error });
      } else {
        console.log(`✅ [GAME STATE] Game started successfully with ${game.players.size} players`);
      }
    } catch (error) {
      console.error('Error in START_GAME:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to start game' });
    }
  });

  // Handle category selection
  socket.on(SOCKET_EVENTS.SELECT_CATEGORY, (data) => {
    try {
      const playerId = getPlayerIdBySocketId(socket.id);
      if (!playerId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Player not found' });
        return;
      }

      const player = game.players.get(playerId);
      const playerName = player ? player.name : 'Unknown';
      
      console.log(`🎯 [PLAYER ACTION] ${playerName} selected category ${data.categoryId}`);

      const result = game.selectCategory(playerId, data.categoryId);
      if (!result.success) {
        console.log(`❌ [PLAYER ACTION] Category selection failed for ${playerName}: ${result.error}`);
        socket.emit(SOCKET_EVENTS.ERROR, { message: result.error });
      } else {
        console.log(`✅ [PLAYER ACTION] Category selection successful for ${playerName}`);
      }
    } catch (error) {
      console.error('Error in SELECT_CATEGORY:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to select category' });
    }
  });

  // Handle lie submission
  socket.on(SOCKET_EVENTS.SUBMIT_LIE, (data) => {
    try {
      const playerId = getPlayerIdBySocketId(socket.id);
      if (!playerId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Player not found' });
        return;
      }

      const player = game.players.get(playerId);
      const playerName = player ? player.name : 'Unknown';
      
      console.log(`🤥 [PLAYER ACTION] ${playerName} submitted lie: "${data.lie}"`);

      const result = game.submitLie(playerId, data.lie);
      if (!result.success) {
        console.log(`❌ [PLAYER ACTION] Lie submission failed for ${playerName}: ${result.error}`);
        socket.emit(SOCKET_EVENTS.ERROR, { message: result.error });
      } else {
        console.log(`✅ [PLAYER ACTION] Lie accepted from ${playerName}`);
        socket.emit('lie_submitted', { success: true });
      }
    } catch (error) {
      console.error('Error in SUBMIT_LIE:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to submit lie' });
    }
  });

  // Handle request for automatic lie
  socket.on(SOCKET_EVENTS.AUTO_LIE, () => {
    try {
      const playerId = getPlayerIdBySocketId(socket.id);
      if (!playerId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Player not found' });
        return;
      }

      const player = game.players.get(playerId);
      const playerName = player ? player.name : 'Unknown';
      const autoLie = game.getRandomLieForCurrentQuestion();

      console.log(`🎲 [PLAYER ACTION] ${playerName} requested auto lie: "${autoLie}"`);

      const result = game.submitLie(playerId, autoLie);
      if (!result.success) {
        console.log(`❌ [PLAYER ACTION] Auto lie failed for ${playerName}: ${result.error}`);
        socket.emit(SOCKET_EVENTS.ERROR, { message: result.error });
      } else {
        console.log(`✅ [PLAYER ACTION] Auto lie accepted for ${playerName}`);
        socket.emit('lie_submitted', { success: true, auto: true });
      }
    } catch (error) {
      console.error('Error in AUTO_LIE:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to auto submit lie' });
    }
  });

  // Handle option selection
  socket.on(SOCKET_EVENTS.SELECT_OPTION, (data) => {
    try {
      const playerId = getPlayerIdBySocketId(socket.id);
      if (!playerId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Player not found' });
        return;
      }

      const player = game.players.get(playerId);
      const playerName = player ? player.name : 'Unknown';
      
      // Find the selected option text for logging
      const selectedOption = game.shuffledOptions?.find(opt => opt.id === data.optionId);
      const optionText = selectedOption ? selectedOption.text : 'Unknown option';
      
      console.log(`🗳️ [PLAYER ACTION] ${playerName} voted for: "${optionText}"`);

      const result = game.selectOption(playerId, data.optionId);
      if (!result.success) {
        console.log(`❌ [PLAYER ACTION] Vote failed for ${playerName}: ${result.error}`);
        socket.emit(SOCKET_EVENTS.ERROR, { message: result.error });
      } else {
        console.log(`✅ [PLAYER ACTION] Vote recorded for ${playerName}`);
        socket.emit('option_selected', { success: true });
      }
    } catch (error) {
      console.error('Error in SELECT_OPTION:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to select option' });
    }
  });

  // Handle like lie
  socket.on(SOCKET_EVENTS.LIKE_LIE, (data) => {
    try {
      const playerId = getPlayerIdBySocketId(socket.id);
      if (!playerId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Player not found' });
        return;
      }

      const player = game.players.get(playerId);
      const likedPlayer = game.players.get(data.likedPlayerId);
      const playerName = player ? player.name : 'Unknown';
      const likedPlayerName = likedPlayer ? likedPlayer.name : 'Unknown';
      
      console.log(`👍 [PLAYER ACTION] ${playerName} liked ${likedPlayerName}'s lie`);

      const result = game.likeLie(playerId, data.likedPlayerId);
      if (!result.success) {
        console.log(`❌ [PLAYER ACTION] Like failed for ${playerName}: ${result.error}`);
        socket.emit(SOCKET_EVENTS.ERROR, { message: result.error });
      } else {
        console.log(`✅ [PLAYER ACTION] Like recorded: ${playerName} → ${likedPlayerName}`);
        socket.emit('lie_liked', { success: true });
      }
    } catch (error) {
      console.error('Error in LIKE_LIE:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to like lie' });
    }
  });

  // Handle game state request
  socket.on(SOCKET_EVENTS.REQUEST_GAME_STATE, () => {
    try {
      const playerId = getPlayerIdBySocketId(socket.id);
      
      // Always send game state, even if player hasn't joined yet
      socket.emit(SOCKET_EVENTS.GAME_STATE_UPDATE, game.getGameState());
      
      // Send sub-step info only if player has joined
      if (playerId) {
        socket.emit('sub_step_info', game.getSubStepInfo(playerId));
      } else {
        // Send basic sub-step info for non-joined users
        socket.emit('sub_step_info', { 
          state: game.state, 
          isSelector: false, 
          hasSubmittedLie: false, 
          hasSelectedOption: false 
        });
      }
    } catch (error) {
      console.error('Error in REQUEST_GAME_STATE:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to get game state' });
    }
  });

  // Handle question pack change
  socket.on(SOCKET_EVENTS.CHANGE_QUESTION_PACK, (data) => {
    try {
      const result = game.changeQuestionPack(data.packName);
      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: result.error });
      } else {
        socket.emit('question_pack_changed', { success: true, packName: data.packName });
      }
    } catch (error) {
      console.error('Error in CHANGE_QUESTION_PACK:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to change question pack' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 [CONNECTION] Client disconnected: ${socket.id}`);
    
    try {
      const playerId = getPlayerIdBySocketId(socket.id);
      if (playerId) {
        const player = game.players.get(playerId);
        const playerName = player ? player.name : 'Unknown';
        console.log(`👋 [PLAYER ACTION] ${playerName} disconnected (but can reconnect)`);
        game.disconnectPlayer(playerId);
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });

  // Handle explicit leave game
  socket.on(SOCKET_EVENTS.LEAVE_GAME, () => {
    try {
      const playerId = getPlayerIdBySocketId(socket.id);
      if (playerId) {
        const player = game.players.get(playerId);
        const playerName = player ? player.name : 'Unknown';
        console.log(`🚪 [PLAYER ACTION] ${playerName} left the game permanently`);
        game.removePlayer(playerId);
      }
    } catch (error) {
      console.error('Error in LEAVE_GAME:', error);
    }
  });
});

// Helper function to find player ID by socket ID
function getPlayerIdBySocketId(socketId) {
  if (!game) return null;
  
  for (const [playerId, player] of game.players.entries()) {
    if (player.socketId === socketId) {
      return playerId;
    }
  }
  return null;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    gameActive: !!game,
    playerCount: game ? game.players.size : 0,
    gameState: game ? game.state : null
  });
});

app.get('/api/game-info', (req, res) => {
  if (!game) {
    return res.status(404).json({ error: 'No active game' });
  }
  
  res.json(game.getGameState());
});

app.get('/api/question-packs', async (req, res) => {
  try {
    if (!game) {
      game = new Game(io);
    }
    
    const packs = game.questionService.getAvailablePacks();
    res.json({
      available: packs,
      current: game.questionService.currentPack
    });
  } catch (error) {
    console.error('Error getting question packs:', error);
    res.status(500).json({ error: 'Failed to load question packs' });
  }
});

// Serve debug interface from tests folder
app.get('/tests/debug-interface.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../tests/debug-interface.html'));
});

// Serve static files for frontend (when we build it)
app.use(express.static(path.join(__dirname, '../public')));

// Fallback to index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🚀 Starting Lie-Ability Game Server...');
    
    // Initialize game first and wait for it to be ready
    const gameReady = await initializeGame();
    if (!gameReady) {
      throw new Error('Game initialization failed');
    }
    
    // Then start the server
    server.listen(PORT, () => {
      console.log(`🎮 Lie-Ability Game Server running on port ${PORT}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`🔧 Debug Interface: http://localhost:${PORT}/tests/debug-interface.html`);
      console.log(`📁 Question packs directory: ${path.join(process.cwd(), 'question_packs')}`);
      console.log(`✅ Server ready to accept connections`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  if (game) {
    game.timerService.cancelAllTimers();
    game.broadcastToAll(SOCKET_EVENTS.ERROR, { message: 'Server shutting down' });
  }
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  
  if (game) {
    game.timerService.cancelAllTimers();
    game.broadcastToAll(SOCKET_EVENTS.ERROR, { message: 'Server shutting down' });
  }
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});