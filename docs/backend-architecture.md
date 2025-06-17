# Backend Architecture

## Overview

The Lie Ability Game backend is built on Node.js with Socket.IO for real-time communication. The architecture follows a modular design with clear separation of concerns between game logic, player management, and external services.

## Project Structure

```
src/
├── server.js              # Main server entry point
├── models/                # Core game entities
│   ├── Game.js           # Game state and logic
│   └── Player.js         # Player data and actions
├── services/             # External services
│   ├── QuestionService.js # Question loading and management
│   └── TimerService.js   # Timer management and scheduling
├── utils/                # Shared utilities
│   ├── constants.js      # Game constants and configuration
│   └── helpers.js        # Utility functions
└── controllers/          # API endpoints (if needed)
```

## Core Components

### Server (`src/server.js`)

**Responsibilities**:
- Socket.IO server initialization
- Connection management
- Event routing to game instances
- Error handling and logging

**Key Features**:
```javascript
// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Route events to game instance
  socket.on('join_game', (data) => {
    game.handlePlayerJoin(socket, data);
  });
});
```

**Event Handlers**:
- `join_game` - Player connection and game joining
- `start_game` - Host initiates gameplay
- `select_category` - Category selection by host
- `submit_lie` - Player lie submission
- `select_option` - Player voting
- `like_lie` - Social like interactions
- `disconnect` - Connection cleanup

### Game Model (`src/models/Game.js`)

**Responsibilities**:
- Game state management
- Round and question progression
- Player coordination
- Score calculation
- Timer management

**Core Properties**:
```javascript
class Game {
  constructor() {
    this.id = generateRoomCode();
    this.state = GAME_STATES.LOBBY;
    this.players = new Map();
    this.currentRound = 1;
    this.currentQuestion = 1;
    this.totalRounds = 5;
    this.currentQuestionData = null;
    this.playerLies = new Map();
    this.playerGuesses = new Map();
    this.shuffledOptions = [];
    this.truthIndex = -1;
    this.timerService = new TimerService();
  }
}
```

**Key Methods**:

**Player Management**:
```javascript
addPlayer(socket, playerData) {
  const player = new Player(playerData.playerName, socket.id, playerData.avatar);
  this.players.set(player.id, player);
  this.broadcastToAll(SOCKET_EVENTS.PLAYER_JOINED, player.getPublicData());
}

removePlayer(playerId) {
  this.players.delete(playerId);
  this.broadcastToAll(SOCKET_EVENTS.PLAYER_LEFT, { playerId });
}
```

**Game Flow Control**:
```javascript
startGame() {
  this.state = GAME_STATES.CATEGORY_SELECTION;
  this.broadcastGameStateAndSubStep();
}

advanceGame() {
  if (this.currentQuestion < this.questionsPerRound) {
    this.nextQuestion();
  } else if (this.currentRound < this.totalRounds) {
    this.nextRound();
  } else {
    this.endGame();
  }
}
```

**Score Calculation**:
```javascript
calculateScores() {
  // Award points for fooling players
  for (const [playerId, lie] of this.playerLies.entries()) {
    const votesReceived = this.countVotesForLie(lie);
    const points = votesReceived * GAME_CONFIG.POINTS[`ROUND_${this.currentRound}`].FOOL_PLAYER;
    player.addPoints(points);
  }
  
  // Award points for finding truth
  for (const [playerId, optionIndex] of this.playerGuesses.entries()) {
    if (optionIndex === this.truthIndex) {
      player.addPoints(GAME_CONFIG.POINTS[`ROUND_${this.currentRound}`].FIND_TRUTH);
    }
  }
}

calculateLikes() {
  // Count likes received (called before scoreboard)
  for (const player of this.players.values()) {
    let likesReceived = 0;
    for (const otherPlayer of this.players.values()) {
      if (otherPlayer.likes.includes(player.id)) {
        likesReceived++;
      }
    }
    player.roundStats.likesReceived = likesReceived;
  }
}
```

### Player Model (`src/models/Player.js`)

**Responsibilities**:
- Player data management
- Round statistics tracking
- Action validation
- Score tracking

**Core Properties**:
```javascript
class Player {
  constructor(name, socketId, avatar) {
    this.id = uuidv4();
    this.name = name;
    this.socketId = socketId;
    this.status = PLAYER_STATUS.CONNECTED;
    this.points = 0;
    this.avatar = avatar || this.generateAvatar();
    
    // Game state tracking
    this.currentLie = null;
    this.currentGuess = null;
    this.likes = [];
    this.hasSubmittedLie = false;
    this.hasSelectedOption = false;
    
    // Round statistics
    this.roundStats = {
      liesSubmitted: [],
      correctGuesses: 0,
      playersFooled: 0,
      likesReceived: 0
    };
  }
}
```

**Key Methods**:
```javascript
submitLie(lie) {
  this.currentLie = lie;
  this.hasSubmittedLie = true;
  this.roundStats.liesSubmitted.push(lie);
}

selectOption(optionIndex) {
  this.currentGuess = optionIndex;
  this.hasSelectedOption = true;
}

likeLie(playerId) {
  if (!this.likes.includes(playerId)) {
    this.likes.push(playerId);
  }
}

getScoreboardData() {
  return {
    id: this.id,
    name: this.name,
    points: this.points,
    avatar: this.avatar,
    lastLie: this.roundStats.liesSubmitted[this.roundStats.liesSubmitted.length - 1] || null,
    likesReceived: this.roundStats.likesReceived,
    playersFooled: this.playersFooledLastQuestion
  };
}
```

## Services

### Timer Service (`src/services/TimerService.js`)

**Purpose**: Centralized timer management for game phases

```javascript
class TimerService {
  constructor() {
    this.timers = new Map();
  }

  startTimer(name, duration, callback) {
    this.cancelTimer(name); // Clear existing timer
    const timer = setTimeout(() => {
      this.timers.delete(name);
      callback();
    }, duration);
    this.timers.set(name, timer);
  }

  cancelTimer(name) {
    const timer = this.timers.get(name);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(name);
    }
  }

  isActive(name) {
    return this.timers.has(name);
  }
}
```

### Question Service (`src/services/QuestionService.js`)

**Purpose**: Question loading and category management

```javascript
class QuestionService {
  constructor() {
    this.questionPacks = new Map();
    this.loadQuestionPacks();
  }

  loadQuestionPacks() {
    // Load question packs from JSON files
    const defaultPack = require('../../question_packs/default.json');
    this.questionPacks.set('default', defaultPack);
  }

  getRandomQuestion(category = null) {
    const pack = this.questionPacks.get('default');
    let questions = pack.questions;
    
    if (category) {
      questions = questions.filter(q => q.category === category);
    }
    
    return questions[Math.floor(Math.random() * questions.length)];
  }

  getCategories() {
    const pack = this.questionPacks.get('default');
    return [...new Set(pack.questions.map(q => q.category))];
  }
}
```

## Configuration & Constants

### Game Constants (`src/utils/constants.js`)

```javascript
const GAME_STATES = {
  LOBBY: 'lobby',
  CATEGORY_SELECTION: 'category_selection',
  QUESTION_READING: 'question_reading',
  LIE_SUBMISSION: 'lie_submission',
  OPTION_SELECTION: 'option_selection',
  TRUTH_REVEAL: 'truth_reveal',
  SCOREBOARD: 'scoreboard',
  GAME_ENDED: 'game_ended'
};

const TIMERS = {
  QUESTION_READING: 10000,    // 10 seconds
  LIE_SUBMISSION: 60000,      // 60 seconds
  OPTION_SELECTION: 30000,    // 30 seconds
  TRUTH_REVEAL: 5000,         // 5 seconds
  SCOREBOARD: 10000           // 10 seconds
};

const GAME_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 12,
  POINTS: {
    ROUND_1: { FOOL_PLAYER: 500, FIND_TRUTH: 1000 },
    ROUND_2: { FOOL_PLAYER: 1000, FIND_TRUTH: 2000 },
    ROUND_3: { FOOL_PLAYER: 1500, FIND_TRUTH: 3000 }
  }
};
```

### Socket Events (`src/utils/constants.js`)

```javascript
const SOCKET_EVENTS = {
  // Player Events
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  PLAYER_UPDATED: 'player_updated',
  
  // Game Flow Events
  GAME_STATE_UPDATE: 'game_state_update',
  QUESTION_SELECTED: 'question_selected',
  TRUTH_REVEAL_START: 'truth_reveal_start',
  SCOREBOARD_UPDATE: 'scoreboard_update',
  GAME_ENDED: 'game_ended',
  
  // Error Events
  ERROR: 'error',
  VALIDATION_ERROR: 'validation_error'
};
```

## Data Flow Patterns

### Real-Time State Synchronization

```javascript
// Server broadcasts state changes
broadcastGameStateAndSubStep() {
  const gameState = {
    state: this.state,
    round: this.currentRound,
    question: this.currentQuestion,
    totalRounds: this.totalRounds
  };
  
  // Send to all clients
  this.broadcastToAll(SOCKET_EVENTS.GAME_STATE_UPDATE, gameState);
  
  // Send player-specific data
  for (const player of this.players.values()) {
    const subStepInfo = this.getSubStepInfo(player);
    this.sendToPlayer(player.id, 'sub_step_info', subStepInfo);
  }
}
```

### Error Handling

```javascript
// Centralized error handling
handleError(socket, error, context) {
  console.error(`❌ [ERROR] ${context}:`, error);
  
  socket.emit(SOCKET_EVENTS.ERROR, {
    message: error.message,
    context: context,
    timestamp: new Date().toISOString()
  });
}

// Input validation
validateLieSubmission(lie) {
  if (!lie || typeof lie !== 'string') {
    throw new Error('Lie must be a non-empty string');
  }
  
  if (lie.length > 200) {
    throw new Error('Lie must be 200 characters or less');
  }
  
  if (lie.trim() === '') {
    throw new Error('Lie cannot be empty or whitespace only');
  }
}
```

## Auto-Completion System

### Auto-Lie Generation

```javascript
generateAutoLie(questionData) {
  const autoLies = [
    "I'm not sure about this one",
    "Let me think about it...",
    "This is a tough question",
    "I'll have to guess on this"
  ];
  
  return autoLies[Math.floor(Math.random() * autoLies.length)];
}

autoCompleteLieSubmission() {
  for (const player of this.players.values()) {
    if (!player.hasSubmittedLie && player.status === 'connected') {
      const autoLie = this.generateAutoLie(this.currentQuestionData);
      player.submitLie(autoLie);
      console.log(`🤖 [AUTO] Generated lie for ${player.name}: "${autoLie}"`);
    }
  }
}
```

### Auto-Voting

```javascript
autoCompleteVoting() {
  for (const player of this.players.values()) {
    if (!player.hasSelectedOption && player.status === 'connected') {
      const randomIndex = Math.floor(Math.random() * this.shuffledOptions.length);
      player.selectOption(randomIndex);
      this.playerGuesses.set(player.id, randomIndex);
      console.log(`🤖 [AUTO] Auto-voted for ${player.name}: option ${randomIndex}`);
    }
  }
}
```

## Performance Considerations

### Memory Management
- Player cleanup on disconnect
- Timer cleanup on game end
- Efficient Map usage for player lookup
- Event listener cleanup

### Scalability
- Single game instance per server (can be extended)
- Efficient broadcasting patterns
- Minimal state synchronization
- Connection pooling for Socket.IO