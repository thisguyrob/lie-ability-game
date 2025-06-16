<script>
  import { createEventDispatcher } from 'svelte';
  
  export let gameState;
  export let subStepInfo;
  
  const dispatch = createEventDispatcher();
  
  // Category emoji mappings
  const categoryEmojis = {
    'History': '📚', 'Animals': '🐾', 'Food': '🍎', 'Science': '🔬',
    'Sports': '⚽', 'Entertainment': '🎬', 'Geography': '🌍', 'Music': '🎵',
    'Art': '🎨', 'Technology': '💻', 'Nature': '🌿', 'Space': '🚀',
    'Movies': '🎬', 'TV': '📺', 'Games': '🎮', 'Literature': '📖',
    'Mythology': '🏛️', 'Fashion': '👗', 'Language': '💬', 'Inventions': '💡',
    'Comics': '💥', 'Tech': '⚙️', 'Misc': '🎲', 'Bonus': '⭐'
  };
  
  function getCategoryEmoji(category) {
    return categoryEmojis[category] || '❓';
  }
  
  function selectCategory(index) {
    if (subStepInfo.isMyTurn && subStepInfo.canAct) {
      dispatch('selectCategory', { index });
    }
  }
  
  // Format timer display
  function formatTime(seconds) {
    return seconds?.toString().padStart(2, '0') || '--';
  }
  
  // Computed values
  $: categoriesForSelection = gameState.categoriesForSelection || [];
  $: timer = gameState.timer;
  $: isMyTurn = subStepInfo.isMyTurn;
  $: canSelect = subStepInfo.canAct && isMyTurn;
</script>

<div class="category-select-container">
  {#if isMyTurn}
    <!-- Player's turn to select -->
    <div class="selection-interface fade-in">
      <!-- Header -->
      <div class="selection-header">
        <h1>🎯 Your Turn!</h1>
        <p>Choose a category for the next question.</p>
        
        {#if timer}
          <div class="timer-display" class:urgent={timer.remaining <= 5}>
            <div class="timer-circle">
              <div class="timer-number">{formatTime(timer.remaining)}</div>
            </div>
            <div class="timer-label">seconds to choose</div>
          </div>
        {/if}
      </div>
      
      <!-- Categories -->
      <div class="categories-section">
        <h2>Pick a category:</h2>
        <div class="categories-grid">
          {#each categoriesForSelection as category, index}
            <button
              class="category-button scale-in"
              style="animation-delay: {index * 150}ms"
              disabled={!canSelect}
              on:click={() => selectCategory(index)}
            >
              <div class="category-emoji">
                {getCategoryEmoji(category)}
              </div>
              <div class="category-name">
                {category}
              </div>
              <div class="category-hint">
                Tap to select
              </div>
            </button>
          {/each}
        </div>
      </div>
      
      <!-- Help text -->
      <div class="selection-help">
        {#if !canSelect}
          <p class="help-text warning">⏳ Please wait...</p>
        {:else}
          <p class="help-text">Choose the category that sounds most interesting to you!</p>
        {/if}
      </div>
    </div>
    
  {:else}
    <!-- Waiting for another player -->
    <div class="waiting-interface fade-in">
      <div class="waiting-card glass">
        <div class="waiting-content">
          <div class="waiting-icon">⏳</div>
          <h2>Another Player is Choosing</h2>
          <p>Someone else is picking the category for this question.</p>
          
          {#if timer}
            <div class="timer-remaining">
              <span class="timer-number">{formatTime(timer.remaining)}</span>
              <span class="timer-label">seconds remaining</span>
            </div>
          {/if}
          
          {#if categoriesForSelection.length > 0}
            <div class="preview-categories">
              <h3>Available categories:</h3>
              <div class="categories-preview">
                {#each categoriesForSelection as category}
                  <div class="preview-category">
                    <span class="preview-emoji">{getCategoryEmoji(category)}</span>
                    <span class="preview-name">{category}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Game context -->
  <div class="game-context slide-up">
    <div class="context-items">
      <div class="context-item">
        <span class="context-emoji">🎯</span>
        <span>Round {gameState.round || 1} • Question {gameState.question || 1}</span>
      </div>
      <div class="context-item">
        <span class="context-emoji">👥</span>
        <span>{gameState.players?.filter(p => p.connected).length || 0} players</span>
      </div>
    </div>
  </div>
</div>

<style>
  .category-select-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--space-4);
    gap: var(--space-6);
  }
  
  .selection-interface {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  
  .selection-header {
    text-align: center;
  }
  
  .selection-header h1 {
    color: var(--white);
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-3);
    font-weight: 900;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .selection-header p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
  }
  
  .timer-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-4);
  }
  
  .timer-circle {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.2);
    border: 3px solid rgba(255, 255, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    transition: all var(--transition);
  }
  
  .timer-display.urgent .timer-circle {
    background: rgba(239, 68, 68, 0.3);
    border-color: var(--error);
    animation: pulse 0.5s infinite;
  }
  
  .timer-number {
    font-size: var(--font-size-2xl);
    font-weight: 900;
    color: var(--white);
  }
  
  .timer-label {
    color: var(--white);
    font-size: var(--font-size-sm);
    font-weight: 600;
    opacity: 0.8;
  }
  
  .categories-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .categories-section h2 {
    color: var(--white);
    font-size: var(--font-size-2xl);
    font-weight: 700;
    text-align: center;
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);
    flex: 1;
  }
  
  .category-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-2xl);
    padding: var(--space-6) var(--space-4);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    cursor: pointer;
    transition: all var(--transition);
    min-height: 140px;
    position: relative;
    overflow: hidden;
  }
  
  .category-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
  }
  
  .category-button:active {
    transform: translateY(-2px) scale(1.01);
  }
  
  .category-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .category-emoji {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--space-2);
    transition: all var(--transition);
  }
  
  .category-button:hover:not(:disabled) .category-emoji {
    transform: scale(1.1);
  }
  
  .category-name {
    color: var(--white);
    font-size: var(--font-size-xl);
    font-weight: 700;
    text-align: center;
    line-height: 1.2;
  }
  
  .category-hint {
    color: rgba(255, 255, 255, 0.7);
    font-size: var(--font-size-sm);
    font-weight: 500;
    opacity: 0;
    transition: all var(--transition);
  }
  
  .category-button:hover:not(:disabled) .category-hint {
    opacity: 1;
  }
  
  .selection-help {
    text-align: center;
  }
  
  .help-text {
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .help-text.warning {
    color: var(--warning);
  }
  
  .waiting-interface {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .waiting-card {
    padding: var(--space-8) var(--space-6);
    border-radius: var(--radius-2xl);
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .waiting-content {
    color: var(--white);
  }
  
  .waiting-icon {
    font-size: var(--font-size-6xl);
    margin-bottom: var(--space-4);
    animation: spin 2s linear infinite;
  }
  
  .waiting-content h2 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-3);
    font-weight: 700;
  }
  
  .waiting-content p {
    font-size: var(--font-size-lg);
    opacity: 0.9;
    margin-bottom: var(--space-6);
  }
  
  .timer-remaining {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    margin-bottom: var(--space-6);
  }
  
  .timer-remaining .timer-number {
    font-size: var(--font-size-3xl);
    font-weight: 900;
  }
  
  .timer-remaining .timer-label {
    font-size: var(--font-size-sm);
    opacity: 0.8;
  }
  
  .preview-categories {
    text-align: center;
  }
  
  .preview-categories h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-3);
    font-weight: 600;
    opacity: 0.9;
  }
  
  .categories-preview {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-3);
  }
  
  .preview-category {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: rgba(255, 255, 255, 0.1);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .preview-emoji {
    font-size: var(--font-size-lg);
  }
  
  .preview-name {
    font-size: var(--font-size-sm);
    font-weight: 600;
  }
  
  .game-context {
    margin-top: auto;
  }
  
  .context-items {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }
  
  .context-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
    font-weight: 500;
    background: rgba(255, 255, 255, 0.1);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
  }
  
  .context-emoji {
    font-size: var(--font-size-base);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 768px) {
    .category-select-container {
      padding: var(--space-3);
      gap: var(--space-4);
    }
    
    .selection-header h1 {
      font-size: var(--font-size-2xl);
    }
    
    .selection-header p {
      font-size: var(--font-size-lg);
    }
    
    .categories-grid {
      grid-template-columns: 1fr;
      gap: var(--space-3);
    }
    
    .category-button {
      min-height: 120px;
      padding: var(--space-4);
    }
    
    .category-emoji {
      font-size: var(--font-size-3xl);
    }
    
    .category-name {
      font-size: var(--font-size-lg);
    }
    
    .timer-circle {
      width: 60px;
      height: 60px;
    }
    
    .timer-number {
      font-size: var(--font-size-xl);
    }
    
    .waiting-content h2 {
      font-size: var(--font-size-2xl);
    }
    
    .categories-preview {
      flex-direction: column;
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .categories-grid {
      gap: var(--space-2);
    }
    
    .category-button {
      min-height: 100px;
      padding: var(--space-3);
    }
    
    .category-emoji {
      font-size: var(--font-size-2xl);
    }
    
    .context-items {
      flex-direction: column;
      align-items: center;
    }
  }
  
  /* Enhanced animations for category selection */
  .category-button {
    animation: scale-in 0.3s ease-out;
  }
  
  .category-button:hover:not(:disabled) {
    animation: none;
  }
  
  /* Ripple effect for button press */
  .category-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
  }
  
  .category-button:active::before {
    width: 100%;
    height: 100%;
  }
</style>