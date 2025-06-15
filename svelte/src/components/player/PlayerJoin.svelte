<script>
  import { createEventDispatcher } from 'svelte'
  
  export let socket
  
  const dispatch = createEventDispatcher()
  
  let name = ''
  let selectedAvatar = '😀'
  let selectedColor = '#667eea'
  let isJoining = false
  let error = ''
  
  const avatars = [
    '😀', '😎', '🤓', '🥳', '🤠', '🦄', '🐶', '🐱', 
    '🦊', '🐸', '🐧', '🦁', '🐯', '🐨', '🐼', '🦆',
    '🦉', '🦋', '🐢', '🦕', '🦖', '🐙', '🦑', '🦐',
    '🦀', '🐠', '🐟', '🐡', '🦈', '🐳', '🐋', '🐊'
  ]
  
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#fa709a', '#fccb90', '#ff6b6b', '#4ecdc4',
    '#45b7d1', '#5ca0d3', '#6c5ce7', '#a29bfe',
    '#fd79a8', '#e17055', '#fdcb6e', '#00b894'
  ]
  
  const handleJoin = async () => {
    if (!name.trim()) {
      error = 'Please enter your name'
      return
    }
    
    if (name.trim().length > 15) {
      error = 'Name must be 15 characters or less'
      return
    }
    
    isJoining = true
    error = ''
    
    socket.emit('join_game', {
      name: name.trim(),
      avatar: {
        emoji: selectedAvatar,
        color: selectedColor
      }
    })
    
    // Listen for join response
    socket.once('player_joined_response', (response) => {
      isJoining = false
      if (response.success) {
        dispatch('joined', response.player)
      } else {
        error = response.error || 'Failed to join game'
      }
    })
    
    // Timeout after 5 seconds
    setTimeout(() => {
      if (isJoining) {
        isJoining = false
        error = 'Connection timeout. Please try again.'
      }
    }, 5000)
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isJoining) {
      handleJoin()
    }
  }
</script>

<div class="join-container">
  <div class="join-card">
    <h1 class="title">🎮 Lie-Ability Game</h1>
    <p class="subtitle">Join the fun!</p>
    
    <div class="form-group">
      <label for="name">Your Name</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        on:keypress={handleKeyPress}
        placeholder="Enter your name"
        maxlength="15"
        disabled={isJoining}
        class:error={error}
      />
      {#if error}
        <p class="error-message">{error}</p>
      {/if}
    </div>
    
    <div class="form-group">
      <label>Choose Your Avatar</label>
      <div class="avatar-grid">
        {#each avatars as avatar}
          <button
            class="avatar-option"
            class:selected={selectedAvatar === avatar}
            style="background-color: {selectedAvatar === avatar ? selectedColor : 'transparent'}"
            on:click={() => selectedAvatar = avatar}
            disabled={isJoining}
          >
            {avatar}
          </button>
        {/each}
      </div>
    </div>
    
    <div class="form-group">
      <label>Pick Your Color</label>
      <div class="color-grid">
        {#each colors as color}
          <button
            class="color-option"
            class:selected={selectedColor === color}
            style="background-color: {color}"
            on:click={() => selectedColor = color}
            disabled={isJoining}
          >
            {selectedColor === color ? '✓' : ''}
          </button>
        {/each}
      </div>
    </div>
    
    <div class="preview">
      <span class="preview-label">Your avatar:</span>
      <div class="avatar-preview" style="background-color: {selectedColor}">
        {selectedAvatar}
      </div>
    </div>
    
    <button
      class="join-button"
      on:click={handleJoin}
      disabled={isJoining || !name.trim()}
    >
      {isJoining ? 'Joining...' : 'Join Game'}
    </button>
  </div>
</div>

<style>
  .join-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .join-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 400px;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 800;
    color: #2d3748;
    text-align: center;
    margin: 0 0 0.5rem 0;
  }
  
  .subtitle {
    color: #718096;
    text-align: center;
    margin: 0 0 2rem 0;
    font-size: 1.1rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  
  input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  input.error {
    border-color: #f56565;
  }
  
  input:disabled {
    background: #f7fafc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #f56565;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0.5rem;
  }
  
  .avatar-option {
    width: 40px;
    height: 40px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  }
  
  .avatar-option:hover:not(:disabled) {
    transform: scale(1.1);
    border-color: #667eea;
  }
  
  .avatar-option.selected {
    border-color: transparent;
    color: white;
    transform: scale(1.1);
  }
  
  .avatar-option:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0.5rem;
  }
  
  .color-option {
    width: 40px;
    height: 40px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-option:hover:not(:disabled) {
    transform: scale(1.1);
  }
  
  .color-option.selected {
    border-color: #2d3748;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  }
  
  .color-option:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .preview {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem 0;
    padding: 1rem;
    background: #f7fafc;
    border-radius: 10px;
  }
  
  .preview-label {
    color: #718096;
    font-weight: 500;
  }
  
  .avatar-preview {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .join-button {
    width: 100%;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 1rem;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .join-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(72, 187, 120, 0.4);
  }
  
  .join-button:disabled {
    background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
    cursor: not-allowed;
    opacity: 0.8;
  }
  
  @media (max-width: 480px) {
    .join-card {
      padding: 1.5rem;
    }
    
    .title {
      font-size: 1.75rem;
    }
    
    .avatar-grid,
    .color-grid {
      grid-template-columns: repeat(6, 1fr);
    }
  }
</style>