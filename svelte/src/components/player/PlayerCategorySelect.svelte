<script>
  import { createEventDispatcher } from 'svelte'
  
  export let socket
  export let categories = []
  export let isSelector = false
  export let timer = 0
  
  const dispatch = createEventDispatcher()
  
  let selectedCategory = null
  let hasSelected = false
  
  const handleSelect = (categoryId) => {
    if (!isSelector || hasSelected) return
    
    selectedCategory = categoryId
    hasSelected = true
    
    socket.emit('select_category', { categoryId })
    dispatch('selected', { categoryId })
  }
</script>

<div class="category-container">
  <div class="category-card">
    <div class="header">
      <h2 class="title">
        {isSelector ? 'Choose a Category! 🎯' : 'Category Selection 📋'}
      </h2>
      {#if timer > 0}
        <div class="timer" class:urgent={timer <= 10}>
          ⏱ {timer}s
        </div>
      {/if}
    </div>
    
    {#if isSelector}
      {#if !hasSelected}
        <p class="instruction">Pick a category for the next question:</p>
        
        <div class="categories-grid">
          {#each categories as category, index}
            <button
              class="category-option"
              class:selected={selectedCategory === category.id}
              on:click={() => handleSelect(category.id)}
              style="animation-delay: {index * 0.1}s"
            >
              <span class="category-emoji">{category.emoji || '📝'}</span>
              <span class="category-name">{category.name}</span>
            </button>
          {/each}
        </div>
      {:else}
        <div class="selected-message">
          <div class="success-icon">✅</div>
          <h3>Category Selected!</h3>
          <p>You chose:</p>
          <div class="selected-category">
            <span class="category-emoji">
              {categories.find(c => c.id === selectedCategory)?.emoji || '📝'}
            </span>
            <span class="category-name">
              {categories.find(c => c.id === selectedCategory)?.name || 'Unknown'}
            </span>
          </div>
          <p class="waiting-text">Loading question...</p>
        </div>
      {/if}
    {:else}
      <div class="waiting-message">
        <p class="waiting-title">Another player is choosing the category</p>
        <p class="waiting-subtitle">Get ready for the next question!</p>
        <div class="waiting-animation">
          <div class="category-preview">
            {#each categories as category}
              <div class="preview-item">
                <span>{category.emoji || '📝'}</span>
                <span>{category.name}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .category-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .category-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 500px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #2d3748;
    margin: 0;
  }
  
  .timer {
    font-size: 1.25rem;
    font-weight: 600;
    color: #4a5568;
    background: #f7fafc;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    transition: all 0.3s;
  }
  
  .timer.urgent {
    background: #feb2b2;
    color: #c53030;
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .instruction {
    color: #4a5568;
    font-size: 1.1rem;
    text-align: center;
    margin: 0 0 1.5rem 0;
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .category-option {
    background: white;
    border: 3px solid #e2e8f0;
    border-radius: 15px;
    padding: 1.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    animation: fadeInUp 0.5s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .category-option:hover {
    border-color: #667eea;
    background: #f7fafc;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  }
  
  .category-option.selected {
    border-color: #48bb78;
    background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
    box-shadow: 0 10px 30px rgba(72, 187, 120, 0.3);
    transform: scale(1.05);
  }
  
  .category-emoji {
    font-size: 2.5rem;
  }
  
  .category-name {
    font-weight: 600;
    color: #2d3748;
    text-align: center;
    font-size: 0.95rem;
  }
  
  .selected-message,
  .waiting-message {
    text-align: center;
    padding: 2rem 0;
  }
  
  .success-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .selected-message h3 {
    font-size: 1.5rem;
    color: #38a169;
    margin: 0 0 1rem 0;
  }
  
  .selected-message p {
    color: #718096;
    margin: 0.5rem 0;
  }
  
  .selected-category {
    background: #f7fafc;
    padding: 1.5rem;
    border-radius: 15px;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    border: 2px solid #e2e8f0;
  }
  
  .selected-category .category-emoji {
    font-size: 2rem;
  }
  
  .selected-category .category-name {
    font-size: 1.25rem;
  }
  
  .waiting-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 0.5rem 0;
  }
  
  .waiting-subtitle {
    color: #718096;
    margin: 0 0 2rem 0;
  }
  
  .waiting-animation {
    padding: 1rem;
  }
  
  .category-preview {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }
  
  .preview-item {
    background: #f7fafc;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #4a5568;
    animation: float 3s ease-in-out infinite;
  }
  
  .preview-item:nth-child(odd) {
    animation-delay: 0.5s;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .waiting-text {
    margin-top: 1rem;
  }
  
  @media (max-width: 480px) {
    .category-card {
      padding: 1.5rem;
    }
    
    .title {
      font-size: 1.5rem;
    }
    
    .timer {
      font-size: 1.1rem;
      padding: 0.4rem 0.8rem;
    }
    
    .categories-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .category-option {
      padding: 1.25rem 0.75rem;
    }
    
    .category-emoji {
      font-size: 2rem;
    }
    
    .category-name {
      font-size: 0.85rem;
    }
  }
</style>