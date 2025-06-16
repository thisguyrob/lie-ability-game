<script>
  export let currentQuestion;
  export let subStepInfo;
  export let onSelect;
  
  let selectedOptionId = null;
  
  $: hasSelected = subStepInfo?.hasSelectedOption || selectedOptionId !== null;
  $: options = currentQuestion?.options || [];
  
  function handleOptionSelect(optionId) {
    if (hasSelected) return;
    
    selectedOptionId = optionId;
    onSelect(optionId);
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

<div class="voting-container">
  <div class="voting-card">
    {#if !hasSelected}
      <div class="voting-header">
        <div class="voting-icon">🗳️</div>
        <h2 class="voting-title">Vote for the Truth!</h2>
        <p class="voting-subtitle">Which option is the real answer? Choose wisely!</p>
      </div>
      
      <div class="question-reminder">
        <div class="reminder-badge">
          <span class="reminder-emoji">{getEmoji(currentQuestion.category)}</span>
          <span class="reminder-category">{currentQuestion.category}</span>
        </div>
        <div class="reminder-question">{currentQuestion.question}</div>
      </div>
      
      <div class="options-section">
        <h3 class="options-title">Select the Real Answer</h3>
        <div class="options-list">
          {#each options as option, index}
            <button
              class="option-button"
              style="animation-delay: {index * 0.1}s"
              on:click={() => handleOptionSelect(option.id)}
              disabled={hasSelected}
            >
              <div class="option-letter">{String.fromCharCode(65 + index)}</div>
              <div class="option-text">{option.text}</div>
              <div class="option-arrow">→</div>
            </button>
          {/each}
        </div>
      </div>
      
      <div class="voting-tips">
        <h4 class="tips-title">Voting Strategy</h4>
        <div class="tips-grid">
          <div class="tip">
            <span class="tip-icon">🎯</span>
            <span class="tip-text">Trust your gut feeling</span>
          </div>
          <div class="tip">
            <span class="tip-icon">🧐</span>
            <span class="tip-text">Look for the most believable option</span>
          </div>
          <div class="tip">
            <span class="tip-icon">🤔</span>
            <span class="tip-text">Avoid options that seem too clever</span>
          </div>
        </div>
      </div>
    {:else}
      <div class="voted-state">
        <div class="voted-icon">✅</div>
        <h2 class="voted-title">Vote Cast!</h2>
        <p class="voted-subtitle">
          Your vote is locked in. Let's see if you picked the truth!
        </p>
        
        {#if selectedOptionId}
          <div class="vote-preview">
            <div class="preview-label">You voted for:</div>
            <div class="preview-option">
              {#each options as option, index}
                {#if option.id === selectedOptionId}
                  <div class="selected-option">
                    <span class="selected-letter">{String.fromCharCode(65 + index)}</span>
                    <span class="selected-text">"{option.text}"</span>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
        
        <div class="waiting-indicator">
          <div class="waiting-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p class="waiting-text">Waiting for other players to vote...</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .voting-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeIn 0.6s ease;
  }
  
  .voting-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  .voting-header {
    margin-bottom: 2rem;
  }
  
  .voting-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: sway 2s ease-in-out infinite alternate;
  }
  
  @keyframes sway {
    0% { transform: rotate(-10deg); }
    100% { transform: rotate(10deg); }
  }
  
  .voting-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .voting-subtitle {
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
  
  .options-section {
    margin-bottom: 2rem;
  }
  
  .options-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1.5rem 0;
  }
  
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .option-button {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: slideInUp 0.5s ease both;
    text-align: left;
  }
  
  .option-button:hover:not(:disabled) {
    transform: translateY(-3px);
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  .option-button:active:not(:disabled) {
    transform: translateY(-1px);
  }
  
  .option-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .option-letter {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
  
  .option-button:hover:not(:disabled) .option-letter {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  .option-text {
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    line-height: 1.4;
    transition: color 0.3s ease;
  }
  
  .option-button:hover:not(:disabled) .option-text {
    color: white;
  }
  
  .option-arrow {
    font-size: 1.2rem;
    color: #667eea;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
    flex-shrink: 0;
  }
  
  .option-button:hover:not(:disabled) .option-arrow {
    opacity: 1;
    transform: translateX(0);
    color: white;
  }
  
  .voting-tips {
    text-align: left;
  }
  
  .tips-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
    text-align: center;
  }
  
  .tips-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
    font-size: 1rem;
    flex-shrink: 0;
  }
  
  .tip-text {
    font-size: 0.85rem;
    color: #374151;
    font-weight: 500;
  }
  
  .voted-state {
    text-align: center;
  }
  
  .voted-icon {
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
  
  .voted-title {
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
    margin: 0 0 1rem 0;
  }
  
  .voted-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0 0 2rem 0;
  }
  
  .vote-preview {
    background: linear-gradient(135deg, #667eea20, #764ba220);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .preview-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
    margin-bottom: 1rem;
  }
  
  .selected-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }
  
  .selected-letter {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
  }
  
  .selected-text {
    font-size: 1.1rem;
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
    .voting-container {
      padding: 0.5rem;
    }
    
    .voting-card {
      padding: 1.5rem;
    }
    
    .voting-title, .voted-title {
      font-size: 1.6rem;
    }
    
    .option-button {
      padding: 1rem;
      gap: 0.75rem;
    }
    
    .option-letter {
      width: 36px;
      height: 36px;
      font-size: 1rem;
    }
    
    .option-text {
      font-size: 0.9rem;
    }
    
    .tips-grid {
      gap: 0.4rem;
    }
    
    .tip {
      padding: 0.5rem;
      gap: 0.5rem;
    }
    
    .tip-text {
      font-size: 0.8rem;
    }
    
    .selected-text {
      font-size: 1rem;
    }
  }
</style>