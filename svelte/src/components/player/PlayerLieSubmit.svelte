<script>
  export let currentQuestion;
  export let subStepInfo;
  export let onSubmit;
  export let onAuto;
  
  let lieText = '';
  let isSubmitting = false;
  
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
    if (event.key === 'Enter' && canSubmit) {
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

<div class="lie-container">
  <div class="lie-card">
    {#if !hasSubmitted}
      <div class="lie-header">
        <div class="lie-icon">🤥</div>
        <h2 class="lie-title">Create Your Lie</h2>
        <p class="lie-subtitle">Make it believable enough to fool other players!</p>
      </div>
      
      <div class="question-reminder">
        <div class="reminder-badge">
          <span class="reminder-emoji">{getEmoji(currentQuestion.category)}</span>
          <span class="reminder-category">{currentQuestion.category}</span>
        </div>
        <div class="reminder-question">{currentQuestion.question}</div>
      </div>
      
      <div class="lie-input-section">
        <label for="lieInput" class="input-label">Your Fake Answer</label>
        <textarea
          id="lieInput"
          bind:value={lieText}
          placeholder="Enter a convincing lie..."
          maxlength="100"
          rows="3"
          disabled={hasSubmitted || isSubmitting}
          on:keypress={handleKeyPress}
          class="lie-input"
          class:submitting={isSubmitting}
          autofocus
        ></textarea>
        
        <div class="input-footer">
          <div class="character-count" class:near-limit={lieText.length > 80}>
            {lieText.length}/100
          </div>
          <div class="input-hints">
            <div class="hint">💡 Make it sound plausible</div>
            <div class="hint">🎭 Think like the real answer</div>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button
          class="submit-button"
          class:disabled={!canSubmit}
          disabled={!canSubmit}
          on:click={handleSubmit}
        >
          {#if isSubmitting}
            <div class="button-spinner"></div>
            Submitting...
          {:else}
            <span class="button-icon">🚀</span>
            Submit Lie
          {/if}
        </button>
        
        <button
          class="auto-button"
          disabled={hasSubmitted || isSubmitting}
          on:click={handleAutoLie}
        >
          <span class="button-icon">🎲</span>
          Lie for Me
        </button>
      </div>
      
      <div class="strategy-tips">
        <h4 class="tips-title">Strategy Tips</h4>
        <div class="tips-list">
          <div class="tip">
            <span class="tip-icon">🎯</span>
            <span class="tip-text">Base it on something real but wrong</span>
          </div>
          <div class="tip">
            <span class="tip-icon">🧠</span>
            <span class="tip-text">Think about common knowledge</span>
          </div>
          <div class="tip">
            <span class="tip-icon">⚡</span>
            <span class="tip-text">Make it feel "right" but isn't</span>
          </div>
        </div>
      </div>
    {:else}
      <div class="submitted-state">
        <div class="submitted-icon">✅</div>
        <h2 class="submitted-title">Lie Submitted!</h2>
        <p class="submitted-subtitle">
          Your deception is in the mix. Now we wait to see who falls for it...
        </p>
        
        <div class="submitted-preview">
          <div class="preview-label">Your lie:</div>
          <div class="preview-text">"{lieText || 'Auto-generated lie'}"</div>
        </div>
        
        <div class="waiting-indicator">
          <div class="waiting-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p class="waiting-text">Waiting for other players...</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .lie-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeIn 0.6s ease;
  }
  
  .lie-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  .lie-header {
    margin-bottom: 2rem;
  }
  
  .lie-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: wink 3s infinite;
  }
  
  @keyframes wink {
    0%, 90%, 100% { transform: scaleX(1); }
    95% { transform: scaleX(0.1); }
  }
  
  .lie-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .lie-subtitle {
    font-size: 1rem;
    color: #666;
    margin: 0;
  }
  
  .question-reminder {
    background: linear-gradient(135deg, #667eea20, #764ba220);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .reminder-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .reminder-emoji {
    font-size: 1.1rem;
  }
  
  .reminder-question {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    line-height: 1.3;
  }
  
  .lie-input-section {
    margin-bottom: 2rem;
    text-align: left;
  }
  
  .input-label {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.75rem;
    text-align: center;
  }
  
  .lie-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1.1rem;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
    transition: all 0.3s ease;
    background: white;
    box-sizing: border-box;
  }
  
  .lie-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .lie-input:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }
  
  .lie-input.submitting {
    border-color: #4ade80;
    background: #f0fdf4;
  }
  
  .input-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 0.75rem;
  }
  
  .character-count {
    font-size: 0.8rem;
    color: #666;
    font-weight: 500;
  }
  
  .character-count.near-limit {
    color: #ef4444;
    font-weight: 700;
  }
  
  .input-hints {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: right;
  }
  
  .hint {
    font-size: 0.8rem;
    color: #666;
    opacity: 0.8;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .submit-button, .auto-button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .submit-button {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  }
  
  .submit-button:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
  }
  
  .submit-button.disabled {
    background: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  
  .auto-button {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  }
  
  .auto-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
  }
  
  .auto-button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  
  .button-icon {
    font-size: 1.1rem;
  }
  
  .button-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .strategy-tips {
    text-align: left;
  }
  
  .tips-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
    text-align: center;
  }
  
  .tips-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .tip {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .tip:hover {
    transform: translateX(5px);
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  }
  
  .tip-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  
  .tip-text {
    font-size: 0.9rem;
    color: #374151;
    font-weight: 500;
  }
  
  .submitted-state {
    text-align: center;
  }
  
  .submitted-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: checkmark 0.8s ease;
  }
  
  @keyframes checkmark {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .submitted-title {
    font-size: 2rem;
    font-weight: 700;
    color: #22c55e;
    margin: 0 0 1rem 0;
  }
  
  .submitted-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0 0 2rem 0;
  }
  
  .submitted-preview {
    background: linear-gradient(135deg, #22c55e20, #4ade8020);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .preview-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
    margin-bottom: 0.75rem;
  }
  
  .preview-text {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    font-style: italic;
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
  
  @media (max-width: 480px) {
    .lie-container {
      padding: 0.5rem;
    }
    
    .lie-card {
      padding: 1.5rem;
    }
    
    .lie-title, .submitted-title {
      font-size: 1.6rem;
    }
    
    .question-reminder {
      padding: 1.25rem;
    }
    
    .reminder-question {
      font-size: 1rem;
    }
    
    .action-buttons {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .input-footer {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .input-hints {
      text-align: left;
    }
    
    .tips-list {
      gap: 0.5rem;
    }
    
    .tip {
      padding: 0.5rem;
      gap: 0.5rem;
    }
    
    .tip-text {
      font-size: 0.8rem;
    }
  }
</style>