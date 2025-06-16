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
  
  // Get option letter (A, B, C, etc.)
  function getOptionLetter(index) {
    return String.fromCharCode(65 + index);
  }
  
  // Computed values
  $: currentQuestion = gameState.currentQuestion;
  $: options = gameState.options || [];
  $: revealData = gameState.revealData || {};
  $: correctAnswerIndex = revealData.correctAnswerIndex;
  $: connectedPlayers = gameState.players?.filter(p => p.connected) || [];
  
  // Process reveal data
  $: lieResults = revealData.lieResults || [];
  $: truthVoters = revealData.truthVoters || [];
  $: totalVotes = revealData.totalVotes || 0;
  
  // Get voting statistics
  function getVotingStats() {
    const stats = {
      totalPlayers: connectedPlayers.length,
      truthVotes: truthVoters.length,
      lieVotes: totalVotes - truthVoters.length,
      truthPercentage: totalVotes > 0 ? Math.round((truthVoters.length / totalVotes) * 100) : 0
    };
    return stats;
  }
  
  $: votingStats = getVotingStats();
</script>

<div class="truth-reveal">
  <div class="container">
    <!-- Header -->
    <div class="reveal-header fade-in">
      <h1>🎭 The Truth Revealed!</h1>
      <p>Let's see who fooled whom and who found the truth...</p>
    </div>
    
    <!-- Question Context -->
    {#if currentQuestion}
      <div class="question-context slide-up">
        <div class="context-card glass">
          <div class="category-header">
            <span class="category-emoji">{getCategoryEmoji(currentQuestion.category)}</span>
            <span class="category-name">{currentQuestion.category}</span>
          </div>
          <div class="question-text">
            {currentQuestion.question}
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Lie Results (showing lies with votes first) -->
    {#if lieResults.length > 0}
      <div class="lies-section scale-in">
        <div class="lies-card">
          <h2>🎭 The Lies That Fooled You</h2>
          <p class="lies-subtitle">Here are the fake answers that received votes:</p>
          
          <div class="lies-list">
            {#each lieResults as lieResult, index}
              <div 
                class="lie-item"
                style="animation-delay: {index * 500}ms"
              >
                <div class="lie-header">
                  <div class="lie-option">
                    <span class="option-letter">{getOptionLetter(lieResult.optionIndex)}</span>
                    <span class="lie-text">"{lieResult.text}"</span>
                  </div>
                  <div class="vote-count">
                    <span class="vote-number">{lieResult.votes}</span>
                    <span class="vote-label">vote{lieResult.votes !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div class="lie-details">
                  <div class="lie-authors">
                    <h4>Created by:</h4>
                    <div class="authors-list">
                      {#each lieResult.authors as author}
                        <div class="author-item">
                          <div 
                            class="author-avatar"
                            style="background: {author.avatar.color}"
                          >
                            {author.avatar.emoji}
                          </div>
                          <span class="author-name">{author.name}</span>
                          <span class="author-points">+{lieResult.pointsPerAuthor}</span>
                        </div>
                      {/each}
                    </div>
                  </div>
                  
                  {#if lieResult.voters.length > 0}
                    <div class="lie-voters">
                      <h4>Fooled players:</h4>
                      <div class="voters-list">
                        {#each lieResult.voters as voter}
                          <div class="voter-item">
                            <div 
                              class="voter-avatar"
                              style="background: {voter.avatar.color}"
                            >
                              {voter.avatar.emoji}
                            </div>
                            <span class="voter-name">{voter.name}</span>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
    
    <!-- The Truth -->
    {#if correctAnswerIndex !== undefined}
      <div class="truth-section scale-in">
        <div class="truth-card">
          <h2>✨ The Real Answer</h2>
          
          <div class="truth-reveal-animation">
            <div class="truth-answer">
              <span class="truth-letter">{getOptionLetter(correctAnswerIndex)}</span>
              <span class="truth-text">{options[correctAnswerIndex]?.text}</span>
            </div>
          </div>
          
          <div class="truth-stats">
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">{votingStats.truthVotes}</span>
                <span class="stat-label">found the truth</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{votingStats.lieVotes}</span>
                <span class="stat-label">were fooled</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{votingStats.truthPercentage}%</span>
                <span class="stat-label">accuracy</span>
              </div>
            </div>
          </div>
          
          {#if truthVoters.length > 0}
            <div class="truth-finders">
              <h3>🎯 Truth Detectives</h3>
              <div class="detectives-grid">
                {#each truthVoters as detective}
                  <div class="detective-item">
                    <div 
                      class="detective-avatar"
                      style="background: {detective.avatar.color}"
                    >
                      {detective.avatar.emoji}
                    </div>
                    <div class="detective-info">
                      <span class="detective-name">{detective.name}</span>
                      <span class="detective-points">+{revealData.truthPoints?.[detective.id] || 0}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {:else}
            <div class="no-truth-finders">
              <h3>😱 Plot Twist!</h3>
              <p>Nobody found the real answer this round! Everyone was completely fooled!</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}
    
    <!-- Round Summary -->
    <div class="round-summary slide-up">
      <div class="summary-card glass">
        <h3>📊 Round {gameState.round || 1} Summary</h3>
        <div class="summary-stats">
          <div class="summary-row">
            <span class="summary-label">Total players:</span>
            <span class="summary-value">{connectedPlayers.length}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Lies submitted:</span>
            <span class="summary-value">{lieResults.reduce((sum, lie) => sum + lie.authors.length, 0)}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Players fooled:</span>
            <span class="summary-value">{votingStats.lieVotes}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Truth accuracy:</span>
            <span class="summary-value">{votingStats.truthPercentage}%</span>
          </div>
        </div>
        
        <div class="next-up">
          {#if gameState.round < 3}
            <p class="next-text">🚀 Get ready for Round {gameState.round + 1}! Points will be {gameState.round === 1 ? 'doubled' : 'tripled'}!</p>
          {:else}
            <p class="next-text">🏁 That was the final round! Time for final results!</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .truth-reveal {
    min-height: 100vh;
    padding: var(--space-6) 0;
  }
  
  .reveal-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  .reveal-header h1 {
    font-size: var(--font-size-5xl);
    font-weight: 900;
    color: var(--white);
    margin-bottom: var(--space-3);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .reveal-header p {
    font-size: var(--font-size-xl);
    color: rgba(255, 255, 255, 0.9);
  }
  
  .question-context {
    margin-bottom: var(--space-8);
  }
  
  .context-card {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-6);
    border-radius: var(--radius-2xl);
    text-align: center;
  }
  
  .category-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }
  
  .category-emoji {
    font-size: var(--font-size-2xl);
  }
  
  .category-name {
    color: var(--white);
    font-size: var(--font-size-xl);
    font-weight: 700;
  }
  
  .question-text {
    color: var(--white);
    font-size: var(--font-size-2xl);
    font-weight: 700;
    line-height: 1.4;
  }
  
  .lies-section {
    margin-bottom: var(--space-10);
  }
  
  .lies-card {
    background: var(--white);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    box-shadow: var(--shadow-2xl);
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .lies-card h2 {
    color: var(--gray-800);
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-2);
    font-weight: 800;
    text-align: center;
  }
  
  .lies-subtitle {
    color: var(--gray-600);
    font-size: var(--font-size-lg);
    text-align: center;
    margin-bottom: var(--space-6);
  }
  
  .lies-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  
  .lie-item {
    border: 2px solid var(--gray-200);
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    background: var(--gray-50);
    animation: slide-up 0.5s ease-out;
  }
  
  .lie-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
    gap: var(--space-4);
  }
  
  .lie-option {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex: 1;
  }
  
  .option-letter {
    width: 40px;
    height: 40px;
    background: var(--error);
    color: var(--white);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: var(--font-size-lg);
    flex-shrink: 0;
  }
  
  .lie-text {
    color: var(--gray-800);
    font-size: var(--font-size-xl);
    font-weight: 700;
    font-style: italic;
  }
  
  .vote-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--error);
    color: var(--white);
    padding: var(--space-3);
    border-radius: var(--radius-lg);
    min-width: 80px;
  }
  
  .vote-number {
    font-size: var(--font-size-2xl);
    font-weight: 900;
    line-height: 1;
  }
  
  .vote-label {
    font-size: var(--font-size-xs);
    font-weight: 600;
    opacity: 0.9;
  }
  
  .lie-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-5);
  }
  
  .lie-authors h4,
  .lie-voters h4 {
    color: var(--gray-700);
    font-size: var(--font-size-base);
    margin-bottom: var(--space-3);
    font-weight: 600;
  }
  
  .authors-list,
  .voters-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .author-item,
  .voter-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2);
    background: var(--white);
    border-radius: var(--radius);
    border: 1px solid var(--gray-200);
  }
  
  .author-avatar,
  .voter-avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-base);
    border: 2px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
  }
  
  .author-name,
  .voter-name {
    color: var(--gray-700);
    font-weight: 600;
    font-size: var(--font-size-sm);
    flex: 1;
  }
  
  .author-points {
    color: var(--success);
    font-weight: 700;
    font-size: var(--font-size-sm);
  }
  
  .truth-section {
    margin-bottom: var(--space-10);
  }
  
  .truth-card {
    background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
    color: var(--white);
    border-radius: var(--radius-2xl);
    padding: var(--space-8);
    box-shadow: var(--shadow-2xl);
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  .truth-card h2 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-6);
    font-weight: 800;
  }
  
  .truth-reveal-animation {
    margin-bottom: var(--space-6);
  }
  
  .truth-answer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    padding: var(--space-5);
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    animation: truth-glow 2s ease-in-out infinite;
  }
  
  .truth-letter {
    width: 60px;
    height: 60px;
    background: var(--white);
    color: var(--success);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: var(--font-size-2xl);
    flex-shrink: 0;
    box-shadow: var(--shadow-lg);
  }
  
  .truth-text {
    font-size: var(--font-size-2xl);
    font-weight: 800;
    flex: 1;
  }
  
  .truth-stats {
    margin-bottom: var(--space-6);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }
  
  .stat-item {
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }
  
  .stat-number {
    font-size: var(--font-size-3xl);
    font-weight: 900;
    line-height: 1;
  }
  
  .stat-label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    opacity: 0.9;
  }
  
  .truth-finders h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
    font-weight: 700;
  }
  
  .detectives-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-3);
  }
  
  .detective-item {
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-lg);
    padding: var(--space-3);
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  
  .detective-avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-lg);
    border: 2px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
  }
  
  .detective-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
  
  .detective-name {
    font-weight: 700;
    font-size: var(--font-size-base);
  }
  
  .detective-points {
    font-weight: 600;
    font-size: var(--font-size-sm);
    opacity: 0.9;
  }
  
  .no-truth-finders {
    text-align: center;
  }
  
  .no-truth-finders h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-3);
    font-weight: 700;
  }
  
  .no-truth-finders p {
    font-size: var(--font-size-lg);
    opacity: 0.9;
  }
  
  .summary-card {
    max-width: 600px;
    margin: 0 auto;
    padding: var(--space-6);
    border-radius: var(--radius-2xl);
    text-align: center;
  }
  
  .summary-card h3 {
    color: var(--white);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-5);
    font-weight: 700;
  }
  
  .summary-stats {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-5);
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2);
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius);
  }
  
  .summary-label {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }
  
  .summary-value {
    color: var(--white);
    font-weight: 700;
  }
  
  .next-text {
    color: var(--white);
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0;
  }
  
  @keyframes truth-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }
    50% {
      box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
    }
  }
  
  @media (max-width: 768px) {
    .reveal-header h1 {
      font-size: var(--font-size-3xl);
    }
    
    .question-text {
      font-size: var(--font-size-xl);
    }
    
    .lie-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .lie-details {
      grid-template-columns: 1fr;
    }
    
    .truth-text {
      font-size: var(--font-size-lg);
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .detectives-grid {
      grid-template-columns: 1fr;
    }
    
    .truth-answer {
      flex-direction: column;
      text-align: center;
    }
  }
  
  @media (max-width: 480px) {
    .truth-reveal {
      padding: var(--space-4) 0;
    }
    
    .lies-card,
    .truth-card,
    .summary-card {
      padding: var(--space-4);
    }
    
    .lie-text {
      font-size: var(--font-size-base);
    }
    
    .truth-letter {
      width: 48px;
      height: 48px;
      font-size: var(--font-size-xl);
    }
  }
</style>