# Game Flow & State Management

## Game State Machine

The Lie Ability Game follows a strict state machine with defined transitions and timing controls. Each state represents a distinct phase of gameplay with specific player interactions and timer constraints.

## Core Game States

```
LOBBY → CATEGORY_SELECTION → QUESTION_READING → LIE_SUBMISSION → 
OPTION_SELECTION → TRUTH_REVEAL → SCOREBOARD → [NEXT QUESTION | GAME_ENDED]
```

### 1. LOBBY
**Purpose**: Player joining and game setup

**Host Interface**:
- Shows connected players with avatars and names
- Player count and room code display
- Start game button (requires minimum players)
- Game settings configuration

**Player Interface**:
- Join form with name entry and avatar selection
- Waiting room with other connected players
- Avatar customization (emoji + color selection)

**Key Events**:
- `join_game` - Player joins with name and avatar
- `update_avatar` - Player changes avatar
- `update_name` - Player changes display name
- `start_game` - Host initiates gameplay

**State Transitions**:
- `startGame()` → `CATEGORY_SELECTION`

### 2. CATEGORY_SELECTION
**Purpose**: Host selects question category or specific question

**Host Interface**:
- Category grid with emoji indicators
- Question preview for manual selection
- Auto-advance option for continuous play

**Player Interface**:
- Waiting screen with category anticipation
- "Host is selecting a question..." message

**Key Events**:
- `select_category` - Host picks category for random question
- `select_question` - Host picks specific question

**Timers**: None (host-controlled)

**State Transitions**:
- `selectCategory()` or `selectQuestion()` → `QUESTION_READING`

### 3. QUESTION_READING
**Purpose**: Display question to all players

**Host Interface**:
- Large question display with category badge
- Question text and any additional context
- Timer countdown for reading phase

**Player Interface**:
- Identical question display
- Category badge and question text
- Reading timer indicator

**Duration**: `TIMERS.QUESTION_READING` (default: 10 seconds)

**Key Events**:
- Automatic progression when timer expires

**State Transitions**:
- Timer expiry → `LIE_SUBMISSION`

### 4. LIE_SUBMISSION
**Purpose**: Players submit creative lies

**Host Interface**:
- Submission progress tracker
- Live count of submitted lies
- Player status indicators (submitted/pending)

**Player Interface**:
- Text input for lie submission
- Character limit enforcement
- Submit button and timer display
- Auto-lie option for quick play

**Duration**: `TIMERS.LIE_SUBMISSION` (default: 60 seconds)

**Key Events**:
- `submit_lie` - Player submits their lie
- `auto_lie` - Player requests auto-generated lie
- Auto-completion for non-submitters

**Auto-Completion**:
```javascript
// Players who don't submit get auto-lies
if (!player.hasSubmittedLie) {
  const autoLie = generateAutoLie(questionData);
  player.submitLie(autoLie);
}
```

**State Transitions**:
- All lies submitted OR timer expiry → `OPTION_SELECTION`

### 5. OPTION_SELECTION
**Purpose**: Players vote on answers and like lies

**Host Interface**:
- Voting progress tracker
- Live vote counts (hidden until reveal)
- Player status indicators (voted/pending)

**Player Interface**:
- Shuffled options (lies + truth) for voting
- Vote selection with confirmation
- Post-vote like interface for creative lies
- Cannot vote for own lie (filtered out)

**Duration**: `TIMERS.OPTION_SELECTION` (default: 30 seconds)

**Key Events**:
- `select_option` - Player votes for an answer
- `like_lie` - Player likes someone's creative lie
- Auto-voting for non-voters

**Auto-Completion**:
```javascript
// Auto-vote for players who don't vote
if (!player.hasSelectedOption) {
  const randomIndex = Math.floor(Math.random() * shuffledOptions.length);
  player.selectOption(randomIndex);
}
```

**Like System**:
- Players can like lies during voting phase
- Likes continue to be accepted during truth reveal
- No point value, purely social recognition

**State Transitions**:
- All votes submitted OR timer expiry → `TRUTH_REVEAL`

### 6. TRUTH_REVEAL
**Purpose**: Show results (host only), continue likes (players)

**Host Interface**:
- Dramatic reveal of truth answer
- Vote counts and player fooled statistics
- Lie attribution showing authors
- Vote breakdown by player

**Player Interface**:
- **Continues showing like interface** (not truth reveal)
- Players can continue liking lies
- "Waiting for results..." message

**Duration**: `TIMERS.TRUTH_REVEAL` (default: 5 seconds)

**Key Events**:
- `like_lie` - Players continue liking lies
- Automatic scoring calculation

**Scoring Process**:
```javascript
// Points for fooling players
const foolPoints = votesReceived * pointMultiplier.FOOL_PLAYER;

// Points for finding truth  
if (votedForTruth) {
  player.addPoints(pointMultiplier.FIND_TRUTH);
}
```

**State Transitions**:
- Timer expiry → `SCOREBOARD`

### 7. SCOREBOARD
**Purpose**: Display final scores with like indicators

**Host Interface**:
- Full leaderboard with rankings
- Point breakdowns and round summary
- Like indicators (👍🏻) for liked lies
- Continue/end game options

**Player Interface**:
- Personal performance card
- Full leaderboard rankings
- Like indicators for creative lies
- Round completion celebration

**Duration**: `TIMERS.SCOREBOARD` (default: 10 seconds)

**Like Calculation**:
```javascript
// Final like counts calculated RIGHT before scoreboard
calculateLikes() {
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

**State Transitions**:
- More questions → `CATEGORY_SELECTION` 
- Game complete → `GAME_ENDED`

### 8. GAME_ENDED
**Purpose**: Final results and game completion

**Host Interface**:
- Final winner announcement
- Complete game statistics
- Play again option
- Export results feature

**Player Interface**:
- Personal final ranking
- Game summary statistics
- Thank you message
- Return to lobby option

## State Management Architecture

### Game State Synchronization

**Server State**:
```javascript
// Centralized game state in Game.js
{
  state: 'current_state',
  currentRound: 1,
  currentQuestion: 1,
  totalRounds: 5,
  players: Map<id, Player>,
  currentQuestionData: {...},
  // ... other state
}
```

**Client State Sync**:
```javascript
// Real-time state broadcasting
socket.on('game_state_update', (gameState) => {
  // Update client state
  this.gameState = gameState;
});
```

### Timer Management

**Server-Side Timers**:
```javascript
// Robust timer service
class TimerService {
  startTimer(name, duration, callback) {
    this.timers.set(name, setTimeout(callback, duration));
  }
  
  cancelTimer(name) {
    clearTimeout(this.timers.get(name));
  }
}
```

**Client-Side Display**:
```javascript
// Visual countdown timers
{#if timer && timer.duration}
  <div class="timer">{timer.remaining}s</div>
{/if}
```

### Error Recovery

**Connection Handling**:
- Automatic reconnection for dropped players
- State resynchronization on reconnect
- Graceful degradation for missing players

**Data Validation**:
- Input sanitization and validation
- State consistency checks
- Rollback mechanisms for invalid transitions

## Game Flow Patterns

### Round Management
```javascript
advanceGame() {
  if (this.currentQuestion < this.totalQuestions) {
    this.nextQuestion();
  } else if (this.currentRound < this.totalRounds) {
    this.nextRound();
  } else {
    this.endGame();
  }
}
```

### Player State Tracking
```javascript
// Per-player state for each phase
player: {
  hasSubmittedLie: boolean,
  hasSelectedOption: boolean,
  currentLie: string,
  currentGuess: number,
  likes: string[], // Array of liked player IDs
  roundStats: {...}
}
```

### Broadcast Patterns
```javascript
// Different broadcast types
broadcastToAll(event, data);           // All players + host
broadcastToPlayers(event, data);       // Players only
broadcastToHost(event, data);          // Host only
broadcastGameStateAndSubStep();        // State sync
```