<script>
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

<div class="question-container">
  <div class="question-card">
    <div class="reading-header">
      <div class="reading-icon">👁️</div>
      <h2 class="reading-title">Read Carefully</h2>
      <p class="reading-subtitle">Study this question - you'll need to create a convincing lie!</p>
    </div>
    
    <div class="question-content">
      <div class="category-badge">
        <span class="category-emoji">{getEmoji(currentQuestion.category)}</span>
        <span class="category-name">{currentQuestion.category}</span>
      </div>
      
      <div class="question-text-container">
        <h3 class="question-text">{currentQuestion.question}</h3>
      </div>
    </div>
    
    <div class="reading-indicator">
      <div class="reading-progress">
        <div class="progress-bar"></div>
      </div>
      <p class="reading-hint">Think about what would make a believable fake answer...</p>
    </div>
  </div>
</div>

<style>
  .question-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeIn 0.6s ease;
  }
  
  .question-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
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
  
  .reading-header {
    margin-bottom: 2rem;
  }
  
  .reading-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: blink 3s infinite;
  }
  
  @keyframes blink {
    0%, 90%, 100% { opacity: 1; }
    95% { opacity: 0.3; }
  }
  
  .reading-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .reading-subtitle {
    font-size: 1rem;
    color: #666;
    margin: 0;
  }
  
  .question-content {
    margin-bottom: 2rem;
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
    font-size: 1rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  .category-emoji {
    font-size: 1.3rem;
  }
  
  .question-text-container {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 2rem;
    margin: 1rem 0;
  }
  
  .question-text {
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
    margin: 0;
    animation: highlight 0.8s ease;
  }
  
  @keyframes highlight {
    0% {
      background: linear-gradient(90deg, transparent, transparent);
    }
    50% {
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    }
    100% {
      background: linear-gradient(90deg, transparent, transparent);
    }
  }
  
  .reading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .reading-progress {
    width: 100%;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    width: 0%;
    animation: reading-progress 10s linear forwards;
  }
  
  @keyframes reading-progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  
  .reading-hint {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
    margin: 0;
    animation: fadeInUp 1s ease 0.5s both;
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
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 480px) {
    .question-container {
      padding: 0.5rem;
    }
    
    .question-card {
      padding: 1.5rem;
    }
    
    .reading-title {
      font-size: 1.6rem;
    }
    
    .reading-subtitle {
      font-size: 0.9rem;
    }
    
    .question-text-container {
      padding: 1.5rem;
    }
    
    .question-text {
      font-size: 1.2rem;
    }
    
    .category-badge {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
    }
    
    .reading-hint {
      font-size: 0.8rem;
    }
  }
</style>