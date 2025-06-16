<script>
  import { createEventDispatcher } from 'svelte';
  
  export let connectionStatus;
  export let isReconnecting;
  
  const dispatch = createEventDispatcher();
  
  let playerName = '';
  let selectedAvatar = {
    emoji: '😊',
    color: '#667eea'
  };
  let isJoining = false;
  
  // Available avatar options
  const avatarEmojis = [
    '😊', '😎', '🤗', '🥳', '🤠', '🧐', '🤓', '😇',
    '🚀', '🎯', '🎮', '🎪', '🎨', '🎭', '🎸', '🎲',
    '🦄', '🐶', '🐱', '🦊', '🐼', '🐨', '🦁', '🐸',
    '⭐', '🌟', '💫', '🔥', '💎', '🏆', '👑', '🎊'
  ];
  
  const avatarColors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#ffc837', '#ff8008', '#e96443', '#904e95',
    '#29323c', '#485563', '#96deda', '#50c9c3',
    '#a8edea', '#fed6e3', '#ffa726', '#d4fc79'
  ];
  
  function selectEmoji(emoji) {
    selectedAvatar.emoji = emoji;
  }
  
  function selectColor(color) {
    selectedAvatar.color = color;
  }
  
  function joinGame() {
    if (playerName.trim() && !isJoining) {
      isJoining = true;
      dispatch('join', {
        name: playerName.trim(),
        avatar: selectedAvatar
      });
      
      // Reset joining state after a delay
      setTimeout(() => {
        isJoining = false;
      }, 3000);
    }
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter' && playerName.trim()) {
      joinGame();
    }
  }
  
  // Validate name input
  $: isValidName = playerName.trim().length >= 2 && playerName.trim().length <= 20;
  $: canJoin = isValidName && connectionStatus === 'connected' && !isJoining && !isReconnecting;
</script>

<div class="join-container">
  <div class="join-content">
    <!-- Header -->
    <div class="join-header fade-in">
      <h1 class="game-title">
        <span class="title-emoji">🎯</span>
        Lie-Ability
      </h1>
      <p class="join-subtitle">
        Ready to fool your friends and find the truth?
      </p>
    </div>
    
    <!-- Connection Status -->
    {#if connectionStatus !== 'connected'}
      <div class="connection-status slide-up">
        <div class="status-card">
          {#if connectionStatus === 'connecting'}
            <div class="status-icon loading">🔄</div>
            <h3>Connecting to game...</h3>
            <p>Please wait while we connect you to the server.</p>
          {:else if connectionStatus === 'error'}
            <div class="status-icon error">⚠️</div>
            <h3>Connection Failed</h3>
            <p>Unable to connect to the game server. Please check your internet connection and refresh the page.</p>
          {:else if connectionStatus === 'disconnected'}
            <div class="status-icon error">🔴</div>
            <h3>Disconnected</h3>
            <p>Connection to the game server was lost. Please refresh the page to reconnect.</p>
          {/if}
        </div>
      </div>
    {:else if isReconnecting}
      <div class="connection-status slide-up">
        <div class="status-card">
          <div class="status-icon loading">🔄</div>
          <h3>Reconnecting...</h3>
          <p>Attempting to rejoin your previous game session.</p>
        </div>
      </div>
    {:else}
      <!-- Join Form -->
      <div class="join-form slide-up">
        <div class="form-card glass">
          <!-- Name Input -->
          <div class="form-section">
            <label for="playerName" class="form-label">
              <span class="label-emoji">👤</span>
              Your Name
            </label>
            <input
              id="playerName"
              type="text"
              class="input name-input"
              bind:value={playerName}
              on:keypress={handleKeyPress}
              placeholder="Enter your name..."
              maxlength="20"
              autocomplete="off"
              disabled={isJoining}
            />
            <div class="name-validation">
              {#if playerName.trim().length > 0}
                {#if isValidName}
                  <span class="validation-message valid">✓ Looks good!</span>
                {:else if playerName.trim().length < 2}
                  <span class="validation-message invalid">Name must be at least 2 characters</span>
                {:else}
                  <span class="validation-message invalid">Name must be 20 characters or less</span>
                {/if}
              {/if}
            </div>
          </div>
          
          <!-- Avatar Selection -->
          <div class="form-section">
            <div class="form-label">
              <span class="label-emoji">🎭</span>
              Choose Your Avatar
            </div>
            
            <!-- Avatar Preview -->
            <div class="avatar-preview">
              <div 
                class="preview-avatar"
                style="background: {selectedAvatar.color}"
              >
                {selectedAvatar.emoji}
              </div>
            </div>
            
            <!-- Emoji Selection -->
            <div class="selection-section">
              <h4 class="selection-title">Pick an Emoji</h4>
              <div class="emoji-grid">
                {#each avatarEmojis as emoji}
                  <button
                    class="emoji-option"
                    class:selected={selectedAvatar.emoji === emoji}
                    on:click={() => selectEmoji(emoji)}
                    disabled={isJoining}
                  >
                    {emoji}
                  </button>
                {/each}
              </div>
            </div>
            
            <!-- Color Selection -->
            <div class="selection-section">
              <h4 class="selection-title">Pick a Color</h4>
              <div class="color-grid">
                {#each avatarColors as color}
                  <button
                    class="color-option"
                    class:selected={selectedAvatar.color === color}
                    style="background: {color}"
                    on:click={() => selectColor(color)}
                    disabled={isJoining}
                    aria-label="Select color {color}"
                  >
                    {#if selectedAvatar.color === color}
                      <span class="color-check">✓</span>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          </div>
          
          <!-- Join Button -->
          <div class="form-section">
            <button
              class="btn btn-primary btn-lg join-button"
              class:loading={isJoining}
              disabled={!canJoin}
              on:click={joinGame}
            >
              {#if isJoining}
                <span class="button-spinner">🔄</span>
                Joining Game...
              {:else}
                <span class="button-emoji">🚀</span>
                Join Game
              {/if}
            </button>
            
            {#if !isValidName && playerName.trim().length > 0}
              <p class="join-help error">Please enter a valid name (2-20 characters)</p>
            {:else if connectionStatus !== 'connected'}
              <p class="join-help error">Waiting for connection...</p>
            {:else}
              <p class="join-help">
                Click "Join Game" when you're ready to play!
              </p>
            {/if}
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Game Info -->
    <div class="game-info fade-in">
      <div class="info-items">
        <div class="info-item">
          <span class="info-emoji">🎯</span>
          <span>Create lies to fool others</span>
        </div>
        <div class="info-item">
          <span class="info-emoji">🕵️</span>
          <span>Find the real answer</span>
        </div>
        <div class="info-item">
          <span class="info-emoji">🏆</span>
          <span>Score points to win</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .join-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
  }
  
  .join-content {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .join-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  .game-title {
    font-size: var(--font-size-5xl);
    font-weight: 900;
    color: var(--white);
    margin-bottom: var(--space-3);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
  }
  
  .title-emoji {
    font-size: var(--font-size-4xl);
    animation: bounce-in 0.8s ease-out;
  }
  
  .join-subtitle {
    font-size: var(--font-size-xl);
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
  }
  
  .connection-status {
    margin-bottom: var(--space-6);
  }
  
  .status-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    text-align: center;
    color: var(--white);
  }
  
  .status-icon {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-3);
  }
  
  .status-icon.loading {
    animation: spin 1s linear infinite;
  }
  
  .status-icon.error {
    color: var(--error);
  }
  
  .status-card h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-2);
    font-weight: 600;
  }
  
  .status-card p {
    opacity: 0.9;
    line-height: 1.5;
  }
  
  .join-form {
    margin-bottom: var(--space-8);
  }
  
  .form-card {
    padding: var(--space-6);
    border-radius: var(--radius-2xl);
  }
  
  .form-section {
    margin-bottom: var(--space-6);
  }
  
  .form-section:last-child {
    margin-bottom: 0;
  }
  
  .form-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--white);
    margin-bottom: var(--space-3);
  }
  
  .label-emoji {
    font-size: var(--font-size-xl);
  }
  
  .name-input {
    font-size: var(--font-size-lg);
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
  }
  
  .name-validation {
    margin-top: var(--space-2);
    text-align: center;
    min-height: 20px;
  }
  
  .validation-message {
    font-size: var(--font-size-sm);
    font-weight: 600;
  }
  
  .validation-message.valid {
    color: var(--success);
  }
  
  .validation-message.invalid {
    color: var(--error);
  }
  
  .avatar-preview {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-4);
  }
  
  .preview-avatar {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-4xl);
    border: 4px solid rgba(255, 255, 255, 0.3);
    box-shadow: var(--shadow-lg);
    transition: all var(--transition);
  }
  
  .selection-section {
    margin-bottom: var(--space-5);
  }
  
  .selection-section:last-child {
    margin-bottom: 0;
  }
  
  .selection-title {
    color: var(--white);
    font-size: var(--font-size-base);
    font-weight: 600;
    margin-bottom: var(--space-3);
    text-align: center;
  }
  
  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: var(--space-2);
    margin-bottom: var(--space-4);
  }
  
  .emoji-option {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-lg);
    padding: var(--space-2);
    font-size: var(--font-size-xl);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .emoji-option:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  .emoji-option.selected {
    background: var(--white);
    border-color: var(--primary);
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-3);
  }
  
  .color-option {
    width: 100%;
    height: 44px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-option:hover:not(:disabled) {
    transform: scale(1.1);
    border-color: rgba(255, 255, 255, 0.6);
  }
  
  .color-option.selected {
    border-color: var(--white);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  }
  
  .color-check {
    color: var(--white);
    font-weight: 900;
    font-size: var(--font-size-lg);
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  }
  
  .join-button {
    width: 100%;
    font-size: var(--font-size-xl);
    padding: var(--space-4);
    min-height: 60px;
    position: relative;
  }
  
  .join-button.loading {
    pointer-events: none;
  }
  
  .button-emoji,
  .button-spinner {
    font-size: var(--font-size-2xl);
  }
  
  .button-spinner {
    animation: spin 1s linear infinite;
  }
  
  .join-help {
    text-align: center;
    margin-top: var(--space-3);
    font-size: var(--font-size-base);
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0;
  }
  
  .join-help.error {
    color: var(--error);
    font-weight: 600;
  }
  
  .game-info {
    text-align: center;
  }
  
  .info-items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-4);
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-base);
    font-weight: 500;
  }
  
  .info-emoji {
    font-size: var(--font-size-lg);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .join-content {
      max-width: 100%;
    }
    
    .game-title {
      font-size: var(--font-size-3xl);
      flex-direction: column;
      gap: var(--space-2);
    }
    
    .title-emoji {
      font-size: var(--font-size-2xl);
    }
    
    .emoji-grid {
      grid-template-columns: repeat(6, 1fr);
    }
    
    .color-grid {
      grid-template-columns: repeat(4, 1fr);
    }
    
    .info-items {
      flex-direction: column;
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .emoji-grid {
      grid-template-columns: repeat(4, 1fr);
    }
    
    .preview-avatar {
      width: 60px;
      height: 60px;
      font-size: var(--font-size-2xl);
    }
  }
</style>