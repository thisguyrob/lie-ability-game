<script>
  import { createEventDispatcher } from 'svelte';
  
  export let gameState;
  export let subStepInfo;
  
  const dispatch = createEventDispatcher();
  
  let selectedOption = null;
  let likedOptions = new Set();
  
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
  
  function selectOption(index) {
    if (!subStepInfo.hasSelected && subStepInfo.canAct) {
      selectedOption = index;
      dispatch('selectOption', { index });
    }
  }
  
  function toggleLike(index) {
    if (subStepInfo.hasSelected && index !== selectedOption) {
      if (likedOptions.has(index)) {
        likedOptions.delete(index);
      } else {
        likedOptions.add(index);
      }
      likedOptions = new Set(likedOptions); // Trigger reactivity
      dispatch('likeLie', { index });
    }
  }
  
  // Format timer display
  function formatTime(seconds) {
    return seconds?.toString().padStart(2, '0') || '--';
  }
  
  // Computed values
  $: currentQuestion = gameState.currentQuestion;
  $: options = gameState.options || [];
  $: timer = gameState.timer;
  $: canSelect = !subStepInfo.hasSelected && subStepInfo.canAct;
  $: canLike = subStepInfo.hasSelected;
  
  // Get option letter (A, B, C, etc.)
  function getOptionLetter(index) {
    return String.fromCharCode(65 + index);
  }
</script>

<div class="option-select-container">
  {#if subStepInfo.hasSelected}
    <!-- Already selected - show selected option and allow liking -->
    <div class="selected-state fade-in">
      <div class="selection-header">
        <h1>✅ Choice Made!</h1>
        <p>You selected option <strong>{getOptionLetter(selectedOption)}</strong>. Now you can like other creative lies!</p>
        
        {#if timer}
          <div class="timer-display">
            <div class="timer-circle">
              <div class="timer-number">{formatTime(timer.remaining)}</div>
            </div>
            <div class="timer-label">seconds remaining</div>
          </div>
        {/if}
      </div>
      
      <!-- Show question for context -->
      {#if currentQuestion}
        <div class="question-context glass">
          <div class="context-header">
            <span class="category-emoji">{getCategoryEmoji(currentQuestion.category)}</span>
            <span class="category-name">{currentQuestion.category}</span>
          </div>
          <div class="context-question">
            {currentQuestion.question}
          </div>
        </div>
      {/if}
      
      <!-- Options with like functionality -->
      <div class="options-list">
        <h3>👍 Like creative lies from other players:</h3>
        <div class="options-grid">
          {#each options as option, index}
            <div 
              class="option-item"
              class:selected={index === selectedOption}
              class:liked={likedOptions.has(index)}
              class:can-like={canLike && index !== selectedOption}
            >
              <div class="option-header">
                <div class="option-letter" class:selected={index === selectedOption}>
                  {getOptionLetter(index)}
                </div>
                
                {#if index === selectedOption}
                  <div class="selection-badge">Your choice</div>
                {:else if canLike}
                  <button
                    class="like-button"
                    class:liked={likedOptions.has(index)}
                    on:click={() => toggleLike(index)}
                  >
                    {likedOptions.has(index) ? '❤️' : '🤍'}
                  </button>
                {/if}
              </div>
              
              <div class="option-text">
                {option.text}
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="waiting-message">
        <div class="spinner">⏳</div>
        <span>Waiting for other players to finish voting...</span>
      </div>
    </div>
    
  {:else}
    <!-- Selection interface -->
    <div class="selection-interface slide-up">
      <!-- Header -->
      <div class="selection-header">
        <h1>🗳️ Vote for the Truth</h1>
        <p>Which answer do you think is the real one?</p>
        
        {#if timer}
          <div class="timer-display" class:urgent={timer.remaining <= 10}>
            <div class="timer-circle">
              <div class="timer-number">{formatTime(timer.remaining)}</div>
            </div>
            <div class="timer-label">seconds to vote</div>
          </div>
        {/if}
      </div>
      
      <!-- Question context -->
      {#if currentQuestion}
        <div class="question-context glass">
          <div class="context-header">
            <span class="category-emoji">{getCategoryEmoji(currentQuestion.category)}</span>
            <span class="category-name">{currentQuestion.category}</span>
          </div>
          <div class="context-question">
            {currentQuestion.question}
          </div>
        </div>
      {/if}
      
      <!-- Options for selection -->
      <div class="options-selection">
        <h2>Choose your answer:</h2>
        <div class="options-grid">
          {#each options as option, index}
            <button
              class="option-button scale-in"
              style="animation-delay: {index * 100}ms"
              disabled={!canSelect}
              on:click={() => selectOption(index)}
            >
              <div class="option-letter">
                {getOptionLetter(index)}
              </div>
              <div class="option-text">
                {option.text}
              </div>
              <div class="option-hint">
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
          <p class="help-text">Think carefully - which one sounds like the real answer?</p>
        {/if}
      </div>
    </div>
  {/if}
  
  <!-- Game context -->
  <div class="game-context">
    <div class="context-items">
      <div class="context-item">
        <span class="context-emoji">🎯</span>
        <span>Round {gameState.round || 1} • Question {gameState.question || 1}</span>
      </div>
      <div class="context-item">
        <span class="context-emoji">🏆</span>
        <span>
          {gameState.round === 1 ? '1,000' : gameState.round === 2 ? '2,000' : '3,000'} points for finding truth
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .option-select-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--space-4);
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
  
  .selection-header strong {
    color: var(--white);
    font-weight: 700;
  }
  
  .timer-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-4);
  }
  
  .timer-circle {
    width: 70px;
    height: 70px;
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
    font-size: var(--font-size-xl);
    font-weight: 900;
    color: var(--white);
  }
  
  .timer-label {
    color: var(--white);
    font-size: var(--font-size-sm);
    font-weight: 600;
    opacity: 0.8;
  }
  
  .question-context {
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    text-align: center;
  }
  
  .context-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }
  
  .category-emoji {
    font-size: var(--font-size-xl);
  }
  
  .category-name {
    color: var(--white);
    font-weight: 700;
    font-size: var(--font-size-lg);
  }
  
  .context-question {
    color: var(--white);
    font-size: var(--font-size-lg);
    font-weight: 600;
    line-height: 1.4;
  }
  
  .options-selection,
  .options-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .options-selection h2,
  .options-list h3 {
    color: var(--white);
    font-size: var(--font-size-2xl);
    font-weight: 700;
    text-align: center;
  }
  
  .options-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .option-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    display: flex;
    align-items: center;
    gap: var(--space-4);
    cursor: pointer;
    transition: all var(--transition);
    min-height: 80px;
    position: relative;
    overflow: hidden;
  }
  
  .option-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  
  .option-button:active {
    transform: translateY(0);
  }
  
  .option-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .option-item {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    transition: all var(--transition);
  }
  
  .option-item.selected {
    background: rgba(16, 185, 129, 0.2);
    border-color: var(--success);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
  }
  
  .option-item.liked {
    background: rgba(244, 63, 94, 0.2);
    border-color: #f43f5e;
  }
  
  .option-item.can-like:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
  
  .option-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-2);
  }
  
  .option-letter {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.9);
    color: var(--gray-800);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: var(--font-size-lg);
    flex-shrink: 0;
    transition: all var(--transition);
  }
  
  .option-letter.selected {
    background: var(--success);
    color: var(--white);
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
  }
  
  .selection-badge {
    background: var(--success);
    color: var(--white);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius);
    font-size: var(--font-size-xs);
    font-weight: 700;
  }
  
  .like-button {
    background: none;
    border: none;
    font-size: var(--font-size-xl);
    cursor: pointer;
    transition: all var(--transition-fast);
    padding: var(--space-1);
    border-radius: var(--radius);
  }
  
  .like-button:hover {
    transform: scale(1.2);
  }
  
  .like-button.liked {
    animation: heart-beat 0.3s ease-out;
  }
  
  .option-text {
    color: var(--white);
    font-size: var(--font-size-lg);
    font-weight: 500;
    line-height: 1.4;
    flex: 1;
  }
  
  .option-hint {
    color: rgba(255, 255, 255, 0.7);
    font-size: var(--font-size-sm);
    font-weight: 500;
    opacity: 0;
    transition: all var(--transition);
  }
  
  .option-button:hover:not(:disabled) .option-hint {
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
  
  .waiting-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-base);
    font-weight: 500;
    background: rgba(255, 255, 255, 0.1);
    padding: var(--space-3);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
  }
  
  .spinner {
    animation: spin 2s linear infinite;
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
  
  @keyframes heart-beat {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  
  @media (max-width: 768px) {
    .option-select-container {
      padding: var(--space-3);
      gap: var(--space-4);
    }
    
    .selection-header h1 {
      font-size: var(--font-size-2xl);
    }
    
    .selection-header p {
      font-size: var(--font-size-lg);
    }
    
    .context-question {
      font-size: var(--font-size-base);
    }
    
    .option-button,
    .option-item {
      padding: var(--space-3);
      min-height: 70px;
    }
    
    .option-text {
      font-size: var(--font-size-base);
    }
    
    .timer-circle {
      width: 60px;
      height: 60px;
    }
    
    .timer-number {
      font-size: var(--font-size-lg);
    }
    
    .context-items {
      flex-direction: column;
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .option-header {
      flex-direction: column;
      gap: var(--space-2);
      align-items: flex-start;
    }
    
    .option-letter {
      width: 32px;
      height: 32px;
      font-size: var(--font-size-base);
    }
    
    .option-text {
      font-size: var(--font-size-sm);
    }
  }
  
  /* Ripple effect for option buttons */
  .option-button::before {
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
  
  .option-button:active::before {
    width: 100%;
    height: 100%;
  }
</style>