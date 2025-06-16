# Lie-Ability Game - Node.js Backend

This directory contains the Node.js backend for the Lie-Ability party game. The backend provides real-time game orchestration, player management, and WebSocket communication via Socket.IO.

## 🏗️ Architecture

### Server Structure
The backend follows a modular architecture with clear separation of concerns:

```
src/
├── server.js                 # Express server & Socket.IO setup
├── models/
│   ├── Game.js              # Core game logic and state management
│   └── Player.js            # Player entity and state
├── services/
│   ├── QuestionService.js   # Question pack management
│   └── TimerService.js      # Game timer coordination
└── utils/
    ├── constants.js         # Game constants and socket events
    └── helpers.js           # Utility functions
```

### Core Components

#### **Server Layer** (`server.js`)
- Express.js HTTP server
- Socket.IO WebSocket management
- API endpoints for health checks and game info
- Connection handling and event routing

#### **Game Model** (`models/Game.js`)
- Central game state management
- Player lifecycle management
- Game flow orchestration
- Real-time event broadcasting

#### **Player Model** (`models/Player.js`)
- Individual player state and data
- Avatar and profile management
- Score tracking and game progress

#### **Services Layer**
- **QuestionService**: Dynamic question pack loading and management
- **TimerService**: Precise game timing and countdown coordination

## 🎮 Game State Management

### Game States
The backend manages game progression through well-defined states:

```javascript
const GAME_STATES = {
  LOBBY: 'lobby',                    // Waiting for players
  CATEGORY_SELECTION: 'category_selection',  // Player selects topic
  QUESTION_READING: 'question_reading',      // Display question
  LIE_SUBMISSION: 'lie_submission',          // Players submit lies
  OPTION_SELECTION: 'option_selection',      // Players vote
  TRUTH_REVEAL: 'truth_reveal',              // Show results
  SCOREBOARD: 'scoreboard',                  // Display scores
  GAME_ENDED: 'game_ended'                   // Game complete
};
```

### State Transitions
Game states transition automatically based on:
- Timer expiration
- Player action completion
- Host commands
- Error conditions

### Frontend State Mapping
Backend states are mapped to frontend phases for clean UI rendering:

```javascript
// Backend State → Frontend Phase
LOBBY → { phase: 'lobby', subStep: 'waiting' }
CATEGORY_SELECTION → { phase: 'playing', subStep: 'category_selection' }
QUESTION_READING → { phase: 'playing', subStep: 'question_reading' }
// ... and so on
GAME_ENDED → { phase: 'game_over', subStep: 'final_results' }
```

## 🔄 Real-Time Communication

### Socket.IO Event System

#### **Client → Server Events**
```javascript
// Player Management
'join_game'           // Player joins with name/avatar
'leave_game'          // Player leaves permanently  
'update_avatar'       // Change player avatar
'update_name'         // Change player name

// Game Actions
'start_game'          // Host starts game
'select_category'     // Player chooses question category
'submit_lie'          // Player submits fake answer
'auto_lie'            // Request auto-generated lie
'select_option'       // Player votes for truth
'like_lie'            // Player likes another's lie

// State Management
'request_game_state'  // Get current game state
'reset_game'          // Host resets to lobby
'change_question_pack' // Switch question pack
```

#### **Server → Client Events**
```javascript
// Game State Updates
'game_state_update'      // Complete game state broadcast
'sub_step_info'          // Player-specific state info
'host_sub_step_info'     // Host-specific state info

// Player Events
'player_joined'          // New player joined
'player_left'            // Player left game
'player_reconnected'     // Player reconnected
'player_avatar_updated'  // Avatar changed
'player_name_updated'    // Name changed

// Game Flow Events
'game_started'           // Game began
'category_selection_start' // Category selection phase
'question_reading_start'   // Question reading phase
'lie_submission_start'     // Lie submission phase
'option_selection_start'   // Voting phase
'truth_reveal_start'       // Results reveal
'scoreboard_update'        // Score changes

// System Events
'timer_update'           // Countdown updates
'error'                  // Error messages
```

### Broadcasting Strategy
The backend uses strategic broadcasting to ensure real-time synchronization:

```javascript
// Global broadcasts (all connected clients)
this.io.emit('game_state_update', gameState);

// Targeted broadcasts (specific players)
this.io.to(socketId).emit('sub_step_info', playerInfo);

// Room-based broadcasts (future feature)
this.io.to(roomId).emit('room_event', data);
```

## ⏱️ Timer Management

### TimerService Features
- **Concurrent Timers**: Multiple timers for different game phases
- **Automatic Cleanup**: Prevents memory leaks and conflicts
- **Tick Callbacks**: Real-time countdown updates
- **Graceful Cancellation**: Safe timer termination

### Timer Configuration
```javascript
const TIMERS = {
  CATEGORY_SELECTION: 15000,  // 15 seconds
  QUESTION_READING: 10000,    // 10 seconds  
  LIE_SUBMISSION: 30000,      // 30 seconds
  OPTION_SELECTION: 30000,    // 30 seconds
  TRUTH_REVEAL: 5000,         // 5 seconds per reveal
  SCOREBOARD: 10000           // 10 seconds
};
```

### Timer Usage Pattern
```javascript
// Start timer with callbacks
this.timerService.startTimer(
  'lie_submission',
  TIMERS.LIE_SUBMISSION,
  () => this.advanceToOptionSelection(), // Completion callback
  (remaining) => this.broadcastTimerUpdate(remaining) // Tick callback
);
```

## 📚 Question Management

### QuestionService Architecture
- **Dynamic Loading**: Loads question packs from filesystem
- **Validation**: Ensures question pack integrity
- **Runtime Switching**: Change question packs during games
- **Extensibility**: Easy addition of new question categories

### Question Pack Structure
```json
{
  "name": "General Knowledge",
  "description": "Mixed trivia questions",
  "categories": [
    {
      "name": "Science",
      "questions": [
        {
          "id": "sci_001",
          "text": "What is the chemical symbol for gold?",
          "answer": "Au",
          "difficulty": "easy",
          "source": "Chemistry basics"
        }
      ]
    }
  ]
}
```

### Question Selection Algorithm
1. **Category Filtering**: Player selects question category
2. **Difficulty Balancing**: Mix of easy/medium/hard questions
3. **Repeat Prevention**: Tracks asked questions per game
4. **Randomization**: Shuffles options and question order

## 🎯 Scoring System

### Point Values
```javascript
const POINTS = {
  ROUND_1: { FOOL_PLAYER: 500,  FIND_TRUTH: 1000 },
  ROUND_2: { FOOL_PLAYER: 1000, FIND_TRUTH: 2000 }, // 2x multiplier
  ROUND_3: { FOOL_PLAYER: 1500, FIND_TRUTH: 3000 }  // 3x multiplier
};
```

### Scoring Logic
- **Fool Points**: Earned when other players select your lie
- **Truth Points**: Earned when you correctly identify the truth
- **Round Multipliers**: Points increase each round for escalating stakes
- **Bonus Systems**: Additional points for creativity and popularity

### Score Calculation
```javascript
// Example scoring for Round 2
const liesVotedFor = 3;  // 3 players fooled
const foundTruth = true; // Player found the correct answer

const score = (liesVotedFor * POINTS.ROUND_2.FOOL_PLAYER) + 
              (foundTruth ? POINTS.ROUND_2.FIND_TRUTH : 0);
// Result: (3 × 1000) + 2000 = 5000 points
```

## 🛡️ Error Handling & Resilience

### Connection Management
- **Graceful Disconnection**: Players can disconnect and reconnect
- **Session Persistence**: Player data preserved during brief disconnections
- **Automatic Cleanup**: Remove inactive players after timeout
- **Host Continuity**: Game continues if host disconnects temporarily

### Error Recovery
```javascript
// Automatic state recovery
if (categorySelector disconnects) {
  autoSelectCategory();
  continueGame();
}

// Graceful error responses
socket.emit('error', { 
  message: 'User-friendly error message',
  code: 'ERROR_CODE',
  recoverable: true 
});
```

### Data Validation
- **Input Sanitization**: Clean user-submitted data
- **State Validation**: Ensure valid state transitions
- **Player Verification**: Authenticate player actions
- **Rate Limiting**: Prevent spam and abuse

## 🔧 API Endpoints

### RESTful Routes
```javascript
// Health & Status
GET  /api/health          // Server health check
GET  /api/game-info       // Current game state
GET  /api/server-info     // Server connection details

// Question Management  
GET  /api/question-packs  // Available question packs

// Static Assets
GET  /host               // Host interface
GET  /player             // Player interface
GET  /                   // Landing page
```

### Response Formats
```javascript
// Health Check Response
{
  "status": "healthy",
  "gameActive": true,
  "playerCount": 4,
  "gameState": "lobby"
}

// Game Info Response
{
  "gameId": "uuid-string",
  "phase": "playing",
  "players": [...],
  "currentRound": 2,
  "currentQuestion": 3
}
```

## 📊 Performance & Scalability

### Memory Management
- **Player Maps**: Efficient O(1) player lookups
- **Timer Cleanup**: Automatic timer garbage collection
- **Event Listeners**: Proper cleanup on disconnection
- **Question Caching**: In-memory question pack storage

### Optimization Strategies
- **Selective Broadcasting**: Only send relevant data to each client
- **State Diffing**: Send only changed state properties
- **Connection Pooling**: Reuse WebSocket connections
- **Graceful Shutdown**: Clean termination of all services

### Scalability Considerations
```javascript
// Current: Single game instance
let game = new Game(io);

// Future: Multiple game rooms
const gameRooms = new Map();
gameRooms.set(roomId, new Game(io.to(roomId)));
```

## 🚀 Development & Deployment

### Local Development
```bash
# Start with hot reload
npm run dev

# Production start
npm start

# Run tests
npm test
```

### Environment Configuration
```javascript
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const QUESTION_PACKS_DIR = process.env.QUESTION_PACKS_DIR || './question_packs';
```

### Production Considerations
- **Process Management**: Use PM2 or similar for production
- **Reverse Proxy**: Nginx for static assets and load balancing
- **WebSocket Scaling**: Redis adapter for multi-server Socket.IO
- **Monitoring**: Health checks and performance metrics

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Debugging & Monitoring

### Logging System
- **Structured Logging**: Consistent log formats
- **Event Tracking**: Player actions and state changes
- **Performance Metrics**: Timer accuracy and response times
- **Error Aggregation**: Centralized error reporting

### Debug Features
```javascript
// Development debug interface
GET /tests/debug-interface.html

// Console logging with emojis for visibility
console.log('🎮 [GAME INIT] Game initialized');
console.log('👋 [PLAYER ACTION] Player joined');
console.log('⚡ [GAME STATE] State transition');
```

### Health Monitoring
- **Player Count Tracking**: Monitor active connections
- **Game State Validation**: Ensure state consistency
- **Timer Accuracy**: Monitor timing precision
- **Memory Usage**: Track resource consumption

This backend provides a robust, scalable foundation for real-time multiplayer gaming, with clean architecture, comprehensive error handling, and production-ready features.