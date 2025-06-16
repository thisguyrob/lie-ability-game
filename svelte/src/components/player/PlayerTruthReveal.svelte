<script>
  export let gameState;
  export let myPlayerData;
  
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
  
  // Get option letter (A, B, C, etc.)
  function getOptionLetter(index) {
    return String.fromCharCode(65 + index);
  }
  
  // Computed values
  $: currentQuestion = gameState.currentQuestion;
  $: options = gameState.options || [];
  $: revealData = gameState.revealData || {};
  $: myChoice = revealData.playerChoices?.[myPlayerData.id];
  $: myLie = revealData.playerLies?.[myPlayerData.id];
  $: correctAnswerIndex = revealData.correctAnswerIndex;
  $: pointsEarned = revealData.pointsEarned?.[myPlayerData.id] || 0;
  
  // Determine result status
  $: isCorrect = myChoice === correctAnswerIndex;
  $: fooledSomeone = myLie && revealData.lieVotes?.[myLie] > 0;
  $: pointsFromLies = revealData.liePoints?.[myPlayerData.id] || 0;
  $: pointsFromTruth = revealData.truthPoints?.[myPlayerData.id] || 0;
  
  // Get result icon and message
  function getResultStatus() {
    if (isCorrect && fooledSomeone) {
      return {
        icon: '🏆',
        title: 'Perfect Round!',
        message: 'You found the truth AND fooled other players!',
        color: 'success'
      };
    } else if (isCorrect) {
      return {
        icon: '🎯',
        title: 'Found the Truth!',
        message: 'Great detective work!',
        color: 'success'
      };
    } else if (fooledSomeone) {
      return {
        icon: '🎭',
        title: 'Master of Deception!',
        message: 'Your lie fooled other players!',
        color: 'warning'
      };
    } else {
      return {
        icon: '😅',
        title: 'Better Luck Next Time',
        message: 'Keep trying - every round is a new chance!',
        color: 'neutral'
      };
    }
  }
  
  $: resultStatus = getResultStatus();
</script>

<div class="truth-reveal-container">
  <!-- Result Header -->
  <div class="result-header fade-in">
    <div class="result-icon" class:success={resultStatus.color === 'success'} 
         class:warning={resultStatus.color === 'warning'}>
      {resultStatus.icon}
    </div>
    <h1 class="result-title">{resultStatus.title}</h1>
    <p class="result-message">{resultStatus.message}</p>
  </div>
  
  <!-- Question Context -->
  {#if currentQuestion}
    <div class="question-reminder glass slide-up">
      <div class="reminder-header">
        <span class="category-emoji">{getCategoryEmoji(currentQuestion.category)}</span>
        <span class="category-name">{currentQuestion.category}</span>
      </div>
      <div class="reminder-question">
        {currentQuestion.question}
      </div>
    </div>
  {/if}
  
  <!-- Your Performance -->
  <div class="performance-section scale-in">
    <div class="performance-card glass">
      <h2>📊 Your Performance</h2>
      
      <div class="performance-grid">
        <!-- Your Choice -->
        <div class="performance-item">
          <div class="item-header">
            <span class="item-icon">🗳️</span>
            <span class="item-title">Your Vote</span>
          </div>
          <div class="choice-display" class:correct={isCorrect} class:incorrect={!isCorrect}>
            <span class="choice-letter">{getOptionLetter(myChoice)}</span>
            <span class="choice-text">{options[myChoice]?.text}</span>
            <span class="choice-result">
              {isCorrect ? '✅ Correct!' : '❌ Wrong'}
            </span>
          </div>
        </div>
        
        <!-- Your Lie -->
        {#if myLie}
          <div class="performance-item">
            <div class="item-header">
              <span class="item-icon">🎭</span>
              <span class="item-title">Your Lie</span>
            </div>
            <div class="lie-display">
              <span class="lie-text">"{myLie}"</span>
              <span class="lie-votes">
                {revealData.lieVotes?.[myLie] || 0} player{(revealData.lieVotes?.[myLie] || 0) !== 1 ? 's' : ''} believed it
              </span>
            </div>
          </div>
        {/if}
        
        <!-- Points Breakdown -->
        <div class="performance-item">
          <div class="item-header">
            <span class="item-icon">🏆</span>
            <span class="item-title">Points Earned</span>
          </div>
          <div class="points-breakdown">
            {#if pointsFromTruth > 0}
              <div class="points-item">
                <span class="points-label">Finding truth:</span>
                <span class="points-value">+{pointsFromTruth}</span>
              </div>
            {/if}
            {#if pointsFromLies > 0}
              <div class="points-item">
                <span class="points-label">Fooling others:</span>
                <span class="points-value">+{pointsFromLies}</span>
              </div>
            {/if}
            {#if pointsEarned === 0}
              <div class="points-item no-points">
                <span class="points-label">No points this round</span>
                <span class="points-value">0</span>
              </div>
            {/if}
            <div class="points-total">
              <span class="total-label">Total:</span>
              <span class="total-value">+{pointsEarned}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- The Truth -->
  {#if correctAnswerIndex !== undefined}
    <div class="truth-section scale-in">
      <div class="truth-card">
        <h2>✨ The Truth Revealed</h2>
        <div class="truth-display">
          <div class="truth-answer">
            <span class="truth-letter">{getOptionLetter(correctAnswerIndex)}</span>
            <span class="truth-text">{options[correctAnswerIndex]?.text}</span>
          </div>
          <div class="truth-voters">
            {#if revealData.truthVoters?.length > 0}
              <h4>🎯 Players who found the truth:</h4>
              <div class="voters-list">
                {#each revealData.truthVoters as voter}
                  <div class="voter-item" class:me={voter.id === myPlayerData.id}>
                    <div 
                      class="voter-avatar"
                      style="background: {voter.avatar.color}"
                    >
                      {voter.avatar.emoji}
                    </div>
                    <span class="voter-name">
                      {voter.id === myPlayerData.id ? 'You' : voter.name}
                    </span>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="no-voters">😱 Nobody found the truth this round!</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Updated Score -->
  <div class="score-update slide-up">
    <div class="score-card glass">
      <h3>💰 Your Total Score</h3>
      <div class="score-display">
        <div class="score-previous">
          Previous: {(myPlayerData.score || 0) - pointsEarned}
        </div>
        <div class="score-change">
          {pointsEarned > 0 ? `+${pointsEarned}` : '0'}
        </div>
        <div class="score-current">
          Current: {myPlayerData.score || 0}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Game Progress -->
  <div class="progress-info">
    <div class="progress-items">
      <div class="progress-item">
        <span class="progress-emoji">🎯</span>
        <span>Round {gameState.round || 1} • Question {gameState.question || 1}</span>
      </div>
      <div class="progress-item">
        <span class="progress-emoji">📈</span>
        <span>Points multiply each round</span>
      </div>
    </div>
  </div>
</div>

<style>
  .truth-reveal-container {
    height: 100%;
    overflow-y: auto;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  
  .result-header {
    text-align: center;
  }
  
  .result-icon {
    font-size: var(--font-size-6xl);
    margin-bottom: var(--space-3);
    display: block;
    animation: bounce-in 0.8s ease-out;
  }
  
  .result-icon.success {
    filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.5));
  }
  
  .result-icon.warning {
    filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.5));
  }
  
  .result-title {
    color: var(--white);
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-2);
    font-weight: 900;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .result-message {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
    font-weight: 500;
  }
  
  .question-reminder {
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    text-align: center;
  }
  
  .reminder-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
  }
  
  .category-emoji {
    font-size: var(--font-size-xl);
  }
  
  .category-name {
    color: var(--white);
    font-weight: 700;
    font-size: var(--font-size-lg);
  }
  
  .reminder-question {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-base);
    font-weight: 500;
    line-height: 1.4;
  }
  
  .performance-card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
  }
  
  .performance-card h2 {
    color: var(--white);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-4);
    font-weight: 700;
    text-align: center;
  }
  
  .performance-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .performance-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
  }
  
  .item-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }
  
  .item-icon {
    font-size: var(--font-size-lg);
  }
  
  .item-title {
    color: var(--white);
    font-weight: 700;
    font-size: var(--font-size-base);
  }
  
  .choice-display {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .choice-letter {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: var(--font-size-base);
    background: var(--gray-300);
    color: var(--gray-800);
  }
  
  .choice-display.correct .choice-letter {
    background: var(--success);
    color: var(--white);
  }
  
  .choice-display.incorrect .choice-letter {
    background: var(--error);
    color: var(--white);
  }
  
  .choice-text {
    color: var(--white);
    font-weight: 600;
    font-size: var(--font-size-base);
  }
  
  .choice-result {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
    font-weight: 600;
  }
  
  .choice-display.correct .choice-result {
    color: var(--success);
  }
  
  .choice-display.incorrect .choice-result {
    color: var(--error);
  }
  
  .lie-display {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .lie-text {
    color: var(--white);
    font-weight: 600;
    font-size: var(--font-size-base);
    font-style: italic;
  }
  
  .lie-votes {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
    font-weight: 500;
  }
  
  .points-breakdown {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .points-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .points-item.no-points {
    opacity: 0.7;
  }
  
  .points-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
  }
  
  .points-value {
    color: var(--success);
    font-weight: 700;
    font-size: var(--font-size-sm);
  }
  
  .points-item.no-points .points-value {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .points-total {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: var(--space-2);
    margin-top: var(--space-2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .total-label {
    color: var(--white);
    font-weight: 700;
    font-size: var(--font-size-base);
  }
  
  .total-value {
    color: var(--success);
    font-weight: 900;
    font-size: var(--font-size-lg);
  }
  
  .truth-card {
    background: var(--white);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    box-shadow: var(--shadow-2xl);
    text-align: center;
  }
  
  .truth-card h2 {
    color: var(--gray-800);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-4);
    font-weight: 700;
  }
  
  .truth-answer {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    justify-content: center;
    margin-bottom: var(--space-5);
    padding: var(--space-4);
    background: var(--gray-50);
    border-radius: var(--radius-xl);
    border: 2px solid var(--success);
  }
  
  .truth-letter {
    width: 48px;
    height: 48px;
    background: var(--success);
    color: var(--white);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: var(--font-size-xl);
    flex-shrink: 0;
  }
  
  .truth-text {
    color: var(--gray-800);
    font-weight: 700;
    font-size: var(--font-size-xl);
    flex: 1;
  }
  
  .truth-voters h4 {
    color: var(--gray-700);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-3);
    font-weight: 600;
  }
  
  .voters-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-3);
  }
  
  .voter-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--gray-50);
    border-radius: var(--radius-lg);
    border: 2px solid transparent;
    transition: all var(--transition);
  }
  
  .voter-item.me {
    border-color: var(--primary);
    background: rgba(102, 126, 234, 0.1);
  }
  
  .voter-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-lg);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .voter-name {
    color: var(--gray-700);
    font-size: var(--font-size-sm);
    font-weight: 600;
  }
  
  .voter-item.me .voter-name {
    color: var(--primary);
    font-weight: 700;
  }
  
  .no-voters {
    color: var(--gray-600);
    font-size: var(--font-size-lg);
    font-style: italic;
    margin: 0;
  }
  
  .score-card {
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    text-align: center;
  }
  
  .score-card h3 {
    color: var(--white);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-3);
    font-weight: 700;
  }
  
  .score-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }
  
  .score-previous,
  .score-current {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-base);
    font-weight: 600;
  }
  
  .score-change {
    color: var(--success);
    font-size: var(--font-size-2xl);
    font-weight: 900;
    background: rgba(16, 185, 129, 0.2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  
  .score-current {
    color: var(--white);
    font-weight: 700;
  }
  
  .progress-info {
    margin-top: auto;
  }
  
  .progress-items {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }
  
  .progress-item {
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
  
  .progress-emoji {
    font-size: var(--font-size-base);
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
    .truth-reveal-container {
      padding: var(--space-3);
      gap: var(--space-4);
    }
    
    .result-title {
      font-size: var(--font-size-2xl);
    }
    
    .result-icon {
      font-size: var(--font-size-4xl);
    }
    
    .truth-text {
      font-size: var(--font-size-base);
    }
    
    .truth-letter {
      width: 40px;
      height: 40px;
      font-size: var(--font-size-lg);
    }
    
    .score-display {
      flex-direction: column;
      gap: var(--space-2);
    }
    
    .voters-list {
      justify-content: flex-start;
    }
    
    .progress-items {
      flex-direction: column;
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .truth-answer {
      flex-direction: column;
      text-align: center;
    }
    
    .performance-grid {
      gap: var(--space-3);
    }
    
    .performance-item {
      padding: var(--space-3);
    }
  }
</style>