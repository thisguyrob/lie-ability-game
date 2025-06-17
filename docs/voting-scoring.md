# Voting & Scoring System

## Overview

The Lie Ability Game features a comprehensive voting and scoring system that rewards both creative deception and truth detection. The system includes competitive scoring for points and a social "like" system for recognizing creativity.

## Voting Mechanics

### Vote Collection Process

**Option Creation**:
```javascript
// Shuffle lies with truth for anonymous voting
const allOptions = [...playerLies.values(), truthAnswer];
this.shuffledOptions = this.shuffleArray(allOptions.map((text, index) => ({
  id: index,
  text: text,
  submittedBy: this.getOptionAuthors(text) // Empty array for truth
})));

// Track truth position for scoring
this.truthIndex = this.shuffledOptions.findIndex(option => 
  option.text === this.currentQuestionData.answer
);
```

**Vote Validation**:
```javascript
selectOption(playerId, optionIndex) {
  const player = this.players.get(playerId);
  const selectedOption = this.shuffledOptions[optionIndex];
  
  // Prevent voting for own lie
  if (selectedOption.submittedBy && selectedOption.submittedBy.includes(playerId)) {
    throw new Error('Cannot vote for your own lie');
  }
  
  // Prevent duplicate voting
  if (player.hasSelectedOption) {
    throw new Error('Player has already voted');
  }
  
  player.selectOption(optionIndex);
  this.playerGuesses.set(playerId, optionIndex);
}
```

**Auto-Voting System**:
```javascript
autoCompleteVoting() {
  const connectedPlayers = Array.from(this.players.values())
    .filter(p => p.status === 'connected');
  
  for (const player of connectedPlayers) {
    if (!player.hasSelectedOption) {
      // Filter out player's own lie from options
      const availableOptions = this.shuffledOptions
        .map((option, index) => ({ option, index }))
        .filter(({ option }) => !option.submittedBy.includes(player.id));
      
      const randomChoice = availableOptions[
        Math.floor(Math.random() * availableOptions.length)
      ];
      
      player.selectOption(randomChoice.index);
      this.playerGuesses.set(player.id, randomChoice.index);
    }
  }
}
```

## Scoring System

### Point Values by Round

**Escalating Point Structure**:
```javascript
const GAME_CONFIG = {
  POINTS: {
    ROUND_1: { 
      FOOL_PLAYER: 500,   // Points per player fooled
      FIND_TRUTH: 1000    // Points for finding truth
    },
    ROUND_2: { 
      FOOL_PLAYER: 1000, 
      FIND_TRUTH: 2000 
    },
    ROUND_3: { 
      FOOL_PLAYER: 1500, 
      FIND_TRUTH: 3000 
    }
  }
};
```

### Score Calculation Process

**Fooling Points (Offensive Strategy)**:
```javascript
// Award points for each player fooled by your lie
for (const [playerId, lie] of this.playerLies.entries()) {
  const player = this.players.get(playerId);
  let votesReceived = 0;
  
  // Count votes for this player's lie
  for (const [voterId, optionIndex] of this.playerGuesses.entries()) {
    const votedOption = this.shuffledOptions[optionIndex];
    if (votedOption.text === lie) {
      votesReceived++;
    }
  }
  
  // Award points based on round multiplier
  const foolPoints = votesReceived * GAME_CONFIG.POINTS[`ROUND_${this.currentRound}`].FOOL_PLAYER;
  player.addPoints(foolPoints);
  player.roundStats.playersFooled += votesReceived;
  player.playersFooledLastQuestion = votesReceived;
  
  if (foolPoints > 0) {
    console.log(`🎯 [SCORING] ${player.name} fooled ${votesReceived} players (+${foolPoints} points)`);
  }
}
```

**Truth Detection Points (Defensive Strategy)**:
```javascript
// Award points for finding the truth
for (const [playerId, optionIndex] of this.playerGuesses.entries()) {
  if (optionIndex === this.truthIndex) {
    const player = this.players.get(playerId);
    const truthPoints = GAME_CONFIG.POINTS[`ROUND_${this.currentRound}`].FIND_TRUTH;
    
    player.addPoints(truthPoints);
    player.roundStats.correctGuesses++;
    
    console.log(`✅ [SCORING] ${player.name} found the truth (+${truthPoints} points)`);
  }
}
```

### Scoring Examples

**Round 1 Example**:
- Player A's lie fools 3 players: 3 × 500 = **1,500 points**
- Player B finds the truth: **1,000 points**
- Player C's lie fools no one: **0 points**

**Round 3 Example**:
- Player A's lie fools 2 players: 2 × 1,500 = **3,000 points**
- Player B finds the truth: **3,000 points**
- Both strategies equally rewarded in later rounds

## Like System

### Like Mechanics

**Like Submission**:
```javascript
likeLie(likerId, likedPlayerId) {
  const liker = this.players.get(likerId);
  const likedPlayer = this.players.get(likedPlayerId);
  
  // Validation
  if (likerId === likedPlayerId) {
    throw new Error('Cannot like your own lie');
  }
  
  if (liker.likes.includes(likedPlayerId)) {
    return; // Already liked, ignore duplicate
  }
  
  // Add like
  liker.likes.push(likedPlayerId);
  console.log(`👍 [LIKE] ${liker.name} liked ${likedPlayer.name}'s lie`);
}
```

**Like Timing Windows**:
```javascript
// Likes accepted during two phases:
// 1. OPTION_SELECTION - After player votes
// 2. TRUTH_REVEAL - Throughout the reveal phase

const canLike = (gameState) => {
  return gameState === 'option_selection' || gameState === 'truth_reveal';
};
```

**Like Calculation (Before Scoreboard)**:
```javascript
calculateLikes() {
  // Calculate final like counts right before scoreboard
  for (const player of this.players.values()) {
    let likesReceived = 0;
    
    // Count likes from all other players
    for (const otherPlayer of this.players.values()) {
      if (otherPlayer.likes.includes(player.id)) {
        likesReceived++;
      }
    }
    
    player.roundStats.likesReceived = likesReceived;
    
    if (likesReceived > 0) {
      console.log(`👍 [SCORING] ${player.name} received ${likesReceived} likes`);
    }
  }
}
```

### Like Display

**Scoreboard Integration**:
```svelte
<!-- Show thumbs up for liked lies -->
{#if player.lastLie}
  <div class="last-lie">
    "{player.lastLie}"
    {#if player.likesReceived && player.likesReceived > 0}
      <span class="likes-indicator">👍🏻</span>
    {/if}
  </div>
{/if}
```

**Player Interface**:
```svelte
<!-- Like buttons in voting interface -->
{#each options as option}
  {#if option.submittedBy && option.submittedBy.length > 0}
    <button
      class="like-button"
      class:liked={likedOptions.has(option.id)}
      disabled={likedOptions.has(option.id)}
      on:click={() => handleLikeOption(option)}
    >
      <span class="like-icon">{likedOptions.has(option.id) ? '❤️' : '🤍'}</span>
    </button>
  {/if}
{/each}
```

## Strategic Implications

### Scoring Strategy

**Offensive Play (Lie Creation)**:
- **Goal**: Create believable lies that fool other players
- **Strategy**: Balance creativity with believability
- **Risk/Reward**: Higher rounds = higher payoff for successful lies
- **Tactics**: 
  - Study the question category for realistic answers
  - Avoid obviously fake answers
  - Use specific details to add believability

**Defensive Play (Truth Detection)**:
- **Goal**: Identify the correct answer among lies
- **Strategy**: Look for answers that are too specific or too vague
- **Risk/Reward**: Consistent points for truth detection
- **Tactics**:
  - Eliminate obviously creative lies
  - Look for straightforward, factual answers
  - Consider which answers other players might vote for

### Social Strategy (Likes)

**Building Social Capital**:
- **Purpose**: Recognition without point value
- **Benefits**: 
  - Scoreboard highlighting with thumbs up emoji
  - Social validation and engagement
  - Building reputation for creativity

**Like Timing Strategy**:
- **During Voting**: Like immediately after seeing creative lies
- **During Truth Reveal**: Continue liking before final scoreboard
- **Maximize Window**: All likes count until scoreboard appears

## Anti-Cheating Measures

### Vote Security

**Self-Vote Prevention**:
```javascript
// Player's own lie filtered from voting options
const playerOptions = shuffledOptions.filter(option => 
  !option.submittedBy.includes(playerId)
);
```

**Duplicate Prevention**:
```javascript
// Multiple vote attempts blocked
if (player.hasSelectedOption) {
  throw new Error('Player has already voted');
}
```

### Like Security

**Self-Like Prevention**:
```javascript
if (likerId === likedPlayerId) {
  throw new Error('Cannot like your own lie');
}
```

**Duplicate Like Handling**:
```javascript
if (liker.likes.includes(likedPlayerId)) {
  return; // Silently ignore, don't error
}
```

## Performance Considerations

### Efficient Vote Counting

**Map-Based Lookups**:
```javascript
// Efficient vote counting using Maps
const voteCounts = new Map();
for (const optionIndex of this.playerGuesses.values()) {
  voteCounts.set(optionIndex, (voteCounts.get(optionIndex) || 0) + 1);
}
```

**Batch Processing**:
```javascript
// Process all scoring in single pass
for (const [playerId, lie] of this.playerLies.entries()) {
  // Calculate votes and points in one iteration
}
```

### Memory Efficiency

**Cleanup Between Rounds**:
```javascript
resetForNewQuestion() {
  this.playerLies.clear();
  this.playerGuesses.clear();
  this.shuffledOptions = [];
  
  // Reset player round state
  for (const player of this.players.values()) {
    player.resetForNewQuestion();
  }
}
```

## Data Structures

### Player Voting State
```javascript
// Player.js
{
  currentGuess: number,           // Index of selected option
  hasSelectedOption: boolean,     // Voting completion flag
  likes: string[],               // Array of liked player IDs
  roundStats: {
    correctGuesses: number,       // Truth detection count
    playersFooled: number,        // Total players fooled
    likesReceived: number         // Social likes received
  }
}
```

### Game Voting State
```javascript
// Game.js
{
  playerGuesses: Map<playerId, optionIndex>,  // Vote tracking
  shuffledOptions: Array<{                    // Anonymous options
    id: number,
    text: string,
    submittedBy: string[]                     // Empty for truth
  }>,
  truthIndex: number                          // Truth position in shuffle
}
```