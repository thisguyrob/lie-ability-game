<script>
  import '../../player-mobile.css';
  
  export let currentQuestion;
  
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
    <div class="question-header">
      <div class="category-badge">
        <span class="category-icon">{getEmoji(currentQuestion.category)}</span>
        <span class="category-name">{currentQuestion.category}</span>
      </div>
    </div>
    
    <div class="question-body">
      <h1 class="question-text">{currentQuestion.question}</h1>
    </div>
    
    <div class="question-footer">
      <div class="timer-bar">
        <div class="timer-progress"></div>
      </div>
      <p class="hint-text animate-slideUp">Get ready to create a clever lie...</p>
    </div>
  </div>
</div>

<style>
  .card-mobile {
    position: relative;
    overflow: hidden;
    padding-top: 4px;
  }
  
  .card-mobile::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-gradient-start), var(--primary-gradient-end));
  }
  
  .question-header {
    text-align: center;
    margin-top: var(--space-2xl);
    margin-bottom: var(--space-2xl);
  }
  
  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end));
    color: white;
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-full);
    font-weight: 600;
    font-size: var(--font-base);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    animation: popIn var(--transition-base) ease;
  }
  
  @keyframes popIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .category-icon {
    font-size: 1.3em;
  }
  
  .question-body {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    margin-bottom: var(--space-2xl);
    text-align: center;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .question-text {
    font-size: var(--font-xl);
    font-weight: 600;
    color: #1f2937;
    line-height: 1.5;
    margin: 0;
    word-break: break-word;
    animation: fadeUpIn var(--transition-slow) ease 0.3s both;
  }
  
  @keyframes fadeUpIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .question-footer {
    text-align: center;
  }
  
  .timer-bar {
    width: 100%;
    height: 6px;
    background: #e2e8f0;
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: var(--space-md);
  }
  
  .timer-progress {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-gradient-start), var(--primary-gradient-end));
    width: 0%;
    animation: timerProgress 10s linear forwards;
    transform-origin: left;
  }
  
  @keyframes timerProgress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  
  .hint-text {
    font-size: var(--font-base);
    color: #6b7280;
    font-style: italic;
    margin: 0;
    animation-delay: 1s;
  }
  
  @media (min-width: 480px) {
    .question-body {
      padding: var(--space-2xl);
      min-height: 150px;
    }
    
    .question-text {
      font-size: var(--font-2xl);
    }
  }
  
  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    .card-mobile::before {
      background: linear-gradient(90deg, var(--primary-gradient-start), var(--primary-gradient-end));
    }
    
    .question-body {
      background: var(--bg-input);
      border-color: var(--border-color);
    }
    
    .question-text {
      color: var(--text-primary);
    }
    
    .timer-bar {
      background: var(--border-color);
    }
    
    .timer-progress {
      background: linear-gradient(90deg, var(--primary-gradient-start), var(--primary-gradient-end));
    }
    
    .hint-text {
      color: var(--text-secondary);
    }
  }
</style>