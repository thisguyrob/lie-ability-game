# Development Guide

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git** for version control
- Modern web browser with WebSocket support

### Initial Setup

**1. Clone and Install Dependencies**:
```bash
# Clone the repository
git clone <repository-url>
cd lie-ability-game

# Install backend dependencies
npm install

# Install frontend dependencies
cd svelte
npm install
cd ..
```

**2. Environment Configuration**:
```bash
# Create environment file (optional)
cp .env.example .env

# Configure ports and settings
# Default: Backend on :3000, Frontend on :5173
```

**3. Start Development Servers**:
```bash
# Terminal 1: Start backend server
npm run dev
# or
node src/server.js

# Terminal 2: Start frontend development server
cd svelte
npm run dev
```

**4. Access the Application**:
- **Host Interface**: http://localhost:5173/host.html
- **Player Interface**: http://localhost:5173/player.html
- **Backend API**: http://localhost:3000

## Project Architecture

### Development Workflow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   Question      │
│   (Svelte)      │◄──►│   (Node.js)      │◄──►│   Packs         │
│                 │    │                  │    │   (JSON)        │
│   Host/Player   │    │  Socket.IO       │    │                 │
│   Interfaces    │    │  Game Logic      │    │  Categories     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### File Structure Overview

```
lie-ability-game/
├── src/                    # Backend source code
│   ├── server.js          # Entry point
│   ├── models/            # Game and Player classes
│   ├── services/          # External services
│   └── utils/             # Constants and helpers
├── svelte/                # Frontend source code
│   ├── src/               # Svelte components
│   └── public/            # Static assets
├── question_packs/        # Question data
├── docs/                  # Documentation
├── tests/                 # Test suites
└── package.json           # Dependencies and scripts
```

## Development Patterns

### Backend Development

**Adding New Game States**:
```javascript
// 1. Add to constants.js
const GAME_STATES = {
  // ... existing states
  NEW_STATE: 'new_state'
};

// 2. Add to Game.js state machine
advanceToNewState() {
  this.state = GAME_STATES.NEW_STATE;
  this.broadcastGameStateAndSubStep();
  
  // Set timer if needed
  setTimeout(() => {
    this.nextState();
  }, TIMERS.NEW_STATE);
}

// 3. Add timer configuration
const TIMERS = {
  // ... existing timers
  NEW_STATE: 15000  // 15 seconds
};

// 4. Update frontend state handling
```

**Adding New Socket Events**:
```javascript
// 1. Define event constant
const SOCKET_EVENTS = {
  // ... existing events
  NEW_EVENT: 'new_event'
};

// 2. Add server handler
socket.on('new_event', (data) => {
  try {
    game.handleNewEvent(socket.id, data);
  } catch (error) {
    handleError(socket, error, 'new_event');
  }
});

// 3. Add game method
handleNewEvent(socketId, data) {
  const player = this.getPlayerBySocketId(socketId);
  if (!player) throw new Error('Player not found');
  
  // Validate and process
  this.validateNewEventData(data);
  this.processNewEvent(player, data);
  
  // Broadcast updates
  this.broadcastGameStateAndSubStep();
}
```

**Database Integration Pattern** (if needed):
```javascript
// services/DatabaseService.js
class DatabaseService {
  async saveGameResult(gameData) {
    // Implementation for game persistence
  }
  
  async getPlayerStats(playerId) {
    // Implementation for player statistics
  }
}

// Usage in Game.js
endGame() {
  const gameResult = this.getGameSummary();
  this.databaseService.saveGameResult(gameResult);
}
```

### Frontend Development

**Adding New Components**:
```svelte
<!-- NewComponent.svelte -->
<script>
  export let data = {};
  export let onAction = () => {};
  
  // Component logic
  let localState = '';
  
  $: reactiveValue = data?.someProperty || '';
  
  function handleLocalAction() {
    // Validate and process
    if (validate()) {
      onAction(localState);
    }
  }
</script>

<div class="component-container">
  <!-- Component template -->
  <button on:click={handleLocalAction}>Action</button>
</div>

<style>
  .component-container {
    /* Component styles */
  }
</style>
```

**Socket Integration Pattern**:
```svelte
<script>
  import io from 'socket.io-client';
  import { onMount, onDestroy } from 'svelte';
  
  let socket;
  
  onMount(() => {
    socket = io('http://localhost:3000');
    setupSocketListeners();
  });
  
  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });
  
  function setupSocketListeners() {
    socket.on('new_event', handleNewEvent);
    socket.on('error', handleError);
  }
  
  function handleNewEvent(data) {
    // Update component state
  }
</script>
```

## Testing

### Unit Testing

**Backend Tests** (using Jest):
```javascript
// tests/unit/Game.test.js
const Game = require('../../src/models/Game');

describe('Game', () => {
  let game;
  
  beforeEach(() => {
    game = new Game();
  });
  
  test('should start in lobby state', () => {
    expect(game.state).toBe('lobby');
  });
  
  test('should add players correctly', () => {
    game.addPlayer(mockSocket, { playerName: 'Test' });
    expect(game.players.size).toBe(1);
  });
});
```

**Frontend Tests** (using Vitest):
```javascript
// svelte/tests/PlayerJoin.test.js
import { render, fireEvent } from '@testing-library/svelte';
import PlayerJoin from '../src/components/player/PlayerJoin.svelte';

test('should emit join event on form submit', async () => {
  const mockOnJoin = jest.fn();
  const { getByRole } = render(PlayerJoin, { onJoin: mockOnJoin });
  
  await fireEvent.click(getByRole('button'));
  expect(mockOnJoin).toHaveBeenCalled();
});
```

### Integration Testing

**Game Flow Testing**:
```javascript
// tests/integration/gameFlow.test.js
describe('Complete Game Flow', () => {
  test('should complete full game cycle', async () => {
    // Start game
    const game = new Game();
    
    // Add players
    game.addPlayer(mockSocket1, { playerName: 'Player1' });
    game.addPlayer(mockSocket2, { playerName: 'Player2' });
    
    // Start game
    game.startGame();
    expect(game.state).toBe('category_selection');
    
    // Continue through all states...
  });
});
```

### Manual Testing

**Debug Interface**:
```html
<!-- tests/debug-interface.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Debug Interface</title>
</head>
<body>
  <div id="debug-controls">
    <button onclick="addPlayer()">Add Player</button>
    <button onclick="startGame()">Start Game</button>
    <button onclick="skipPhase()">Skip Phase</button>
  </div>
  
  <script>
    // Debug functions for manual testing
  </script>
</body>
</html>
```

## Debugging

### Server-Side Debugging

**Logging Configuration**:
```javascript
// Enhanced logging
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(category, message, data = null) {
  if (DEBUG) {
    console.log(`🐛 [${category}] ${message}`, data || '');
  }
}

// Usage
debugLog('GAME_STATE', 'Player joined', { playerId, playerName });
debugLog('SOCKET', 'Event received', { event: 'submit_lie', data });
```

**Error Tracking**:
```javascript
// Centralized error handling
function handleError(socket, error, context) {
  console.error(`❌ [ERROR] ${context}:`, error);
  
  // Send to client
  socket.emit('error', {
    message: error.message,
    context: context,
    timestamp: new Date().toISOString()
  });
  
  // Log to file in production
  if (process.env.NODE_ENV === 'production') {
    logToFile('errors.log', { error, context, timestamp: new Date() });
  }
}
```

### Client-Side Debugging

**Debug Panel Component**:
```svelte
<!-- DebugPanel.svelte -->
{#if $debugMode}
  <div class="debug-panel">
    <h3>Debug Info</h3>
    <pre>{JSON.stringify(gameState, null, 2)}</pre>
    <button on:click={() => socket.emit('debug_skip_phase')}>
      Skip Phase
    </button>
  </div>
{/if}
```

**Console Logging**:
```javascript
// Debug store
import { writable } from 'svelte/store';

export const debugMode = writable(false);
export const debugLog = writable([]);

// Debug functions
window.debugGame = {
  enableDebug: () => debugMode.set(true),
  showGameState: () => console.log(gameState),
  skipPhase: () => socket.emit('debug_skip_phase')
};
```

## Common Issues & Solutions

### Connection Issues

**Problem**: Players can't connect to the game
```javascript
// Solution: Check CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

**Problem**: Socket disconnections not handled properly
```javascript
// Solution: Robust disconnect handling
socket.on('disconnect', (reason) => {
  console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
  
  if (game.players.has(playerId)) {
    game.handlePlayerDisconnect(playerId);
  }
});
```

### State Synchronization Issues

**Problem**: Client and server state out of sync
```javascript
// Solution: Force state resync
socket.on('request_state_sync', () => {
  const fullState = game.getFullGameState();
  socket.emit('state_sync', fullState);
});
```

**Problem**: Race conditions in rapid events
```javascript
// Solution: Event queuing
class EventQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  
  async addEvent(event) {
    this.queue.push(event);
    if (!this.processing) {
      await this.processQueue();
    }
  }
}
```

### Performance Issues

**Problem**: Memory leaks from timer accumulation
```javascript
// Solution: Proper timer cleanup
class TimerService {
  cleanup() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }
}
```

**Problem**: Large payload sizes
```javascript
// Solution: Data minimization
getMinimalGameState() {
  return {
    state: this.state,
    round: this.currentRound,
    // Only include necessary data
  };
}
```

## Deployment

### Production Build

**Backend Preparation**:
```bash
# Install production dependencies only
npm ci --only=production

# Set environment variables
export NODE_ENV=production
export PORT=3000

# Start with process manager
pm2 start src/server.js --name lie-ability-game
```

**Frontend Build**:
```bash
cd svelte
npm run build

# Static files generated in dist/
# Serve with nginx or similar
```

### Environment Configuration

**Production Environment**:
```bash
# .env.production
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

**Development Environment**:
```bash
# .env.development
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
DEBUG_MODE=true
```

### Monitoring

**Health Checks**:
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount,
    activeGames: gameManager.getActiveGameCount()
  });
});
```

**Performance Monitoring**:
```javascript
// Basic metrics collection
const metrics = {
  gamesPlayed: 0,
  playersConnected: 0,
  averageGameDuration: 0
};

setInterval(() => {
  console.log('📊 [METRICS]', metrics);
}, 60000); // Log every minute
```

## Contributing Guidelines

### Code Style

**JavaScript/Svelte Formatting**:
- Use Prettier for consistent formatting
- 2-space indentation
- Semicolons required
- Single quotes for strings

**Commit Messages**:
```
type(scope): description

Examples:
feat(game): add new voting mechanism
fix(ui): resolve scoreboard display issue
docs(api): update socket event documentation
```

### Pull Request Process

1. **Feature Branch**: Create from `main`
2. **Development**: Follow coding standards
3. **Testing**: Add/update tests as needed
4. **Documentation**: Update relevant docs
5. **Review**: Submit PR with clear description

### Code Review Checklist

- [ ] Code follows established patterns
- [ ] New features include tests
- [ ] Documentation updated
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Performance considerations addressed