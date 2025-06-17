<script>
  import '../../player-mobile.css';
  
  export let connectionStatus;
  export let onJoin;
  export let onClearData;
  
  let playerName = '';
  let isJoining = false;
  let showNameError = false;
  
  function handleJoin() {
    if (!playerName.trim()) {
      showNameError = true;
      return;
    }
    
    if (connectionStatus !== 'connected') {
      return;
    }
    
    isJoining = true;
    onJoin(playerName.trim());
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleJoin();
    }
  }
  
  function handleNameInput() {
    showNameError = false;
  }
  
  // Generate a random fun name as placeholder
  function generateRandomName() {
    const adjectives = ['Cool', 'Smart', 'Quick', 'Brave', 'Witty', 'Sharp', 'Clever', 'Bold', 'Sneaky', 'Crafty'];
    const nouns = ['Player', 'Gamer', 'Liar', 'Detective', 'Trickster', 'Genius', 'Master', 'Pro'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
  }
  
  let placeholder = generateRandomName();
</script>

<div class="container-mobile safe-top safe-bottom animate-fadeIn">
  <div class="card-mobile">
    <h1 class="title-mobile text-center">Ready to Play?</h1>
    <p class="subtitle-mobile text-center">
      Test your deception skills in this game of lies and laughs
    </p>
    
    <form on:submit|preventDefault={handleJoin}>
      <div class="form-group">
        <input
          id="playerName"
          type="text"
          bind:value={playerName}
          on:input={handleNameInput}
          placeholder={placeholder}
          maxlength="20"
          disabled={connectionStatus !== 'connected' || isJoining}
          on:keypress={handleKeyPress}
          class="input-mobile"
          class:error={showNameError}
          autofocus
          autocomplete="off"
          autocorrect="off"
          autocapitalize="words"
        />
        
        {#if showNameError}
          <div class="error-message animate-slideUp">
            Please enter your name
          </div>
        {/if}
        
        {#if connectionStatus !== 'connected'}
          <div class="connection-status">
            <div class="connection-dot"></div>
            Connecting to server...
          </div>
        {/if}
      </div>
      
      <button
        type="submit"
        class="btn-touch btn-success btn-full-width"
        class:btn-disabled={connectionStatus !== 'connected' || isJoining || !playerName.trim()}
        disabled={connectionStatus !== 'connected' || isJoining}
      >
        {#if isJoining}
          <div class="spinner-mobile"></div>
          Joining...
        {:else if connectionStatus !== 'connected'}
          <span class="icon">📡</span>
          Connecting...
        {:else}
          <span class="icon">🎮</span>
          Join Game
        {/if}
      </button>
    </form>
    
    <div class="divider"></div>
    
    <div class="how-to-play">
      <h2 class="section-title">How to Play</h2>
      <ul class="list-mobile">
        <li class="list-item-mobile">
          <span class="icon">❓</span>
          <span class="text">Answer trivia questions</span>
        </li>
        <li class="list-item-mobile">
          <span class="icon">🤥</span>
          <span class="text">Create convincing lies</span>
        </li>
        <li class="list-item-mobile">
          <span class="icon">🗳️</span>
          <span class="text">Vote for the truth</span>
        </li>
        <li class="list-item-mobile">
          <span class="icon">🏆</span>
          <span class="text">Score points by fooling others</span>
        </li>
      </ul>
    </div>
    
    {#if onClearData}
      <div class="footer-actions">
        <button class="link-button" on:click={onClearData}>
          Reset saved data
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .form-group {
    margin-bottom: var(--space-lg);
  }
  
  .input-mobile.error {
    border-color: var(--error-color);
    animation: shake 0.3s ease;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .error-message {
    color: var(--error-color);
    font-size: var(--font-sm);
    margin-top: var(--space-xs);
    font-weight: 500;
  }
  
  .connection-status {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-top: var(--space-sm);
    color: var(--warning-color);
    font-size: var(--font-sm);
    font-weight: 500;
  }
  
  .connection-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--warning-color);
    animation: pulse var(--transition-slow) infinite;
  }
  
  .btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #94a3b8;
    box-shadow: none;
  }
  
  .btn-disabled:active {
    transform: none;
  }
  
  .icon {
    font-size: 1.2em;
  }
  
  .divider {
    height: 1px;
    background: #e2e8f0;
    margin: var(--space-xl) 0;
  }
  
  .section-title {
    font-size: var(--font-lg);
    font-weight: 600;
    color: #333;
    margin: 0 0 var(--space-md) 0;
  }
  
  .how-to-play .list-item-mobile {
    cursor: default;
    gap: var(--space-md);
  }
  
  .how-to-play .list-item-mobile:active {
    transform: none;
  }
  
  .how-to-play .icon {
    font-size: 1.3em;
    flex-shrink: 0;
    width: 30px;
    text-align: center;
  }
  
  .how-to-play .text {
    flex: 1;
    font-size: var(--font-sm);
    font-weight: 500;
    color: #4b5563;
  }
  
  .footer-actions {
    margin-top: var(--space-xl);
    text-align: center;
  }
  
  .link-button {
    background: none;
    border: none;
    color: #6b7280;
    font-size: var(--font-sm);
    text-decoration: underline;
    cursor: pointer;
    padding: var(--space-sm);
    transition: color var(--transition-fast);
  }
  
  .link-button:active {
    color: var(--error-color);
  }
  
  @media (min-width: 480px) {
    .how-to-play .text {
      font-size: var(--font-base);
    }
  }
  
  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    .section-title {
      color: var(--text-primary);
    }
    
    .how-to-play .text {
      color: var(--text-secondary);
    }
    
    .connection-status {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-sm);
      margin-top: var(--space-sm);
    }
  }
</style>