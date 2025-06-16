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

<div class="category-container">
  <div class="header">
    <h2 class="title">Category Selection</h2>
    <p class="selector-info">
      <span class="selector-name">{currentQuestion.selectorName}</span> is choosing the category
    </p>
  </div>
  
  <div class="categories-grid">
    {#each currentQuestion.categories as category, index}
      <div class="category-card" style="animation-delay: {index * 0.1}s">
        <div class="category-emoji">{getEmoji(category.category)}</div>
        <div class="category-name">{category.category}</div>
        <div class="category-pulse"></div>
      </div>
    {/each}
  </div>
  
  <div class="waiting-indicator">
    <div class="dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <p>Waiting for selection...</p>
  </div>
</div>

<style>
  .category-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    animation: fadeIn 0.6s ease;
  }
  
  .header {
    text-align: center;
  }
  
  .title {
    font-size: 3rem;
    font-weight: 700;
    color: white;
    margin: 0 0 1rem 0;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  
  .selector-info {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
  
  .selector-name {
    font-weight: 600;
    color: #fbbf24;
    text-shadow: 0 2px 10px rgba(251, 191, 36, 0.3);
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    width: 100%;
  }
  
  .category-card {
    position: relative;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    animation: slideInUp 0.6s ease both;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
  
  .category-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
  
  .category-emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
    animation: bounce 2s infinite;
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
  
  .category-name {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    position: relative;
    z-index: 2;
  }
  
  .waiting-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .dots {
    display: flex;
    gap: 0.5rem;
  }
  
  .dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    animation: dot-bounce 1.4s infinite ease-in-out both;
  }
  
  .dots span:nth-child(1) { animation-delay: -0.32s; }
  .dots span:nth-child(2) { animation-delay: -0.16s; }
  
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
  
  .waiting-indicator p {
    font-size: 1.2rem;
    font-weight: 500;
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
    .category-container {
      gap: 2rem;
    }
    
    .title {
      font-size: 2.5rem;
    }
    
    .selector-info {
      font-size: 1.2rem;
    }
    
    .categories-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .category-card {
      padding: 2rem 1.5rem;
    }
    
    .category-emoji {
      font-size: 3rem;
    }
    
    .category-name {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .categories-grid {
      gap: 1rem;
    }
    
    .category-card {
      padding: 1.5rem 1rem;
    }
    
    .category-emoji {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }
    
    .category-name {
      font-size: 1.3rem;
    }
  }
</style>