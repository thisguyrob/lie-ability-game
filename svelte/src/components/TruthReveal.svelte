<script>
  export let data;
  
  // Ensure data is properly defined with defaults
  $: safeData = data || {
    category: 'Unknown',
    question: 'Loading...',  
    truth: { answer: 'Loading...' },
    lies: [],
    truthVoters: [],
    truthPoints: 1000
  };
  
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

<div class="reveal-container">
  <div class="question-section">
    <div class="category-badge">
      <span class="category-emoji">{getEmoji(safeData.category)}</span>
      <span class="category-name">{safeData.category}</span>
    </div>
    
    <h2 class="question-text">{safeData.question}</h2>
  </div>
  
  <div class="answer-reveal">
    <div class="answer-card">
      <div class="answer-label">The Truth</div>
      <div class="answer-text">{safeData.truth.answer}</div>
      <div class="answer-celebration">🎯</div>
    </div>
  </div>
  
  {#if safeData.lies && safeData.lies.length > 0}
    <div class="lies-section">
      <h3 class="lies-title">The Lies That Fooled You</h3>
      <div class="lies-grid">
        {#each safeData.lies as lie, index}
          <div class="lie-card" style="animation-delay: {index * 0.15}s">
            <div class="lie-header">
              <div class="lie-votes">
                <span class="votes-icon">🗳️</span>
                <span class="votes-count">{lie.votes} vote{lie.votes !== 1 ? 's' : ''}</span>
              </div>
              <div class="lie-points">+{lie.points}pts</div>
            </div>
            
            <div class="lie-text">"{lie.text}"</div>
            
            <div class="lie-attribution">
              <div class="authors">
                <span class="authors-label">By:</span>
                {#each (lie.authors || []) as author, authorIndex}
                  <span class="author" style="color: {author.avatar?.color || '#666'}">
                    {author.avatar?.emoji || '😀'} {author.name}
                  </span>
                  {#if authorIndex < (lie.authors || []).length - 1}, {/if}
                {/each}
              </div>
              
              {#if lie.voters && lie.voters.length > 0}
                <div class="voters">
                  <span class="voters-label">Fooled:</span>
                  {#each lie.voters as voter, voterIndex}
                    <span class="voter" style="color: {voter.avatar?.color || '#666'}">
                      {voter.avatar?.emoji || '😀'} {voter.name}
                    </span>
                    {#if voterIndex < lie.voters.length - 1}, {/if}
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if safeData.truthVoters && safeData.truthVoters.length > 0}
    <div class="truth-voters-section">
      <h3 class="truth-voters-title">Truth Detectives 🕵️</h3>
      <div class="truth-voters">
        {#each safeData.truthVoters as voter, index}
          <div class="truth-voter" style="animation-delay: {index * 0.1}s">
            <div class="voter-avatar" style="background-color: {voter.avatar?.color || '#667eea'}">
              <span class="voter-emoji">{voter.avatar?.emoji || '🕵️'}</span>
            </div>
            <div class="voter-name">{voter.name}</div>
            <div class="voter-bonus">+{safeData.truthPoints || 1000} pts</div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .reveal-container {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    animation: fadeIn 0.8s ease;
  }
  
  .question-section {
    text-align: center;
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
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  .category-emoji {
    font-size: 1.4rem;
  }
  
  .question-text {
    font-size: 2.2rem;
    font-weight: 600;
    color: white;
    margin: 0;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    line-height: 1.3;
  }
  
  .answer-reveal {
    display: flex;
    justify-content: center;
  }
  
  .answer-card {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
    border-radius: 20px;
    padding: 2.5rem 3rem;
    text-align: center;
    box-shadow: 0 12px 40px rgba(34, 197, 94, 0.3);
    position: relative;
    overflow: hidden;
    animation: bounceIn 0.8s ease;
  }
  
  .answer-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shine 2s infinite;
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
  
  .answer-label {
    font-size: 1.2rem;
    font-weight: 600;
    opacity: 0.9;
    margin-bottom: 1rem;
  }
  
  .answer-text {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
  }
  
  .answer-celebration {
    font-size: 2rem;
    animation: bounce 1s infinite alternate;
  }
  
  @keyframes bounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
  }
  
  .lies-section {
    text-align: center;
  }
  
  .lies-title {
    font-size: 2rem;
    font-weight: 700;
    color: white;
    margin: 0 0 2rem 0;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }
  
  .lies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .lie-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    animation: slideInUp 0.6s ease both;
    transition: all 0.3s ease;
  }
  
  .lie-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
  
  .lie-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .lie-votes {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-weight: 600;
  }
  
  .votes-icon {
    font-size: 1.2rem;
  }
  
  .lie-points {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.9rem;
  }
  
  .lie-text {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
    font-style: italic;
    line-height: 1.4;
  }
  
  .lie-attribution {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }
  
  .authors, .voters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.9rem;
  }
  
  .authors-label, .voters-label {
    font-weight: 600;
    color: #666;
  }
  
  .author, .voter {
    font-weight: 500;
    padding: 0.2rem 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    border: 1px solid currentColor;
  }
  
  .truth-voters-section {
    text-align: center;
  }
  
  .truth-voters-title {
    font-size: 2rem;
    font-weight: 700;
    color: white;
    margin: 0 0 2rem 0;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }
  
  .truth-voters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  .truth-voter {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border: 2px solid rgba(34, 197, 94, 0.3);
    animation: slideInUp 0.6s ease both;
    transition: all 0.3s ease;
  }
  
  .truth-voter:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
  
  .voter-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
  
  .voter-emoji {
    font-size: 1.8rem;
  }
  
  .voter-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .voter-bonus {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.9rem;
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
  
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .reveal-container {
      gap: 2rem;
    }
    
    .question-text {
      font-size: 1.8rem;
    }
    
    .answer-card {
      padding: 2rem;
    }
    
    .answer-text {
      font-size: 2rem;
    }
    
    .lies-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .lie-card {
      padding: 1.25rem;
    }
    
    .lie-text {
      font-size: 1.1rem;
    }
    
    .lies-title, .truth-voters-title {
      font-size: 1.6rem;
    }
  }
  
  @media (max-width: 480px) {
    .question-text {
      font-size: 1.5rem;
    }
    
    .answer-card {
      padding: 1.5rem;
    }
    
    .answer-text {
      font-size: 1.8rem;
    }
    
    .category-badge {
      font-size: 1rem;
      padding: 0.6rem 1.2rem;
    }
    
    .lie-attribution {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .authors, .voters {
      justify-content: center;
    }
  }
</style>