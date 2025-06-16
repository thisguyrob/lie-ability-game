<script>
  export let gameState;
  
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
  
  // Format timer display
  function formatTime(seconds) {
    return seconds?.toString().padStart(2, '0') || '--';
  }
  
  // Computed values
  $: currentQuestion = gameState.currentQuestion;
  $: timer = gameState.timer;
  
  // Reading tips based on question category
  const readingTips = {
    'History': 'Think about what historical figures might have done or used.',
    'Animals': 'Consider animal behaviors, group names, or characteristics.',
    'Food': 'Think about ingredients, cooking methods, or food origins.',
    'Science': 'Consider scientific facts, discoveries, or natural phenomena.',
    'Sports': 'Think about rules, equipment, or famous moments in sports.',
    'Geography': 'Consider countries, capitals, landmarks, or geographical features.',
    'Music': 'Think about artists, songs, instruments, or musical history.',
    'Movies': 'Consider plots, actors, directors, or famous movie quotes.',
    'TV': 'Think about characters, shows, or television history.',
    'Games': 'Consider rules, history, or famous games and players.',
    'Literature': 'Think about authors, books, characters, or literary devices.',
    'Technology': 'Consider inventions, innovations, or tech history.',
    'Art': 'Think about artists, techniques, art movements, or famous works.',
    'Fashion': 'Consider designers, trends, or fashion history.',
    'Language': 'Think about words, grammar, or linguistic facts.',
    'Space': 'Consider planets, stars, space exploration, or astronomy.',
    'default': 'Think carefully about what could fit in the blank.'
  };
  
  function getReadingTip(category) {
    return readingTips[category] || readingTips.default;
  }
</script>

<div class="question-reading-container">
  <!-- Header -->
  <div class="reading-header fade-in">
    <h1>📖 Read Carefully</h1>
    <p>Study the question and think about your answer strategy.</p>
    
    {#if timer}
      <div class="timer-display" class:urgent={timer.remaining <= 3}>
        <div class="timer-circle">
          <div class="timer-number">{formatTime(timer.remaining)}</div>
        </div>
        <div class="timer-label">seconds to read</div>
      </div>
    {/if}
  </div>
  
  <!-- Question Display -->
  {#if currentQuestion}
    <div class="question-section scale-in">
      <div class="question-card">
        <!-- Category Header -->
        <div class="category-header">
          <div class="category-badge">
            <span class="category-emoji">{getCategoryEmoji(currentQuestion.category)}</span>
            <span class="category-name">{currentQuestion.category}</span>
          </div>
        </div>
        
        <!-- Question Text -->
        <div class="question-content">
          <h2 class="question-text">
            {currentQuestion.question}
          </h2>
        </div>
        
        <!-- Reading Tip -->
        <div class="question-tip">
          <div class="tip-icon">💡</div>
          <p class="tip-text">
            {getReadingTip(currentQuestion.category)}
          </p>
        </div>
      </div>
    </div>
  {:else}
    <div class="loading-section">
      <div class="loading-card glass">
        <div class="loading-spinner">🔄</div>
        <h3>Loading question...</h3>
        <p>Preparing the next challenge for you.</p>
      </div>
    </div>
  {/if}
  
  <!-- Strategy Section -->
  <div class="strategy-section slide-up">
    <div class="strategy-card glass">
      <h3>🎯 Get Ready</h3>
      <div class="strategy-tips">
        <div class="tip-item">
          <span class="tip-emoji">🎭</span>
          <div class="tip-content">
            <strong>Think of lies:</strong>
            <span>What fake answers might sound believable?</span>
          </div>
        </div>
        
        <div class="tip-item">
          <span class="tip-emoji">🕵️</span>
          <div class="tip-content">
            <strong>Consider the truth:</strong>
            <span>What do you actually think the answer is?</span>
          </div>
        </div>
        
        <div class="tip-item">
          <span class="tip-emoji">🎲</span>
          <div class="tip-content">
            <strong>Be creative:</strong>
            <span>Mix real facts with believable fiction.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Progress Indicator -->
  <div class="progress-section">
    <div class="progress-content">
      <div class="progress-step active">
        <span class="step-number">1</span>
        <span class="step-label">Read Question</span>
      </div>
      <div class="progress-arrow">→</div>
      <div class="progress-step">
        <span class="step-number">2</span>
        <span class="step-label">Submit Lie</span>
      </div>
      <div class="progress-arrow">→</div>
      <div class="progress-step">
        <span class="step-number">3</span>
        <span class="step-label">Guess Truth</span>
      </div>
    </div>
  </div>
  
  <!-- Game Context -->
  <div class="game-context">
    <div class="context-items">
      <div class="context-item">
        <span class="context-emoji">🎯</span>
        <span>Round {gameState.round || 1} • Question {gameState.question || 1}</span>
      </div>
      <div class="context-item">
        <span class="context-emoji">🏆</span>
        <span>
          {gameState.round === 1 ? '500' : gameState.round === 2 ? '1000' : '1500'} points per player fooled
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .question-reading-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--space-4);
    gap: var(--space-6);
  }
  
  .reading-header {
    text-align: center;
  }
  
  .reading-header h1 {
    color: var(--white);
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-3);
    font-weight: 900;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .reading-header p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
  }
  
  .timer-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
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
  
  .question-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .question-card {
    background: var(--white);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    box-shadow: var(--shadow-2xl);
    max-width: 600px;
    width: 100%;
    text-align: center;
  }
  
  .category-header {
    margin-bottom: var(--space-5);
  }
  
  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--gray-100);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    border: 2px solid var(--gray-200);
  }
  
  .category-emoji {
    font-size: var(--font-size-xl);
  }
  
  .category-name {
    color: var(--gray-700);
    font-weight: 700;
    font-size: var(--font-size-lg);
  }
  
  .question-content {
    margin-bottom: var(--space-5);
  }
  
  .question-text {
    color: var(--gray-800);
    font-size: var(--font-size-3xl);
    font-weight: 800;
    line-height: 1.3;
    margin: 0;
  }
  
  .question-tip {
    background: var(--gray-50);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    border: 1px solid var(--gray-200);
  }
  
  .tip-icon {
    font-size: var(--font-size-xl);
    flex-shrink: 0;
  }
  
  .tip-text {
    color: var(--gray-600);
    font-size: var(--font-size-base);
    line-height: 1.5;
    margin: 0;
    font-style: italic;
  }
  
  .loading-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loading-card {
    padding: var(--space-8) var(--space-6);
    border-radius: var(--radius-2xl);
    text-align: center;
    max-width: 400px;
    width: 100%;
  }
  
  .loading-spinner {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--space-4);
    animation: spin 1s linear infinite;
  }
  
  .loading-card h3 {
    color: var(--white);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-2);
    font-weight: 700;
  }
  
  .loading-card p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
  }
  
  .strategy-section {
    margin-top: auto;
  }
  
  .strategy-card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
  }
  
  .strategy-card h3 {
    color: var(--white);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
    font-weight: 700;
    text-align: center;
  }
  
  .strategy-tips {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .tip-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }
  
  .tip-emoji {
    font-size: var(--font-size-lg);
    flex-shrink: 0;
  }
  
  .tip-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
  
  .tip-content strong {
    color: var(--white);
    font-size: var(--font-size-base);
    font-weight: 700;
  }
  
  .tip-content span {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
    line-height: 1.4;
  }
  
  .progress-section {
    margin-top: var(--space-4);
  }
  
  .progress-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }
  
  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }
  
  .step-number {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-weight: 700;
    font-size: var(--font-size-sm);
    transition: all var(--transition);
  }
  
  .progress-step.active .step-number {
    background: var(--white);
    color: var(--primary);
    border-color: var(--white);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  
  .step-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-align: center;
  }
  
  .progress-step.active .step-label {
    color: var(--white);
  }
  
  .progress-arrow {
    color: rgba(255, 255, 255, 0.5);
    font-size: var(--font-size-lg);
    font-weight: 700;
  }
  
  .game-context {
    margin-top: var(--space-4);
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
    .question-reading-container {
      padding: var(--space-3);
      gap: var(--space-4);
    }
    
    .reading-header h1 {
      font-size: var(--font-size-2xl);
    }
    
    .reading-header p {
      font-size: var(--font-size-lg);
    }
    
    .question-text {
      font-size: var(--font-size-xl);
    }
    
    .timer-circle {
      width: 60px;
      height: 60px;
    }
    
    .timer-number {
      font-size: var(--font-size-lg);
    }
    
    .question-card {
      padding: var(--space-4);
    }
    
    .strategy-tips {
      gap: var(--space-4);
    }
    
    .tip-item {
      flex-direction: column;
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      padding: var(--space-3);
      border-radius: var(--radius-lg);
    }
    
    .progress-content {
      gap: var(--space-1);
    }
    
    .progress-arrow {
      transform: rotate(90deg);
    }
    
    .context-items {
      flex-direction: column;
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .question-text {
      font-size: var(--font-size-lg);
    }
    
    .tip-text {
      font-size: var(--font-size-sm);
    }
    
    .strategy-card {
      padding: var(--space-4);
    }
  }
  
  /* Reading state animation */
  .question-card {
    animation: gentle-glow 3s ease-in-out infinite;
  }
  
  @keyframes gentle-glow {
    0%, 100% {
      box-shadow: var(--shadow-2xl);
    }
    50% {
      box-shadow: var(--shadow-2xl), 0 0 30px rgba(102, 126, 234, 0.2);
    }
  }
</style>