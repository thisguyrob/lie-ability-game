<script>
  import '../../player-mobile.css';
  
  export let currentQuestion;
  export let subStepInfo;
  export let onSelect;
  export let onLike;
  
  let selectedOptionId = null;
  let likedOptions = new Set();
  let likedTruth = false;
  let showLikes = false;
  
  $: hasSelected = subStepInfo?.hasSelectedOption || selectedOptionId !== null;
  $: options = currentQuestion?.options || [];
  
  function handleLikeOption(option) {
    if (likedOptions.has(option.id)) return;
    if (!option.submittedBy || option.submittedBy.length === 0) return; // Can't like the truth
    
    likedOptions.add(option.id);
    likedOptions = likedOptions; // Trigger reactivity
    
    // Like all authors of this lie
    option.submittedBy.forEach(authorId => {
      onLike(authorId);
    });
  }

  function handleLikeTruth(option) {
    if (likedTruth) return;
    likedTruth = true;
    // For truth, we don't call onLike since there's no player to like
    // This is just a UI acknowledgment that they liked the truth
  }
  
  function handleOptionSelect(optionId) {
    if (hasSelected) return;
    
    selectedOptionId = optionId;
    onSelect(optionId);
    
    // Auto-show likes after selection
    setTimeout(() => {
      showLikes = true;
    }, 500);
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
    <div class="question-card">
      <div class="category-badge">
        <span class="category-icon">{getEmoji(currentQuestion.category)}</span>
        <span class="category-name">{currentQuestion.category}</span>
      </div>
      <h2 class="question-text">{currentQuestion.question}</h2>
    </div>
    
    {#if !hasSelected}
      <h3 class="section-title text-center">Which is the truth?</h3>
    {/if}
    
    <div class="options-container">
      {#each options as option, index}
        <button
          class="option-card"
          class:selected={hasSelected && option.id === selectedOptionId}
          class:disabled={hasSelected && option.id !== selectedOptionId}
          on:click={() => handleOptionSelect(option.id)}
          disabled={hasSelected}
          style="animation-delay: {index * 0.1}s"
        >
          <span class="option-text">{option.text}</span>
          {#if hasSelected && option.id === selectedOptionId}
            <span class="check-mark">✓</span>
          {/if}
        </button>
      {/each}
    </div>
    
    {#if hasSelected && showLikes}
      <div class="likes-section animate-slideUp">
        <h3 class="likes-title">Give kudos to creative answers</h3>
        <div class="likes-grid">
          {#each options as option}
            <div class="like-item"
                 class:is-selected={option.id === selectedOptionId}>
              <div class="like-text">{option.text}</div>
              <button
                class="like-btn"
                class:liked={option.submittedBy && option.submittedBy.length > 0 ? likedOptions.has(option.id) : likedTruth}
                disabled={option.submittedBy && option.submittedBy.length > 0 ? likedOptions.has(option.id) : likedTruth}
                on:click={() => option.submittedBy && option.submittedBy.length > 0 ? handleLikeOption(option) : handleLikeTruth(option)}
              >
                {#if (option.submittedBy && option.submittedBy.length > 0 ? likedOptions.has(option.id) : likedTruth)}
                  ❤️
                {:else}
                  🤍
                {/if}
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    {#if hasSelected}
      <div class="waiting-indicator">
        <div class="waiting-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="waiting-text">Waiting for others...</p>
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
  
  .section-title {
    font-size: var(--font-base);
    font-weight: 600;
    color: #666;
    margin: 0 0 var(--space-md) 0;
  }
  
  .options-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
  }
  
  .option-card {
    width: 100%;
    min-height: var(--touch-target-large);
    padding: var(--space-md) var(--space-lg);
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    border-radius: var(--radius-lg);
    font-size: var(--font-base);
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: all var(--transition-base);
    position: relative;
    text-align: left;
    line-height: 1.4;
    animation: slideUp var(--transition-base) ease both;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .option-card:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  .option-card.selected {
    background: linear-gradient(135deg, var(--success-light), var(--success-color));
    border-color: var(--success-color);
    color: white;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  }
  
  .option-card.disabled:not(.selected) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .option-text {
    display: block;
    padding-right: var(--space-xl);
  }
  
  .check-mark {
    position: absolute;
    right: var(--space-lg);
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    animation: checkPop var(--transition-base) ease;
  }
  
  @keyframes checkPop {
    0% {
      transform: translateY(-50%) scale(0);
    }
    50% {
      transform: translateY(-50%) scale(1.2);
    }
    100% {
      transform: translateY(-50%) scale(1);
    }
  }
  
  .likes-section {
    margin-top: var(--space-xl);
    padding: var(--space-lg);
    background: rgba(102, 126, 234, 0.05);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(102, 126, 234, 0.1);
  }
  
  .likes-title {
    font-size: var(--font-base);
    font-weight: 600;
    color: var(--primary-gradient-start);
    margin: 0 0 var(--space-md) 0;
    text-align: center;
  }
  
  .likes-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .like-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) var(--space-md);
    background: rgba(255, 255, 255, 0.7);
    border-radius: var(--radius-md);
    border: 1px solid rgba(102, 126, 234, 0.1);
    gap: var(--space-md);
  }
  
  
  .like-text {
    flex: 1;
    font-size: var(--font-sm);
    color: #4b5563;
    font-style: italic;
    line-height: 1.3;
  }
  
  .like-btn {
    width: var(--touch-target-min);
    height: var(--touch-target-min);
    border-radius: var(--radius-full);
    border: 2px solid #e2e8f0;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }
  
  .like-btn:active:not(:disabled) {
    transform: scale(0.9);
  }
  
  .like-btn.liked {
    background: #fecaca;
    border-color: #ef4444;
    animation: heartPop var(--transition-base) ease;
  }
  
  @keyframes heartPop {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  .waiting-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    margin-top: var(--space-xl);
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
    .option-card {
      padding: var(--space-lg) var(--space-xl);
    }
    
    .likes-grid {
      gap: var(--space-md);
    }
    
    .like-item {
      padding: var(--space-md);
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
    
    .section-title {
      color: var(--text-secondary);
    }
    
    .option-card {
      background: var(--bg-input);
      border-color: var(--border-color);
      color: var(--text-primary);
    }
    
    .option-card:active:not(:disabled) {
      background: var(--bg-hover);
    }
    
    .option-card.selected {
      background: linear-gradient(135deg, var(--success-color), var(--success-light));
      border-color: var(--success-color);
    }
    
    .likes-section {
      background: rgba(124, 143, 245, 0.05);
      border-color: rgba(124, 143, 245, 0.1);
    }
    
    .likes-title {
      color: var(--primary-gradient-start);
    }
    
    .like-item {
      background: var(--bg-input);
      border-color: var(--border-color);
    }
    
    
    .like-text {
      color: var(--text-secondary);
    }
    
    .like-btn {
      background: var(--bg-hover);
      border-color: var(--border-color);
    }
    
    .like-btn.liked {
      background: rgba(255, 107, 107, 0.2);
      border-color: rgba(255, 107, 107, 0.4);
    }
    
    .waiting-text {
      color: var(--text-secondary);
    }
  }
</style>