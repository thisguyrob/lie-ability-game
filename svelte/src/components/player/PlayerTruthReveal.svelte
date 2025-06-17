<script>
  export let truthRevealData;
  export let onLike;
  
  let likedLies = new Set();
  
  // Ensure data is properly defined with defaults
  $: data = truthRevealData || {
    category: 'Unknown',
    question: 'Loading...',  
    truth: { answer: 'Loading...' },
    lies: [],
    truthVoters: [],
    truthPoints: 1000
  };
  
  // Combine truth and lies into one list
  $: allOptions = data ? [
    {
      id: 'truth',
      text: data.truth.answer,
      votes: data.truthVoters?.length || 0,
      isTruth: true,
      voters: data.truthVoters || []
    },
    ...(data.lies || [])
  ].sort(() => Math.random() - 0.5) : []; // Randomize order
  
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
    
    <div class="options-section">
      <h3 class="options-title">All the Options</h3>
      <div class="options-list">
        {#each allOptions as option, index}
          <div class="option-item" class:is-truth={option.isTruth} style="animation-delay: {index * 0.1}s">
            <div class="option-header">
              <div class="option-votes">
                <span class="votes-icon">🗳️</span>
                <span class="votes-count">{option.votes}</span>
                {#if option.likesReceived && option.likesReceived > 0}
                  <span class="likes-indicator">👍🏻</span>
                {/if}
              </div>
              {#if !option.isTruth}
                <button
                  class="like-button"
                  class:liked={likedLies.has(option.id)}
                  disabled={likedLies.has(option.id)}
                  on:click={() => handleLikeLie(option.id)}
                >
                  <span class="like-icon">{likedLies.has(option.id) ? '❤️' : '🤍'}</span>
                  <span class="like-text">{likedLies.has(option.id) ? 'Liked!' : 'Like'}</span>
                </button>
              {:else}
                <span class="truth-badge">🎯 Truth</span>
              {/if}
            </div>
            
            <div class="option-text">"{option.text}"</div>
            
            <div class="option-attribution">
              {#if !option.isTruth}
                <div class="authors">
                  <span class="authors-label">By:</span>
                  {#each (option.authors || []) as author, authorIndex}
                    <span class="author" style="color: {author.avatar?.color || '#666'}">
                      {author.avatar?.emoji || '😀'} {author.name}
                    </span>
                    {#if authorIndex < (option.authors || []).length - 1}, {/if}
                  {/each}
                </div>
              {/if}
              
              {#if option.voters && option.voters.length > 0}
                <div class="voters">
                  <span class="voters-label">{option.isTruth ? 'Found by:' : 'Fooled:'}</span>
                  {#each option.voters as voter, voterIndex}
                    <span class="voter" style="color: {voter.avatar?.color || '#666'}">
                      {voter.avatar?.emoji || '😀'} {voter.name}
                    </span>
                    {#if voterIndex < option.voters.length - 1}, {/if}
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
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
  
  .options-section {
    margin-bottom: 2rem;
  }
  
  .options-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }
  
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .option-item {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.25rem;
    animation: slideInUp 0.5s ease both;
    transition: all 0.3s ease;
  }
  
  .option-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  
  .option-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .truth-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
    border: 1px solid rgba(34, 197, 94, 0.2);
  }
  
  .option-votes {
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
  
  .likes-indicator {
    font-style: normal;
    font-weight: 600;
    color: #f59e0b;
    margin-left: 0.5rem;
    animation: likeAppear 0.5s ease;
  }
  
  @keyframes likeAppear {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
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
  
  .option-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
    font-style: italic;
    line-height: 1.4;
  }
  
  .option-attribution {
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
    .reveal-container {
      padding: 0.5rem;
    }
    
    .reveal-card {
      padding: 1.5rem;
    }
    
    .question-text {
      font-size: 1.1rem;
    }
    
    .option-item {
      padding: 1rem;
    }
    
    .option-header {
      flex-direction: column;
      gap: 0.75rem;
      align-items: flex-start;
    }
    
    .option-attribution {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .authors, .voters {
      justify-content: flex-start;
    }
  }
</style>