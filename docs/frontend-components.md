# Frontend Components

## Overview

The frontend is built using Svelte for reactive UI components with a clear separation between host and player experiences. The architecture emphasizes real-time responsiveness and mobile-first design.

## Project Structure

```
svelte/
├── src/
│   ├── Host.svelte           # Main host application
│   ├── Player.svelte         # Main player application
│   ├── host-main.js          # Host entry point
│   ├── player-main.js        # Player entry point
│   └── components/
│       ├── host/             # Host-specific components
│       │   ├── CategorySelection.svelte
│       │   ├── GameEnd.svelte
│       │   ├── Lobby.svelte
│       │   ├── QuestionView.svelte
│       │   ├── Scoreboard.svelte
│       │   └── TruthReveal.svelte
│       └── player/           # Player-specific components
│           ├── PlayerCategorySelect.svelte
│           ├── PlayerGameEnd.svelte
│           ├── PlayerJoin.svelte
│           ├── PlayerLieSubmit.svelte
│           ├── PlayerLobby.svelte
│           ├── PlayerOptionSelect.svelte
│           ├── PlayerQuestionView.svelte
│           ├── PlayerScoreboard.svelte
│           ├── PlayerTruthReveal.svelte
│           └── PlayerWaiting.svelte
```

## Host Components

### Host.svelte (Main Application)

**Purpose**: Root component managing host interface state and Socket.IO connection

**Key Features**:
```svelte
<script>
  import io from 'socket.io-client';
  import Lobby from './components/Lobby.svelte';
  import CategorySelection from './components/CategorySelection.svelte';
  import Scoreboard from './components/Scoreboard.svelte';
  // ... other imports

  let socket;
  let gameState = { state: 'lobby' };
  let players = [];
  let roomCode = '';
  let scoreboardData = null;

  // Socket connection and event handling
  onMount(() => {
    socket = io('http://localhost:3000');
    setupSocketListeners();
  });
</script>

<!-- Conditional rendering based on game state -->
{#if gameState.state === 'lobby'}
  <Lobby {players} {roomCode} onStartGame={startGame} />
{:else if gameState.state === 'category_selection'}
  <CategorySelection onSelectCategory={selectCategory} />
{:else if gameState.state === 'scoreboard'}
  <Scoreboard data={scoreboardData} />
{/if}
```

**State Management**:
- Centralized game state from server
- Socket event handling and routing
- Component prop passing for data flow

### Lobby.svelte

**Purpose**: Host lobby interface showing connected players

**Props**:
```svelte
export let players = [];
export let roomCode = '';
export let onStartGame = () => {};
```

**Features**:
- Real-time player list with avatars
- Room code display for player joining
- Start game button with minimum player validation
- Player count and connection status

**Key UI Elements**:
```svelte
<div class="lobby-container">
  <div class="room-info">
    <div class="room-code">Room Code: {roomCode}</div>
    <div class="player-count">{players.length} players connected</div>
  </div>
  
  <div class="players-grid">
    {#each players as player (player.id)}
      <div class="player-card">
        <div class="player-avatar" style="background-color: {player.avatar.color}">
          {player.avatar.emoji}
        </div>
        <div class="player-name">{player.name}</div>
      </div>
    {/each}
  </div>
  
  <button 
    class="start-button" 
    disabled={players.length < 2}
    on:click={onStartGame}
  >
    Start Game
  </button>
</div>
```

### CategorySelection.svelte

**Purpose**: Category selection interface for host

**Features**:
- Grid layout of available categories
- Emoji indicators for each category
- Question preview option
- Auto-advance settings

### Scoreboard.svelte

**Purpose**: Post-round scoreboard display

**Props**:
```svelte
export let data = {
  players: [],
  round: 1,
  question: 1,
  totalRounds: 5
};
```

**Key Features**:
- Animated leaderboard with rankings
- Like indicators (👍🏻) for liked lies
- Point breakdowns and round summary
- Podium styling for top 3 players

**Rendering Logic**:
```svelte
<script>
  $: sortedPlayers = [...(data?.players || [])].sort((a, b) => b.points - a.points);
  
  function getRankDisplay(rank) {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈'; 
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  }
</script>

{#each sortedPlayers as player, index}
  <div class="player-row {getRankClass(index + 1)}">
    <div class="player-info">
      <div class="player-name">{player.name}</div>
      {#if player.lastLie}
        <div class="last-lie">
          "{player.lastLie}"
          {#if player.likesReceived && player.likesReceived > 0}
            <span class="likes-indicator">👍🏻</span>
          {/if}
        </div>
      {/if}
    </div>
    <div class="points-total">{player.points}</div>
  </div>
{/each}
```

### TruthReveal.svelte

**Purpose**: Dramatic truth reveal interface (host only)

**Features**:
- Animated truth reveal
- Vote count display
- Lie attribution showing authors
- Voter breakdown by option

## Player Components

### Player.svelte (Main Application)

**Purpose**: Root component for player interface with responsive design

**Key Features**:
```svelte
<script>
  import PlayerJoin from './components/player/PlayerJoin.svelte';
  import PlayerOptionSelect from './components/player/PlayerOptionSelect.svelte';
  import PlayerScoreboard from './components/player/PlayerScoreboard.svelte';
  // ... other imports

  let gameState = { state: 'lobby' };
  let currentPlayer = null;
  let isCurrentPlayer = false;

  // Conditional rendering based on game state and player status
</script>

<main class="player-container">
  {#if !isCurrentPlayer}
    <PlayerJoin {connectionStatus} onJoin={joinGame} />
  {:else if gameState.state === 'lobby'}
    <PlayerWaiting {playerName} {gameState} {currentPlayer} />
  {:else if gameState.state === 'option_selection' || gameState.state === 'truth_reveal'}
    <PlayerOptionSelect 
      {currentQuestion} 
      {subStepInfo} 
      onSelect={selectOption}
      onLike={likeLie}
    />
  {:else if gameState.state === 'scoreboard'}
    <PlayerScoreboard {scoreboardData} {currentPlayer} />
  {/if}
</main>
```

**Responsive Design**:
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for various screen sizes

### PlayerJoin.svelte

**Purpose**: Player onboarding and room joining

**Features**:
- Name input with validation
- Avatar selection (emoji + color)
- Room code input
- Connection status display

**Avatar Selection**:
```svelte
<div class="avatar-selection">
  <div class="emoji-grid">
    {#each AVATAR_EMOJIS as emoji}
      <button 
        class="emoji-button"
        class:selected={selectedEmoji === emoji}
        on:click={() => selectedEmoji = emoji}
      >
        {emoji}
      </button>
    {/each}
  </div>
  
  <div class="color-grid">
    {#each AVATAR_COLORS as color}
      <button 
        class="color-button"
        style="background-color: {color}"
        class:selected={selectedColor === color}
        on:click={() => selectedColor = color}
      >
      </button>
    {/each}
  </div>
</div>
```

### PlayerLieSubmit.svelte

**Purpose**: Lie submission interface

**Features**:
- Text input with character limit
- Real-time character counter
- Submit validation
- Auto-lie option for quick play
- Timer display

**Input Handling**:
```svelte
<script>
  export let currentQuestion;
  export let subStepInfo;
  export let onSubmit = () => {};
  export let onAuto = () => {};

  let lie = '';
  let isSubmitted = false;
  
  $: canSubmit = lie.trim().length > 0 && !isSubmitted;
  $: charactersLeft = 200 - lie.length;
</script>

<div class="lie-input-container">
  <textarea
    bind:value={lie}
    placeholder="Enter your creative lie here..."
    maxlength="200"
    disabled={isSubmitted}
  ></textarea>
  
  <div class="character-counter" class:warning={charactersLeft < 20}>
    {charactersLeft} characters left
  </div>
  
  <button 
    class="submit-button"
    disabled={!canSubmit}
    on:click={() => onSubmit(lie)}
  >
    Submit Lie
  </button>
</div>
```

### PlayerOptionSelect.svelte

**Purpose**: Voting interface with like functionality

**Key Features**:
- Option selection with validation
- Post-vote like interface
- Cannot vote for own lie
- Real-time like submission

**Voting Interface**:
```svelte
<div class="options-list">
  {#each options as option, index}
    <button
      class="option-button"
      class:selected={hasSelected && option.id === selectedOptionId}
      on:click={() => handleOptionSelect(option.id)}
      disabled={hasSelected}
    >
      <div class="option-text">{option.text}</div>
    </button>
  {/each}
</div>

{#if hasSelected}
  <div class="post-vote-options">
    <div class="post-vote-label">Like creative answers:</div>
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
  </div>
{/if}
```

### PlayerScoreboard.svelte

**Purpose**: Player-specific scoreboard view

**Features**:
- Personal performance highlighting
- Full leaderboard display
- Round summary statistics
- Mobile-optimized layout

## Common Patterns

### State Management

**Reactive Declarations**:
```svelte
<script>
  // Reactive state based on props
  $: hasSelected = subStepInfo?.hasSelectedOption || selectedOptionId !== null;
  $: options = currentQuestion?.options || [];
  $: canSubmit = lie.trim().length > 0 && !isSubmitted;
</script>
```

**Event Handling**:
```svelte
<script>
  // Consistent event patterns
  function handleSubmit() {
    if (validate()) {
      onSubmit(data);
      updateLocalState();
    }
  }
</script>
```

### Animation & Transitions

**Staggered Animations**:
```svelte
{#each items as item, index}
  <div 
    class="animated-item"
    style="animation-delay: {index * 0.1}s"
  >
    {item.content}
  </div>
{/each}
```

**CSS Animations**:
```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated-item {
  animation: slideInUp 0.5s ease both;
}
```

### Responsive Design

**Mobile-First CSS**:
```css
/* Base mobile styles */
.component {
  padding: 1rem;
  font-size: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
    font-size: 1.1rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: 2rem;
    font-size: 1.2rem;
  }
}
```

### Error Handling

**Connection Status**:
```svelte
<script>
  let connectionStatus = 'connected';
  
  socket.on('connect', () => connectionStatus = 'connected');
  socket.on('disconnect', () => connectionStatus = 'disconnected');
</script>

<div class="connection-indicator" class:connected={connectionStatus === 'connected'}>
  {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
</div>
```

### Data Validation

**Input Validation**:
```svelte
<script>
  function validateLie(text) {
    if (!text || text.trim().length === 0) {
      return 'Lie cannot be empty';
    }
    if (text.length > 200) {
      return 'Lie must be 200 characters or less';
    }
    return null;
  }
  
  $: validationError = validateLie(lie);
</script>

{#if validationError}
  <div class="error-message">{validationError}</div>
{/if}
```

## Performance Optimization

### Component Loading
- Lazy loading for non-critical components
- Efficient prop passing
- Minimal re-renders with reactive statements

### Memory Management
- Proper cleanup of socket listeners
- Component lifecycle management
- Efficient data structures for lists

### Mobile Optimization
- Touch event handling
- Reduced animations on slower devices
- Optimized images and assets