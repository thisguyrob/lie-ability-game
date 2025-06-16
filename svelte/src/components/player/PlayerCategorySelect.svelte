<script>
  export let currentQuestion;
  export let playerId;
  export let onSelect;
  
  $: isSelector = currentQuestion.selectorId === playerId;
  $: categories = currentQuestion.categories || [];
  
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
  
  function handleCategorySelect(categoryId) {
    onSelect(categoryId);
  }
</script>

<div class="category-container">
  <div class="category-card">
    {#if isSelector}
      <div class="selector-header">
        <div class="selector-icon">🎯</div>
        <h2 class="selector-title">You're the Category Selector!</h2>
        <p class="selector-subtitle">Choose a category that interests you</p>
      </div>
      
      <div class="categories-grid">
        {#each categories as category, index}
          <button
            class="category-option"
            style="animation-delay: {index * 0.1}s"
            on:click={() => handleCategorySelect(index)}
          >
            <div class="category-emoji">{getEmoji(category.category)}</div>
            <div class="category-name">{category.category}</div>
            <div class="select-hint">Tap to select</div>
          </button>
        {/each}
      </div>
    {:else}
      <div class="waiting-header">
        <div class="waiting-icon">⏳</div>
        <h2 class="waiting-title">Category Selection</h2>
        <p class="waiting-subtitle">
          <span class="selector-name">{currentQuestion.selectorName}</span> is choosing the category
        </p>
      </div>
      
      <div class="categories-preview">
        {#each categories as category, index}
          <div class="category-preview" style="animation-delay: {index * 0.1}s">
            <div class="preview-emoji">{getEmoji(category.category)}</div>
            <div class="preview-name">{category.category}</div>
          </div>
        {/each}
      </div>
      
      <div class="waiting-indicator">
        <div class="waiting-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="waiting-text">Waiting for selection...</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .category-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeIn 0.6s ease;
  }
  
  .category-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  .selector-header, .waiting-header {
    margin-bottom: 2rem;
  }
  
  .selector-icon, .waiting-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }
  
  .selector-title, .waiting-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .selector-subtitle, .waiting-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0;
  }
  
  .selector-name {
    font-weight: 600;
    color: #667eea;
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .category-option {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: slideInUp 0.5s ease both;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .category-option:hover {
    transform: translateY(-5px);
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  .category-option:active {
    transform: translateY(-2px);
  }
  
  .category-emoji {
    font-size: 2.5rem;
    transition: all 0.3s ease;
  }
  
  .category-option:hover .category-emoji {
    transform: scale(1.1);
  }
  
  .category-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    transition: color 0.3s ease;
  }
  
  .category-option:hover .category-name {
    color: white;
  }
  
  .select-hint {
    font-size: 0.8rem;
    color: #666;
    opacity: 0.8;
    transition: all 0.3s ease;
  }
  
  .category-option:hover .select-hint {
    color: rgba(255, 255, 255, 0.9);
    opacity: 1;
  }
  
  .categories-preview {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .category-preview {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.5rem 1rem;
    text-align: center;
    animation: slideInUp 0.5s ease both;
    opacity: 0.7;
    transition: all 0.3s ease;
  }
  
  .category-preview:hover {
    opacity: 1;
    transform: translateY(-2px);
  }
  
  .preview-emoji {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .preview-name {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
  }
  
  .waiting-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .waiting-dots {
    display: flex;
    gap: 0.5rem;
  }
  
  .waiting-dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #667eea;
    animation: dot-bounce 1.4s infinite ease-in-out both;
  }
  
  .waiting-dots span:nth-child(1) { animation-delay: -0.32s; }
  .waiting-dots span:nth-child(2) { animation-delay: -0.16s; }
  
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
  
  .waiting-text {
    font-size: 1rem;
    color: #666;
    margin: 0;
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
    .category-container {
      padding: 0.5rem;
    }
    
    .category-card {
      padding: 1.5rem;
    }
    
    .selector-title, .waiting-title {
      font-size: 1.6rem;
    }
    
    .categories-grid, .categories-preview {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .category-option, .category-preview {
      padding: 1.25rem 1rem;
    }
    
    .category-emoji, .preview-emoji {
      font-size: 2rem;
    }
    
    .category-name, .preview-name {
      font-size: 1rem;
    }
  }
</style>