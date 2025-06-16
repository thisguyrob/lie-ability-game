<script>
  export let currentQuestion;
  export let state;
  
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

<div class="question-container">
  
  <div class="question-card">
    <div class="category-badge">
      <span class="category-emoji">{getEmoji(currentQuestion.category)}</span>
      <span class="category-name">{currentQuestion.category}</span>
    </div>
    
    <div class="question-content">
      <h3 class="question-text">{currentQuestion.question}</h3>
    </div>
    
    {#if state === 'question_reading'}
      <div class="reading-indicator">
        <div class="reading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Everyone read carefully...</p>
      </div>
    {:else if state === 'lie_submission'}
      <div class="activity-indicator">
        <div class="activity-icon">✍️</div>
        <p>Players are writing their lies...</p>
      </div>
    {:else if state === 'option_selection' && currentQuestion.options}
      <div class="options-section">
        <h4 class="options-title">Vote for the Real Answer</h4>
        <div class="options-grid">
          {#each currentQuestion.options as option, index}
            <div class="option-card" style="animation-delay: {index * 0.1}s">
              <div class="option-letter">{String.fromCharCode(65 + index)}</div>
              <div class="option-text">{option.text}</div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .question-container {
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    animation: fadeIn 0.6s ease;
  }
  
  
  .question-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 3rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    width: 100%;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .question-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
  
  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  .category-emoji {
    font-size: 1.4rem;
  }
  
  .question-content {
    margin: 2rem 0;
  }
  
  .question-text {
    font-size: 2.5rem;
    font-weight: 600;
    color: #333;
    line-height: 1.3;
    margin: 0;
  }
  
  .reading-indicator, .activity-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    color: #666;
  }
  
  .reading-dots {
    display: flex;
    gap: 0.5rem;
  }
  
  .reading-dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #667eea;
    animation: dot-bounce 1.4s infinite ease-in-out both;
  }
  
  .reading-dots span:nth-child(1) { animation-delay: -0.32s; }
  .reading-dots span:nth-child(2) { animation-delay: -0.16s; }
  
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
  
  .activity-icon {
    font-size: 2rem;
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  .reading-indicator p, .activity-indicator p {
    font-size: 1.2rem;
    font-style: italic;
    margin: 0;
  }
  
  .options-section {
    margin-top: 3rem;
    width: 100%;
  }
  
  .options-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 2rem 0;
  }
  
  .options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .option-card {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    animation: slideInUp 0.5s ease both;
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
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .option-text {
    font-size: 1.1rem;
    font-weight: 500;
    color: #333;
    text-align: left;
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
  
  @media (max-width: 768px) {
    .question-container {
      gap: 1.5rem;
    }
    
    .question-card {
      padding: 2rem 1.5rem;
    }
    
    .question-text {
      font-size: 2rem;
    }

    .category-badge {
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
    }
    
    .options-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .option-card {
      padding: 1.25rem;
    }
    
    .options-title {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .question-card {
      padding: 1.5rem 1rem;
    }

    .question-text {
      font-size: 1.8rem;
    }

    .category-badge {
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
    }
    
    .category-emoji {
      font-size: 1.2rem;
    }
  }
</style>