<script>
  export let truthRevealData;
  export let onLike;
  
  let likedLies = new Set();
  
  $: data = truthRevealData;
  
  function handleLikeLie(lieId) {
    if (likedLies.has(lieId)) return;
    
    likedLies.add(lieId);
    likedLies = likedLies; // Trigger reactivity
    onLike(lieId);
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

<div class="reveal-container">
  <div class="reveal-card">
    <div class="question-section">
      <div class="category-badge">
        <span class="category-emoji">{getEmoji(data.category)}</span>
        <span class="category-name">{data.category}</span>
      </div>
      <div class="question-text">{data.question}</div>
    </div>
    
    <div class="truth-section">
      <div class="truth-label">The Truth</div>
      <div class="truth-answer">{data.truth.answer}</div>
      <div class="truth-celebration">🎯</div>
    </div>
    
    {#if data.lies && data.lies.length > 0}
      <div class="lies-section">
        <h3 class="lies-title">The Lies That Fooled Players</h3>
        <div class="lies-list">
          {#each data.lies as lie, index}
            <div class="lie-item" style="animation-delay: {index * 0.1}s">
              <div class="lie-header">
                <div class="lie-votes">
                  <span class="votes-icon">🗳️</span>
                  <span class="votes-count">{lie.votes}</span>
                </div>
                <button
                  class="like-button"
                  class:liked={likedLies.has(lie.id)}
                  disabled={likedLies.has(lie.id)}
                  on:click={() => handleLikeLie(lie.id)}
                >
                  <span class="like-icon">{likedLies.has(lie.id) ? '❤️' : '🤍'}</span>
                  <span class="like-text">{likedLies.has(lie.id) ? 'Liked!' : 'Like'}</span>
                </button>
              </div>
              
              <div class="lie-text">"{lie.text}"</div>
              
              <div class="lie-attribution">
                <div class="authors">
                  <span class="authors-label">By:</span>
                  {#each lie.authors as author, authorIndex}
                    <span class="author" style="color: {author.avatar.color}">
                      {author.avatar.emoji} {author.name}
                    </span>
                    {#if authorIndex < lie.authors.length - 1}, {/if}
                  {/each}
                </div>
                
                {#if lie.voters && lie.voters.length > 0}
                  <div class="voters">
                    <span class="voters-label">Fooled:</span>
                    {#each lie.voters as voter, voterIndex}
                      <span class="voter" style="color: {voter.avatar.color}">
                        {voter.avatar.emoji} {voter.name}
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
    
    {#if data.truthVoters && data.truthVoters.length > 0}
      <div class="truth-voters-section">
        <h3 class="truth-voters-title">Truth Detectives 🕵️</h3>
        <div class="truth-voters">
          {#each data.truthVoters as voter, index}
            <div class="truth-voter" style="animation-delay: {index * 0.1}s">
              <div class="voter-avatar" style="background-color: {voter.avatar.color}">
                <span class="voter-emoji">{voter.avatar.emoji}</span>
              </div>
              <div class="voter-name">{voter.name}</div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .reveal-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeIn 0.8s ease;
  }
  
  .reveal-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .question-section {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .category-badge {
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
  
  .category-emoji {
    font-size: 1.1rem;
  }
  
  .question-text {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    line-height: 1.3;
  }
  
  .truth-section {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
    animation: bounceIn 0.8s ease;
  }
  
  .truth-section::before {
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
  
  .truth-label {
    font-size: 1rem;
    font-weight: 600;
    opacity: 0.9;
    margin-bottom: 0.75rem;
  }
  
  .truth-answer {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    position: relative;
    z-index: 2;
  }
  
  .truth-celebration {
    font-size: 1.5rem;
    animation: bounce 1s infinite alternate;
  }
  
  @keyframes bounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-5px); }
  }
  
  .lies-section {
    margin-bottom: 2rem;
  }
  
  .lies-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }
  
  .lies-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .lie-item {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.25rem;
    animation: slideInUp 0.5s ease both;
    transition: all 0.3s ease;
  }
  
  .lie-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
    font-size: 0.9rem;
  }
  
  .votes-icon {
    font-size: 1rem;
  }
  
  .like-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .like-button:hover:not(:disabled) {
    background: #fecaca;
    border-color: #ef4444;
    transform: scale(1.05);
  }
  
  .like-button.liked {
    background: #fecaca;
    border-color: #ef4444;
    color: #dc2626;
    cursor: default;
  }
  
  .like-button:disabled {
    cursor: default;
  }
  
  .like-icon {
    font-size: 1rem;
  }
  
  .lie-text {
    font-size: 1.1rem;
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
    font-size: 0.85rem;
  }
  
  .authors, .voters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
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
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1.5rem 0;
  }
  
  .truth-voters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  .truth-voter {
    background: linear-gradient(135deg, #22c55e20, #4ade8020);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    animation: slideInUp 0.5s ease both;
    transition: all 0.3s ease;
    min-width: 80px;
  }
  
  .truth-voter:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
  }
  
  .voter-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.75rem auto;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .voter-emoji {
    font-size: 1.2rem;
  }
  
  .voter-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
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
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 480px) {
    .reveal-container {
      padding: 0.5rem;
    }
    
    .reveal-card {
      padding: 1.5rem;
    }
    
    .question-text {
      font-size: 1.1rem;
    }
    
    .truth-answer {
      font-size: 1.5rem;
    }
    
    .lie-item {
      padding: 1rem;
    }
    
    .lie-header {
      flex-direction: column;
      gap: 0.75rem;
      align-items: flex-start;
    }
    
    .lie-attribution {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .authors, .voters {
      justify-content: flex-start;
    }
    
    .truth-voters {
      gap: 0.75rem;
    }
    
    .truth-voter {
      min-width: 70px;
      padding: 0.75rem;
    }
  }
</style>