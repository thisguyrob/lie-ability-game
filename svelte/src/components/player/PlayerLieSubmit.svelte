<script>
  import { createEventDispatcher } from 'svelte';
  
  export let gameState;
  export let subStepInfo;
  
  const dispatch = createEventDispatcher();
  
  let lieText = '';
  let isSubmitting = false;
  let showTip = false;
  
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
  
  function submitLie() {
    if (lieText.trim() && !isSubmitting && !subStepInfo.hasSubmitted) {
      isSubmitting = true;
      dispatch('submitLie', { lie: lieText.trim() });
      
      // Reset state after submission
      setTimeout(() => {
        isSubmitting = false;
      }, 1500);
    }
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
      submitLie();
    }
  }
  
  function toggleTip() {
    showTip = !showTip;
  }
  
  // Computed values
  $: currentQuestion = gameState.currentQuestion;
  $: timer = gameState.timer;
  $: canSubmit = lieText.trim().length > 0 && !isSubmitting && !subStepInfo.hasSubmitted && subStepInfo.canAct;
  
  // Example lies for inspiration (based on question category)
  const lieExamples = {
    'History': ['Sword', 'Crown', 'Medal', 'Map'],
    'Animals': ['Pack', 'Herd', 'School', 'Pride'],
    'Food': ['Apple', 'Banana', 'Orange', 'Grape'],
    'Science': ['Mercury', 'Venus', 'Mars', 'Saturn'],
    'Sports': ['Soccer', 'Tennis', 'Golf', 'Hockey'],
    'Geography': ['Russia', 'Canada', 'China', 'Brazil'],
    'Music': ['Elvis', 'Beatles', 'Prince', 'Madonna'],
    'Movies': ['Star Wars', 'Jaws', 'E.T.', 'Titanic'],
    'default': ['Answer', 'Option', 'Choice', 'Response']
  };
  
  function getExampleLies(category) {
    return lieExamples[category] || lieExamples.default;
  }
  
  $: exampleLies = currentQuestion ? getExampleLies(currentQuestion.category) : lieExamples.default;
  
  // Format timer display
  function formatTime(seconds) {
    return seconds?.toString().padStart(2, '0') || '--';
  }
</script>

<div class="lie-submit-container">
  {#if subStepInfo.hasSubmitted}
    <!-- Already submitted state -->
    <div class="submitted-state fade-in">
      <div class="submitted-card glass">
        <div class="submitted-icon">✅</div>
        <h2>Lie Submitted!</h2>
        <p>Great job! Your lie has been submitted successfully.</p>
        <div class="waiting-message">
          <div class="spinner">⏳</div>
          <span>Waiting for other players to finish...</span>
        </div>
        
        {#if timer}
          <div class="timer-remaining">
            <span class="timer-number">{formatTime(timer.remaining)}</span>
            <span class="timer-label">seconds left</span>
          </div>
        {/if}
      </div>
    </div>
    
  {:else}
    <!-- Submission form -->
    <div class="submit-form slide-up">
      <!-- Header with question -->
      {#if currentQuestion}
        <div class="question-header glass">
          <div class="category-badge">
            <span class="category-emoji">{getCategoryEmoji(currentQuestion.category)}</span>
            <span class="category-name">{currentQuestion.category}</span>
          </div>
          <div class="question-text">
            {currentQuestion.question}
          </div>
        </div>
      {/if}
      
      <!-- Timer -->
      {#if timer}
        <div class="timer-display" class:urgent={timer.remaining <= 10}>
          <div class="timer-circle">
            <div class="timer-number">{formatTime(timer.remaining)}</div>
          </div>
          <div class="timer-label">seconds to submit</div>
        </div>
      {/if}
      
      <!-- Instructions -->
      <div class="instructions">
        <h2>🎭 Create Your Lie</h2>
        <p>Write a convincing fake answer that others might believe is real!</p>
      </div>
      
      <!-- Input area -->
      <div class="input-section">
        <div class="input-container">
          <label for="lieInput" class="sr-only">Enter your lie</label>
          <textarea
            id="lieInput"
            class="lie-input"
            bind:value={lieText}
            on:keydown={handleKeyPress}
            placeholder="Type your most convincing lie here..."
            maxlength="100"
            rows="3"
            disabled={isSubmitting || subStepInfo.hasSubmitted || !subStepInfo.canAct}
          ></textarea>
          
          <div class="input-footer">
            <div class="character-count" class:warning={lieText.length > 80}>
              {lieText.length}/100
            </div>
            
            <button
              class="tip-button"
              on:click={toggleTip}
              aria-label="Show tips"
            >
              💡 Tips
            </button>
          </div>
        </div>
        
        <!-- Tips panel -->
        {#if showTip}
          <div class="tips-panel slide-up">
            <div class="tips-content">
              <h4>💡 How to Create Great Lies</h4>
              <ul>
                <li><strong>Be believable:</strong> Make it sound realistic</li>
                <li><strong>Match the style:</strong> Keep the same tone as the question</li>
                <li><strong>Use knowledge:</strong> Mix in real facts</li>
                <li><strong>Be specific:</strong> Details make lies more convincing</li>
              </ul>
              
              <div class="example-section">
                <h5>Example lies for {currentQuestion?.category || 'this category'}:</h5>
                <div class="example-lies">
                  {#each exampleLies.slice(0, 3) as example}
                    <span class="example-lie">{example}</span>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        {/if}
        
        <!-- Submit button -->
        <button
          class="btn btn-primary btn-lg submit-button"
          class:loading={isSubmitting}
          disabled={!canSubmit}
          on:click={submitLie}
        >
          {#if isSubmitting}
            <span class="button-spinner">🔄</span>
            Submitting...
          {:else}
            <span class="button-emoji">🚀</span>
            Submit Lie
          {/if}
        </button>
        
        <!-- Help text -->
        <div class="submit-help">
          {#if !subStepInfo.canAct}
            <span class="help-text warning">⏳ Please wait for your turn</span>
          {:else if lieText.trim().length === 0}
            <span class="help-text">Enter a lie above, then click submit</span>
          {:else if lieText.trim().length < 2}
            <span class="help-text warning">Your lie should be at least 2 characters</span>
          {:else}
            <span class="help-text success">✓ Ready to submit! Press Ctrl+Enter or click the button</span>
          {/if}
        </div>
      </div>
      
      <!-- Game context -->
      <div class="game-context">
        <div class="context-item">
          <span class="context-emoji">🎯</span>
          <span>Round {gameState.round || 1} • Question {gameState.question || 1}</span>
        </div>
        <div class="context-item">
          <span class="context-emoji">🏆</span>
          <span>Points: {gameState.round === 1 ? '500' : gameState.round === 2 ? '1000' : '1500'} per player fooled</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .lie-submit-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--space-4);
  }
  
  .submitted-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .submitted-card {
    text-align: center;
    padding: var(--space-8) var(--space-6);
    border-radius: var(--radius-2xl);
    max-width: 400px;
    width: 100%;
  }
  
  .submitted-icon {
    font-size: var(--font-size-6xl);
    margin-bottom: var(--space-4);
    animation: bounce-in 0.6s ease-out;
  }
  
  .submitted-card h2 {
    color: var(--white);
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-3);
    font-weight: 700;
  }
  
  .submitted-card p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-6);
  }
  
  .waiting-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-base);
    margin-bottom: var(--space-4);
  }
  
  .spinner {
    animation: spin 2s linear infinite;
  }
  
  .timer-remaining {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }
  
  .timer-remaining .timer-number {
    font-size: var(--font-size-2xl);
    font-weight: 900;
    color: var(--white);
  }
  
  .timer-remaining .timer-label {
    font-size: var(--font-size-sm);
    color: rgba(255, 255, 255, 0.8);
  }
  
  .submit-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  
  .question-header {
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    text-align: center;
  }
  
  .category-badge {
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
    font-weight: 600;
    font-size: var(--font-size-lg);
  }
  
  .question-text {
    color: var(--white);
    font-size: var(--font-size-xl);
    font-weight: 600;
    line-height: 1.4;
  }
  
  .timer-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }
  
  .timer-circle {
    width: 60px;
    height: 60px;
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
    text-align: center;
  }
  
  .instructions {
    text-align: center;
  }
  
  .instructions h2 {
    color: var(--white);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-2);
    font-weight: 700;
  }
  
  .instructions p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
  }
  
  .input-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .input-container {
    position: relative;
  }
  
  .lie-input {
    width: 100%;
    padding: var(--space-4);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-xl);
    background: rgba(255, 255, 255, 0.9);
    color: var(--gray-800);
    font-size: var(--font-size-lg);
    font-weight: 500;
    line-height: 1.4;
    resize: none;
    transition: all var(--transition);
  }
  
  .lie-input:focus {
    outline: none;
    border-color: var(--white);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
    background: var(--white);
  }
  
  .lie-input::placeholder {
    color: var(--gray-400);
    font-style: italic;
  }
  
  .lie-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-2);
  }
  
  .character-count {
    color: rgba(255, 255, 255, 0.7);
    font-size: var(--font-size-sm);
    font-weight: 600;
  }
  
  .character-count.warning {
    color: var(--warning);
  }
  
  .tip-button {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: var(--white);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .tip-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .tips-panel {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
  }
  
  .tips-content h4 {
    color: var(--white);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-3);
    font-weight: 600;
  }
  
  .tips-content ul {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--space-4);
  }
  
  .tips-content li {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-2);
    line-height: 1.4;
  }
  
  .tips-content strong {
    color: var(--white);
  }
  
  .example-section h5 {
    color: var(--white);
    font-size: var(--font-size-base);
    margin-bottom: var(--space-2);
    font-weight: 600;
  }
  
  .example-lies {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }
  
  .example-lie {
    background: rgba(255, 255, 255, 0.2);
    color: var(--white);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius);
    font-size: var(--font-size-sm);
    font-weight: 500;
  }
  
  .submit-button {
    width: 100%;
    font-size: var(--font-size-xl);
    padding: var(--space-4);
    min-height: 56px;
  }
  
  .submit-button.loading {
    pointer-events: none;
  }
  
  .button-emoji,
  .button-spinner {
    font-size: var(--font-size-2xl);
  }
  
  .button-spinner {
    animation: spin 1s linear infinite;
  }
  
  .submit-help {
    text-align: center;
  }
  
  .help-text {
    font-size: var(--font-size-base);
    font-weight: 500;
  }
  
  .help-text.success {
    color: var(--success);
  }
  
  .help-text.warning {
    color: var(--warning);
  }
  
  .help-text:not(.success):not(.warning) {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .game-context {
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
  }
  
  .context-emoji {
    font-size: var(--font-size-base);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @media (max-width: 768px) {
    .lie-submit-container {
      padding: var(--space-3);
    }
    
    .question-text {
      font-size: var(--font-size-lg);
    }
    
    .instructions h2 {
      font-size: var(--font-size-xl);
    }
    
    .lie-input {
      font-size: var(--font-size-base);
      padding: var(--space-3);
    }
    
    .game-context {
      flex-direction: column;
      align-items: center;
    }
    
    .tips-content ul {
      padding-left: var(--space-4);
    }
    
    .tips-content li {
      list-style: disc;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .lie-input {
      border-width: 3px;
    }
    
    .tips-panel {
      border-width: 2px;
    }
  }
</style>