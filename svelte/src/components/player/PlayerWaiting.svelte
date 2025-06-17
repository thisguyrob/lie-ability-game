<script>
  export let playerName;
  export let gameState;
  export let currentPlayer;
  export let onUpdateAvatar;
  export let onUpdateName;
  
  $: otherPlayers = gameState.players.filter(p => p.name !== playerName);
  
  // Avatar customization options
  const emojiOptions = ['👤', '😊', '😎', '🤖', '👑', '🐱', '🐶', '🦊', '🐼', '🦁', '🐸', '🐧', '🦄', '🌟', '🔥', '💎', '🎭', '🎯', '🚀', '🎸'];
  const colorOptions = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
    '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
    '#ff9a9e', '#fecfef', '#ffeaa7', '#fab1a0', '#74b9ff', '#a29bfe'
  ];
  
  let showCustomization = false;
  let editingName = false;
  let tempName = playerName;
  
  function handleEmojiSelect(emoji) {
    if (currentPlayer && onUpdateAvatar) {
      onUpdateAvatar(emoji, currentPlayer.avatar.color);
    }
  }
  
  function handleColorSelect(color) {
    if (currentPlayer && onUpdateAvatar) {
      onUpdateAvatar(currentPlayer.avatar.emoji, color);
    }
  }
  
  function toggleCustomization() {
    showCustomization = !showCustomization;
  }
  
  function startEditingName() {
    editingName = true;
    tempName = playerName;
  }
  
  function cancelEditingName() {
    editingName = false;
    tempName = playerName;
  }
  
  function saveName() {
    const trimmedName = tempName.trim();
    if (trimmedName && trimmedName !== playerName && onUpdateName) {
      onUpdateName(trimmedName);
    }
    editingName = false;
  }
  
  function handleNameKeyPress(event) {
    if (event.key === 'Enter') {
      saveName();
    } else if (event.key === 'Escape') {
      cancelEditingName();
    }
  }
</script>

<div class="waiting-container">
  <div class="waiting-card">
    <div class="welcome-section">
      <div class="welcome-icon">👋</div>
      
      {#if editingName}
        <div class="name-editing">
          <input
            type="text"
            bind:value={tempName}
            on:keydown={handleNameKeyPress}
            maxlength="20"
            class="name-input"
            autofocus
            placeholder="Enter your name"
          />
          <div class="name-buttons">
            <button class="save-name-button" on:click={saveName} disabled={!tempName.trim() || tempName.trim() === playerName}>
              ✓ Save
            </button>
            <button class="cancel-name-button" on:click={cancelEditingName}>
              ✕ Cancel
            </button>
          </div>
        </div>
      {:else}
        <div class="name-display">
          <h2 class="welcome-title">Welcome, {playerName}!</h2>
          <button class="edit-name-button" on:click={startEditingName}>
            ✏️ Change Name
          </button>
        </div>
      {/if}
      
      <p class="welcome-message">
        You're in the game! Waiting for more players to join...
      </p>
    </div>
    
    {#if currentPlayer}
    <div class="avatar-customization-section">
      <div class="current-avatar-display">
        <div class="current-avatar" style="background-color: {currentPlayer.avatar.color}">
          <span class="current-emoji">{currentPlayer.avatar.emoji}</span>
        </div>
        <button class="customize-button" on:click={toggleCustomization}>
          {showCustomization ? 'Done' : 'Customize Avatar'}
        </button>
      </div>
      
      {#if showCustomization}
        <div class="customization-panel">
          <div class="customization-section">
            <h4 class="customization-title">Choose Emoji</h4>
            <div class="emoji-grid">
              {#each emojiOptions as emoji}
                <button 
                  class="emoji-option" 
                  class:active={currentPlayer.avatar.emoji === emoji}
                  on:click={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              {/each}
            </div>
          </div>
          
          <div class="customization-section">
            <h4 class="customization-title">Choose Color</h4>
            <div class="color-grid">
              {#each colorOptions as color}
                <button 
                  class="color-option" 
                  class:active={currentPlayer.avatar.color === color}
                  style="background-color: {color}"
                  on:click={() => handleColorSelect(color)}
                >
                </button>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
    {/if}
    
    <!-- Removed game-info section -->
    
    <div class="waiting-indicator">
      <div class="waiting-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p class="waiting-text">
        {#if gameState.players.length < 2}
          Waiting for at least 2 players to start...
        {:else}
          Ready to start! Waiting for host...
        {/if}
      </p>
    </div>
  </div>
</div>

<style>
  .waiting-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeIn 0.6s ease;
  }
  
  .waiting-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  .welcome-section {
    margin-bottom: 2rem;
  }
  
  .name-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .edit-name-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0.8;
    margin-bottom: 1rem;
  }
  
  .edit-name-button:hover {
    opacity: 1;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .name-editing {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }
  
  .name-input {
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
    background: white;
    color: #333;
    transition: all 0.3s ease;
    max-width: 300px;
    width: 100%;
  }
  
  .name-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .name-buttons {
    display: flex;
    gap: 0.75rem;
  }
  
  .save-name-button, .cancel-name-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .save-name-button {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
  }
  
  .save-name-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }
  
  .save-name-button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .cancel-name-button {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
  }
  
  .cancel-name-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
  
  .welcome-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: wave 2s ease-in-out infinite;
  }
  
  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
  }
  
  .welcome-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin: 0;
  }
  
  .welcome-message {
    font-size: 1.1rem;
    color: #666;
    margin: 0;
  }
  
  .avatar-customization-section {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .current-avatar-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .current-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }
  
  .current-emoji {
    font-size: 1.8rem;
  }
  
  .customize-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }
  
  .customize-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  .customization-panel {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    padding: 1.5rem;
    margin-top: 1rem;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .customization-section {
    margin-bottom: 1.5rem;
  }
  
  .customization-section:last-child {
    margin-bottom: 0;
  }
  
  .customization-title {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 1rem 0;
    text-align: center;
  }
  
  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    gap: 0.5rem;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .emoji-option {
    width: 40px;
    height: 40px;
    border: 2px solid transparent;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .emoji-option:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
    transform: scale(1.1);
  }
  
  .emoji-option.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-color: #667eea;
    transform: scale(1.1);
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
    gap: 0.5rem;
    max-width: 250px;
    margin: 0 auto;
  }
  
  .color-option {
    width: 30px;
    height: 30px;
    border: 3px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .color-option:hover {
    transform: scale(1.2);
    border-color: rgba(255, 255, 255, 0.8);
  }
  
  .color-option.active {
    transform: scale(1.2);
    border-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5);
  }

  
  
  .waiting-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .waiting-dots {
    display: flex;
    gap: 0.5rem;
  }
  
  .waiting-dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #667eea;
    animation: dot-bounce 1.4s infinite ease-in-out both;
  }
  
  .waiting-dots span:nth-child(1) { animation-delay: -0.32s; }
  .waiting-dots span:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes dot-bounce {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
  
  .waiting-text {
    font-size: 1rem;
    color: #666;
    margin: 0;
    text-align: center;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
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
  
  @media (max-width: 480px) {
    .waiting-container {
      padding: 0.5rem;
    }
    
    .waiting-card {
      padding: 1.5rem;
    }
    
    .welcome-title {
      font-size: 1.8rem;
    }
    
    
    .emoji-grid {
      grid-template-columns: repeat(auto-fit, minmax(35px, 1fr));
      max-width: 280px;
    }
    
    .emoji-option {
      width: 35px;
      height: 35px;
      font-size: 1rem;
    }
    
    .color-grid {
      grid-template-columns: repeat(auto-fit, minmax(25px, 1fr));
      max-width: 220px;
    }
    
    .color-option {
      width: 25px;
      height: 25px;
    }
    
    .customization-panel {
      padding: 1rem;
    }
    
    .name-input {
      font-size: 1.1rem;
      max-width: 280px;
    }
    
    .name-buttons {
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      max-width: 200px;
    }
    
    .save-name-button, .cancel-name-button {
      width: 100%;
    }
    
    /* Removed game-info responsive styles */
  }
</style>