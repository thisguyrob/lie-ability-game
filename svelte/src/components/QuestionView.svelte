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
  
  // Helper function to get category emoji
  function getCategoryEmoji(category) {
    return categoryEmojis[category] || '❓';
  }
  
  // Get current player information
  $: connectedPlayers = gameState.players?.filter(p => p.connected) || [];
  $: currentSelector = gameState.currentSelector;
  $: categoriesForSelection = gameState.categoriesForSelection || [];
  $: currentQuestion = gameState.currentQuestion;
  $: options = gameState.options || [];
  $: timer = gameState.timer;
  
  // Helper functions for display
  function getSubStepTitle() {
    switch (gameState.subStep) {
      case 'category_selection':
        return 'Choosing Category';
      case 'question_reading':
        return 'Read the Question';
      case 'lie_submission':
        return 'Creating Lies';
      case 'option_selection':
        return 'Making Choices';
      default:
        return 'Playing';
    }
  }
  
  function getSubStepDescription() {
    switch (gameState.subStep) {
      case 'category_selection':
        return `${currentSelector?.name || 'A player'} is choosing the category for this question.`;
      case 'question_reading':
        return 'Everyone, read the question carefully and think about what the answer could be.';
      case 'lie_submission':
        return 'Players are submitting their most convincing lies. The goal is to fool others!';
      case 'option_selection':
        return 'Time to vote! Players are choosing which answer they think is the real one.';
      default:
        return '';
    }
  }
  
  // Format timer display
  function formatTime(seconds) {
    return seconds?.toString().padStart(2, '0') || '--';
  }
  
  // Get progress for different sub-steps
  function getProgress() {
    switch (gameState.subStep) {
      case 'lie_submission':
        const submitted = gameState.submittedLies || 0;
        const total = connectedPlayers.length;
        return { current: submitted, total, label: 'lies submitted' };
      case 'option_selection':
        const voted = gameState.votedPlayers || 0;
        const totalVoters = connectedPlayers.length;
        return { current: voted, total: totalVoters, label: 'players voted' };
      default:
        return null;
    }
  }
  
  $: progress = getProgress();
</script>

<div class="question-view">
  <div class="container">
    <!-- Header with round info -->
    <div class="round-header slide-up">
      <div class="round-info">
        <div class="round-badge">
          Round {gameState.round || 1}
        </div>
        <div class="question-badge">
          Question {gameState.question || 1}
        </div>
      </div>
      
      {#if timer}
        <div class="timer-display" class:urgent={timer.remaining <= 5}>
          <div class="timer-circle">
            <div class="timer-number">{formatTime(timer.remaining)}</div>
          </div>
          <div class="timer-label">seconds</div>
        </div>
      {/if}
    </div>
    
    <!-- Sub-step header -->
    <div class="substep-header fade-in">
      <h1 class="substep-title">
        {getSubStepTitle()}
      </h1>
      <p class="substep-description">
        {getSubStepDescription()}
      </p>
    </div>
    
    <!-- Content based on sub-step -->
    {#if gameState.subStep === 'category_selection'}
      <div class="category-selection scale-in">
        <div class="selection-card glass">
          <div class="selector-info">
            {#if currentSelector}
              <div class="selector-avatar" style="background: {currentSelector.avatar.color}">
                {currentSelector.avatar.emoji}
              </div>
              <div class="selector-details">
                <h3>{currentSelector.name} is choosing...</h3>
                <p>Pick a category that sounds interesting!</p>
              </div>
            {:else}
              <div class="selector-details">
                <h3>Selecting category...</h3>
                <p>A player is choosing the question category.</p>
              </div>
            {/if}
          </div>
          
          {#if categoriesForSelection.length > 0}
            <div class="categories-display">
              <h4>Available Categories:</h4>
              <div class="categories-grid">
                {#each categoriesForSelection as category, index}
                  <div class="category-option">
                    <div class="category-emoji">
                      {getCategoryEmoji(category)}
                    </div>
                    <div class="category-name">{category}</div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
      
    {:else if gameState.subStep === 'question_reading'}
      <div class="question-display scale-in">
        <div class="question-card">
          {#if currentQuestion}
            <div class="category-header">
              <span class="category-emoji">{getCategoryEmoji(currentQuestion.category)}</span>
              <span class="category-name">{currentQuestion.category}</span>
            </div>
            
            <div class="question-content">
              <h2 class="question-text">
                {currentQuestion.question}
              </h2>
            </div>
          {:else}
            <div class="question-loading">
              <div class="loading-spinner">🔄</div>
              <h3>Loading question...</h3>
            </div>
          {/if}
        </div>
      </div>
      
    {:else if gameState.subStep === 'lie_submission'}
      <div class="submission-status scale-in">
        <div class="status-card glass">
          <div class="status-icon">✍️</div>
          <h2>Players are creating their lies...</h2>
          <p>The more convincing, the better! Try to fool everyone else.</p>
          
          {#if progress}
            <div class="progress-display">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  style="width: {(progress.current / progress.total) * 100}%"
                ></div>
              </div>
              <div class="progress-text">
                {progress.current} of {progress.total} {progress.label}
              </div>
            </div>
          {/if}
          
          {#if currentQuestion}
            <div class="question-reminder">
              <div class="reminder-header">
                <span class="category-emoji">{getCategoryEmoji(currentQuestion.category)}</span>
                {currentQuestion.category}
              </div>
              <div class="reminder-text">
                {currentQuestion.question}
              </div>
            </div>
          {/if}
        </div>
      </div>
      
    {:else if gameState.subStep === 'option_selection'}
      <div class="voting-display scale-in">
        <div class="voting-card">
          <div class="voting-header">
            <h2>🗳️ Time to Vote!</h2>
            <p>Which answer do you think is the real one?</p>
            
            {#if progress}
              <div class="progress-display">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    style="width: {(progress.current / progress.total) * 100}%"
                  ></div>
                </div>
                <div class="progress-text">
                  {progress.current} of {progress.total} {progress.label}
                </div>
              </div>
            {/if}
          </div>
          
          {#if currentQuestion}
            <div class="question-context">
              <div class="context-header">
                <span class="category-emoji">{getCategoryEmoji(currentQuestion.category)}</span>
                {currentQuestion.category}
              </div>
              <div class="context-question">
                {currentQuestion.question}
              </div>
            </div>
          {/if}
          
          {#if options.length > 0}
            <div class="options-display">
              <h3>Choose your answer:</h3>
              <div class="options-grid">
                {#each options as option, index}
                  <div class="option-item">
                    <div class="option-letter">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div class="option-text">
                      {option.text}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
    
    <!-- Players status bar -->
    <div class="players-status slide-up">
      <div class="status-bar glass">
        <div class="status-header">
          <h4>👥 Players ({connectedPlayers.length})</h4>
        </div>
        <div class="players-list">
          {#each connectedPlayers as player}
            <div class="player-status-item">
              <div 
                class="player-mini-avatar"
                style="background: {player.avatar.color}"
              >
                {player.avatar.emoji}
              </div>
              <div class="player-mini-info">
                <div class="player-mini-name">{player.name}</div>
                <div class="player-mini-score">{player.score || 0} pts</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .question-view {
    min-height: 100vh;
    padding: var(--space-4) 0;
  }
  
  .round-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
    gap: var(--space-4);
  }
  
  .round-info {
    display: flex;
    gap: var(--space-3);
  }
  
  .round-badge,
  .question-badge {
    background: rgba(255, 255, 255, 0.2);
    color: var(--white);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    font-weight: 600;
    font-size: var(--font-size-lg);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .timer-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }
  
  .timer-circle {
    width: 80px;
    height: 80px;
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
    font-size: var(--font-size-2xl);
    font-weight: 900;
    color: var(--white);
  }
  
  .timer-label {
    color: var(--white);
    font-size: var(--font-size-sm);
    font-weight: 600;
    opacity: 0.8;
  }
  
  .substep-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  .substep-title {
    font-size: var(--font-size-4xl);
    font-weight: 900;
    color: var(--white);
    margin-bottom: var(--space-3);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .substep-description {
    font-size: var(--font-size-xl);
    color: rgba(255, 255, 255, 0.9);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.5;
  }
  
  .category-selection,
  .question-display,
  .submission-status,
  .voting-display {
    max-width: 800px;
    margin: 0 auto var(--space-8);
  }
  
  .selection-card,
  .status-card,
  .question-card,
  .voting-card {
    padding: var(--space-6);
    border-radius: var(--radius-2xl);
    text-align: center;
  }
  
  .selector-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
  }
  
  .selector-avatar {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-2xl);
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
  
  .selector-details {
    color: var(--white);
    text-align: center;
  }
  
  .selector-details h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-2);
    font-weight: 600;
  }
  
  .selector-details p {
    font-size: var(--font-size-lg);
    opacity: 0.9;
  }
  
  .categories-display h4 {
    color: var(--white);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-4);
    font-weight: 600;
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-3);
  }
  
  .category-option {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    transition: all var(--transition);
  }
  
  .category-emoji {
    font-size: var(--font-size-3xl);
  }
  
  .category-name {
    color: var(--white);
    font-weight: 600;
    font-size: var(--font-size-base);
  }
  
  .question-card {
    background: var(--white);
    color: var(--gray-800);
  }
  
  .category-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
    padding: var(--space-3) var(--space-6);
    background: var(--gray-100);
    border-radius: var(--radius-xl);
    font-size: var(--font-size-lg);
    font-weight: 600;
  }
  
  .category-header .category-emoji {
    font-size: var(--font-size-2xl);
  }
  
  .question-text {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    line-height: 1.3;
    color: var(--gray-800);
  }
  
  .question-loading {
    color: var(--white);
    padding: var(--space-8);
  }
  
  .loading-spinner {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-4);
    animation: spin 1s linear infinite;
  }
  
  .status-icon {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--space-4);
  }
  
  .status-card h2,
  .voting-card h2 {
    color: var(--white);
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-3);
    font-weight: 700;
  }
  
  .status-card p,
  .voting-card p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-6);
  }
  
  .progress-display {
    margin: var(--space-6) 0;
  }
  
  .progress-bar {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: var(--space-2);
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--success) 0%, var(--info) 100%);
    border-radius: var(--radius-full);
    transition: width var(--transition);
  }
  
  .progress-text {
    color: var(--white);
    font-size: var(--font-size-base);
    font-weight: 600;
  }
  
  .question-reminder,
  .question-context {
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    margin-top: var(--space-6);
  }
  
  .reminder-header,
  .context-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    color: var(--white);
    font-weight: 600;
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-2);
  }
  
  .reminder-text,
  .context-question {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-base);
    line-height: 1.4;
  }
  
  .voting-header {
    margin-bottom: var(--space-6);
  }
  
  .options-display h3 {
    color: var(--white);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
    font-weight: 600;
  }
  
  .options-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .option-item {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    transition: all var(--transition);
  }
  
  .option-letter {
    width: 40px;
    height: 40px;
    background: var(--white);
    color: var(--gray-800);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: var(--font-size-lg);
    flex-shrink: 0;
  }
  
  .option-text {
    color: var(--white);
    font-size: var(--font-size-lg);
    font-weight: 500;
    flex: 1;
  }
  
  .players-status {
    margin-top: var(--space-8);
  }
  
  .status-bar {
    padding: var(--space-4);
    border-radius: var(--radius-xl);
  }
  
  .status-header h4 {
    color: var(--white);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-3);
    font-weight: 600;
    text-align: center;
  }
  
  .players-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-3);
  }
  
  .player-status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }
  
  .player-mini-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-lg);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .player-mini-info {
    text-align: center;
  }
  
  .player-mini-name {
    color: var(--white);
    font-size: var(--font-size-sm);
    font-weight: 600;
    line-height: 1.2;
  }
  
  .player-mini-score {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-xs);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .round-header {
      flex-direction: column;
      text-align: center;
    }
    
    .substep-title {
      font-size: var(--font-size-2xl);
    }
    
    .question-text {
      font-size: var(--font-size-xl);
    }
    
    .selector-info {
      flex-direction: column;
    }
    
    .categories-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .players-list {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .timer-circle {
      width: 60px;
      height: 60px;
    }
    
    .timer-number {
      font-size: var(--font-size-xl);
    }
  }
</style>