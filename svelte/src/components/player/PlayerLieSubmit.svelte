<script>
  import '../../player-mobile.css';
  
  export let currentQuestion;
  export let subStepInfo;
  export let onSubmit;
  export let onAuto;
  
  let lieText = '';
  let isSubmitting = false;
  let showStrategies = false;
  
  $: hasSubmitted = subStepInfo?.hasSubmittedLie;
  $: canSubmit = lieText.trim().length > 0 && !hasSubmitted && !isSubmitting;
  
  function handleSubmit() {
    if (!canSubmit) return;

    isSubmitting = true;
    onSubmit(lieText.trim());
    isSubmitting = false;
  }
  
  function handleAutoLie() {
    if (hasSubmitted) return;
    onAuto();
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter' && event.shiftKey === false && canSubmit) {
      event.preventDefault();
      handleSubmit();
    }
  }
  
  // Category emoji mapping
  const categoryEmojis = {
    'History': '📚', 'Animals': '🐾', 'Food': '🍎', 'Sports': '⚽',
    'Geography': '🌍', 'Music': '🎵', 'Science': '🔬', 'Literature': '📖',
    'Inventions': '💡', 'TV': '📺', 'Art': '🎨', 'Language': '🗣️',
    'Movies': '🎬', 'Tech': '💻', 'Fashion': '👗', 'Mythology': '⚡',
    'Games': '🎮', 'Space': '🚀', 'Comics': '💥', 'Misc': '🎯',
    'Bonus': '✨', 'Entertainment': '🎭', 'Nature': '🌿', 'Travel': '✈️'
  };
  
  function getEmoji(category) {
    return categoryEmojis[category] || '❓';
  }
</script>

<div class="container-mobile safe-top safe-bottom animate-fadeIn">
  <div class="card-mobile">
    {#if !hasSubmitted}
      <div class="question-card">
        <div class="category-badge">
          <span class="category-icon">{getEmoji(currentQuestion.category)}</span>
          <span class="category-name">{currentQuestion.category}</span>
        </div>
        <h2 class="question-text">{currentQuestion.question}</h2>
      </div>
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <textarea
            id="lieInput"
            bind:value={lieText}
            placeholder="Create a convincing fake answer..."
            maxlength="100"
            rows="4"
            disabled={hasSubmitted || isSubmitting}
            on:keypress={handleKeyPress}
            class="textarea-mobile"
            class:submitting={isSubmitting}
            autofocus
            autocomplete="off"
            autocorrect="on"
            spellcheck="true"
          ></textarea>
          
          <div class="input-footer">
            <div class="character-count" class:warning={lieText.length > 80}>
              {lieText.length}/100
            </div>
          </div>
        </div>
        
        <div class="button-group">
          <button
            type="submit"
            class="btn-touch btn-success"
            class:btn-disabled={!canSubmit}
            disabled={!canSubmit}
          >
            {#if isSubmitting}
              <div class="spinner-mobile"></div>
              Submitting...
            {:else}
              <span class="icon">✏️</span>
              Submit Lie
            {/if}
          </button>
          
          <button
            type="button"
            class="btn-touch btn-warning"
            disabled={hasSubmitted || isSubmitting}
            on:click={handleAutoLie}
          >
            <span class="icon">🎲</span>
            Auto
          </button>
        </div>
      </form>
      
      <button 
        class="strategy-toggle"
        on:click={() => showStrategies = !showStrategies}
      >
        <span class="icon">💡</span>
        {showStrategies ? 'Hide' : 'Show'} Tips
        <span class="arrow" class:open={showStrategies}>▼</span>
      </button>
      
      {#if showStrategies}
        <div class="strategy-tips animate-slideUp">
          <ul class="list-mobile">
            <li class="list-item-mobile tip-item">
              <span class="icon">🎯</span>
              <span class="text">Mix truth with fiction</span>
            </li>
            <li class="list-item-mobile tip-item">
              <span class="icon">🧠</span>
              <span class="text">Use believable details</span>
            </li>
            <li class="list-item-mobile tip-item">
              <span class="icon">⚡</span>
              <span class="text">Keep it simple</span>
            </li>
          </ul>
        </div>
      {/if}
    {:else}
      <div class="submitted-state text-center">
        <div class="success-icon animate-slideUp">✅</div>
        <h2 class="title-mobile">Lie Submitted!</h2>
        <p class="subtitle-mobile">
          Let's see who falls for it...
        </p>
        
        <div class="submitted-preview">
          <div class="preview-label">Your answer:</div>
          <div class="preview-text">"{lieText || 'Auto-generated'}"</div>
        </div>
        
        <div class="waiting-indicator">
          <div class="waiting-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p class="waiting-text">Waiting for others...</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .question-card {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    margin-bottom: var(--space-xl);
    text-align: center;
  }
  
  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end));
    color: white;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-full);
    font-weight: 600;
    font-size: var(--font-sm);
    margin-bottom: var(--space-md);
  }
  
  .category-icon {
    font-size: 1.2em;
  }
  
  .question-text {
    font-size: var(--font-lg);
    font-weight: 600;
    color: #333;
    margin: 0;
    line-height: 1.4;
  }
  
  .form-group {
    margin-bottom: var(--space-lg);
  }
  
  .textarea-mobile.submitting {
    border-color: var(--success-color);
    background: #f0fdf4;
  }
  
  .input-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-xs);
  }
  
  .character-count {
    font-size: var(--font-xs);
    color: #666;
    font-weight: 500;
  }
  
  .character-count.warning {
    color: var(--error-color);
    font-weight: 700;
  }
  
  .button-group {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }
  
  .icon {
    font-size: 1.2em;
  }
  
  .strategy-toggle {
    width: 100%;
    padding: var(--space-md);
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: var(--radius-md);
    font-size: var(--font-sm);
    font-weight: 500;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    transition: all var(--transition-fast);
  }
  
  .strategy-toggle:active {
    background: #f8fafc;
  }
  
  .arrow {
    font-size: 0.8em;
    transition: transform var(--transition-fast);
    margin-left: auto;
  }
  
  .arrow.open {
    transform: rotate(180deg);
  }
  
  .strategy-tips {
    margin-top: var(--space-md);
  }
  
  .tip-item {
    cursor: default;
    background: rgba(102, 126, 234, 0.05);
    border: 1px solid rgba(102, 126, 234, 0.1);
  }
  
  .tip-item:active {
    transform: none;
  }
  
  .tip-item .icon {
    font-size: 1.1em;
    flex-shrink: 0;
  }
  
  .tip-item .text {
    font-size: var(--font-sm);
    color: #4b5563;
    font-weight: 500;
  }
  
  .success-icon {
    font-size: 4rem;
    margin-bottom: var(--space-md);
  }
  
  .submitted-preview {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(74, 222, 128, 0.08));
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    margin-bottom: var(--space-xl);
  }
  
  .preview-label {
    font-size: var(--font-sm);
    font-weight: 600;
    color: #666;
    margin-bottom: var(--space-sm);
  }
  
  .preview-text {
    font-size: var(--font-lg);
    font-weight: 600;
    color: #333;
    font-style: italic;
    word-break: break-word;
  }
  
  .waiting-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
  }
  
  .waiting-dots {
    display: flex;
    gap: var(--space-sm);
  }
  
  .waiting-dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-gradient-start);
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
    font-size: var(--font-base);
    color: #666;
    margin: 0;
  }
  
  @media (min-width: 480px) {
    .button-group {
      grid-template-columns: 3fr 1fr;
    }
    
    .strategy-tips {
      margin-top: var(--space-lg);
    }
  }
  
  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    .question-card {
      background: linear-gradient(135deg, rgba(124, 143, 245, 0.08), rgba(150, 116, 194, 0.08));
      border-color: rgba(124, 143, 245, 0.2);
    }
    
    .question-text {
      color: var(--text-primary);
    }
    
    .strategy-toggle {
      background: var(--bg-input);
      border-color: var(--border-color);
      color: var(--text-secondary);
    }
    
    .strategy-toggle:active {
      background: var(--bg-hover);
    }
    
    .tip-item {
      background: rgba(124, 143, 245, 0.05);
      border-color: rgba(124, 143, 245, 0.1);
    }
    
    .tip-item .text {
      color: var(--text-secondary);
    }
    
    .submitted-preview {
      background: linear-gradient(135deg, rgba(52, 208, 88, 0.08), rgba(86, 224, 112, 0.08));
      border-color: rgba(52, 208, 88, 0.2);
    }
    
    .preview-label {
      color: var(--text-secondary);
    }
    
    .preview-text {
      color: var(--text-primary);
    }
    
    .waiting-text {
      color: var(--text-secondary);
    }
  }
</style>