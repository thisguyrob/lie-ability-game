# AGENTS.md - Lie-Ability Game

## Project Overview

Lie-Ability is a multiplayer party game backend inspired by Fibbage. Players submit lies to fool others while trying to identify the real answer among fabricated ones. The game uses a **two-screen architecture**: a shared display for all players and personal devices for private interactions.

**Target Platforms:** Unix systems (macOS, Linux, Docker)  
**Tech Stack:** Node.js, Express, Socket.IO, WebSocket real-time communication

## Project Structure & Architecture

```
lie-ability-game/
├── src/
│   ├── models/          # Core game logic and data models
│   │   ├── Game.js      # Main game state machine and flow control
│   │   └── Player.js    # Player data, scoring, and state management
│   ├── services/        # Business logic services
│   │   ├── TimerService.js     # Timer management with cleanup (critical!)
│   │   └── QuestionService.js  # Question pack loading and validation
│   ├── utils/
│   │   ├── constants.js # Game configuration and socket events
│   │   └── helpers.js   # Utility functions and validation
│   └── server.js        # Express server and Socket.IO event handling
├── question_packs/      # JSON files containing trivia questions
│   └── *.json          # Question pack files (see format below)
├── tests/              # Testing and debugging tools
│   └── debug-interface.html  # Browser-based backend testing interface
├── public/             # Frontend placeholder (future development)
└── docs/               # Documentation (future)
```

**Key Architecture Principles:**
- **Game.js** is the central state machine - all game flow goes through it
- **TimerService** prevents hanging timers (critical for game progression)
- **Socket.IO events** synchronize shared screen + personal devices
- **Question packs** are dynamically loaded JSON files with validation

## Coding Conventions & Style

### JavaScript Style
- Use **ES6+ features** (const/let, arrow functions, async/await)
- **No semicolons** - follow project's existing style
- **camelCase** for variables and functions
- **PascalCase** for classes and constructors
- Use **template literals** for string interpolation
- Prefer **destructuring** for object/array access

### Naming Conventions
- Files: **PascalCase** for classes (Game.js), **camelCase** for utilities
- Socket events: **SCREAMING_SNAKE_CASE** constants (defined in constants.js)
- Game states: Use **GAME_STATES** enum from constants.js
- Timer IDs: Use descriptive names ('category_selection', 'lie_submission')

### Error Handling
- Always use try/catch blocks in Socket.IO event handlers
- Return `{ success: false, error: 'message' }` for failed operations
- Log errors with context: `console.error('Error in SUBMIT_LIE:', error)`

### Logging Standards
Use the established logging format with emojis and categories:
```javascript
console.log(`🎯 [PLAYER ACTION] ${playerName} selected category ${categoryId}`);
console.log(`🎮 [GAME STATE] Game started: Round ${round}, Question ${question}`);
console.log(`⏰ [TIMER] Category selection timer expired - auto-selecting`);
console.log(`🏆 [SCORING] ${playerName} fooled ${count} players (+${points} points)`);
```

**Log Categories:**
- `[PLAYER ACTION]` - User interactions (join, submit lie, vote, etc.)
- `[GAME STATE]` - State transitions and game flow
- `[TIMER]` - Timer events and automatic progressions
- `[SCORING]` - Point calculations and awards
- `[CONNECTION]` - Socket connect/disconnect events

## Build & Testing Instructions

### Development Setup
```bash
npm install          # Install dependencies
npm run dev          # Start with nodemon (auto-restart)
npm start           # Production start
```

### Testing Approach
**Primary Testing:** Use the debug interface at `http://localhost:3000/tests/debug-interface.html`

**Multi-player Testing:**
1. Open multiple browser tabs to the debug interface
2. Join with different player names in each tab
3. Test complete game flow: join → start → category → lie → vote → reveal
4. Verify logging output in server console

**API Testing:**
- `GET /api/health` - Server status and game info
- `GET /api/game-info` - Current game state (if active)
- `GET /api/question-packs` - Available question packs

### Critical Test Scenarios
- **Timer Management:** Ensure timers cancel properly on early completion
- **Reconnection:** Test player disconnect/reconnect during different game phases
- **Auto-progression:** Verify game continues when players don't respond
- **Question Pack Loading:** Test with valid and invalid JSON files
- **Scoring Logic:** Verify points calculation across all 3 rounds

### Required Checks Before Deployment
```bash
# Verify server starts without errors
npm start

# Test question pack loading
# Should see: "✓ Loaded question pack: default"

# Verify WebSocket connection
# Visit debug interface, should see "Connected to server"
```

## Pull Request Guidelines

### Commit Message Format
```
<type>: <description>

feat: add player reconnection handling
fix: prevent timer hanging in category selection
docs: update README with deployment instructions
test: add question pack validation tests
```

### PR Requirements
- **Title:** Start with type prefix (feat/fix/docs/test/refactor)
- **Description:** Include one-line summary and "Testing Done" section
- **Testing Done:** Describe how you tested the changes
  - "Tested with debug interface using 4 simulated players"
  - "Verified timer cancellation works correctly"
  - "Tested question pack validation with invalid JSON"

### Code Review Focus Areas
- **Game State Logic:** Ensure state transitions are correct and safe
- **Timer Management:** Verify no hanging timers or memory leaks
- **Socket Event Handling:** Check for proper error handling and logging
- **Question Pack Compatibility:** Ensure new features work with existing packs

## Domain-Specific Guidelines

### Game Flow State Machine
The game follows a strict state machine in Game.js:
```
LOBBY → CATEGORY_SELECTION → QUESTION_READING → LIE_SUBMISSION → 
OPTION_SELECTION → TRUTH_REVEAL → SCOREBOARD → (repeat or end)
```

**Critical Rules:**
- Always cancel timers when transitioning states early
- Use `this.timerService.cancelTimer(timerId)` before state changes
- Never modify game state outside of Game.js methods
- All state changes must broadcast to connected clients

### Socket.IO Event Patterns
**Client → Server events:** Handle in server.js with comprehensive logging
```javascript
socket.on(SOCKET_EVENTS.SUBMIT_LIE, (data) => {
  // 1. Get player info and log action
  // 2. Validate input and current game state
  // 3. Call game method
  // 4. Handle success/error response
  // 5. Log outcome
});
```

**Server → Client events:** Broadcast from Game.js using `this.broadcastToAll()`

### Question Pack Format
Question packs must follow this exact JSON structure:
```json
{
  "early_rounds": [
    {
      "category": "History",
      "question": "What did President X refuse to wear?",
      "answer": "Coat",
      "lies": ["Hat", "Gloves", "Scarf", "Socks", "Cape"],
      "audio_file": null
    }
  ],
  "final_round": [
    {
      "category": "Bonus",
      "question": "What is the dot over an 'i' called?",
      "answer": "Tittle", 
      "lies": ["Jot", "Speck", "Nib", "Flick"],
      "audio_file": null
    }
  ]
}
```

**Validation Requirements:**
- `early_rounds`: Array with 16+ questions for proper game flow
- `final_round`: Array with 1+ questions
- Each question needs: category, question, answer, lies (3+ items)
- `audio_file` field reserved for future audio support

### Two-Screen Architecture
Always consider both screen types when implementing features:
- **Shared Screen:** Public display visible to all players
- **Personal Screen:** Private interface on each player's device

**Design Principle:** Keep interaction on personal screens, display on shared screen

### Performance Considerations
- **Memory Management:** Clean up timers and socket references
- **Player Limits:** Enforce 2-16 player limits (GAME_CONFIG.MIN_PLAYERS/MAX_PLAYERS)
- **Question Pack Size:** Validate reasonable file sizes for JSON loading
- **Socket Events:** Avoid excessive broadcasts during timer updates

## Development Notes

### Working with Game State
- Always use Game.js methods to modify state
- Check current state before processing player actions
- Use `getGameState()` and `getSubStepInfo()` for client updates

### Adding New Features
1. **Update constants.js** if adding new events or states
2. **Modify Game.js** for game logic changes
3. **Update server.js** for new socket event handling
4. **Add logging** following established format
5. **Test with debug interface** before committing

### Question Pack Development
- Place new packs in `question_packs/` directory
- Follow exact JSON schema (see QuestionService.js validation)
- Server auto-loads valid packs on startup
- Invalid packs are logged and skipped

### Debugging Tips
- **Use comprehensive logging** - every player action should be logged
- **Debug interface** shows real-time WebSocket communication
- **Check timer state** with `timerService.getActiveTimersInfo()`
- **Monitor player state** through game state updates

This project prioritizes **game flow correctness**, **timer reliability**, and **real-time synchronization**. When in doubt, ensure the game can always progress and timers never hang.
