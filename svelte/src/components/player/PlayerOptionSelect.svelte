<script>
  import { createEventDispatcher } from 'svelte'
  
  export let socket
  export let options = []
  export let timer = 0
  export let canLike = true
  
  const dispatch = createEventDispatcher()
  
  let selectedOption = null
  let hasVoted = false
  let likedOptions = new Set()
  
  const handleSelect = (optionId) => {
    if (hasVoted) return
    
    selectedOption = optionId
    hasVoted = true
    
    socket.emit('select_option', { optionId })
    dispatch('selected', { optionId })
  }
  
  const handleLike = (optionId, event) => {
    event.stopPropagation()
    
    if (!canLike || likedOptions.has(optionId)) return
    
    likedOptions.add(optionId)
    likedOptions = new Set(likedOptions) // Trigger reactivity
    
    socket.emit('like_lie', { optionId })
  }
  
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  
  // Shuffle options once on component mount
  let displayOptions = shuffleArray(options)
</script>

<div class="select-container">
  <div class="select-card">
    <div class="header">
      <h2 class="title">Pick the Truth! 🤔</h2>
      {#if timer > 0}
        <div class="timer" class:urgent={timer <= 10}>
          ⏱ {timer}s
        </div>
      {/if}
    </div>
    
    {#if !hasVoted}
      <p class="instruction">Which one is the real answer?</p>
      
      <div class="options-list">
        {#each displayOptions as option, index}
          <button
            class="option"
            class:selected={selectedOption === option.id}
            on:click={() => handleSelect(option.id)}
            style="animation-delay: {index * 0.1}s"
          >
            <span class="option-number">{index + 1}</span>
            <span class="option-text">{option.text}</span>
            {#if canLike && option.isLie}
              <button
                class="like-button"
                class:liked={likedOptions.has(option.id)}
                on:click={(e) => handleLike(option.id, e)}
                title="Like this lie"
              >
                {likedOptions.has(option.id) ? '❤️' : '🤍'}
              </button>
            {/if}
          </button>
        {/each}
      </div>
      
      <p class="hint">💡 Tap to select your answer</p>
    {:else}
      <div class="voted-message">
        <div class="voted-icon">🗳️</div>
        <h3>Vote Submitted!</h3>
        <p>You selected:</p>
        <div class="selected-answer">
          {displayOptions.find(o => o.id === selectedOption)?.text || 'Unknown'}
        </div>
        <p class="waiting-text">Waiting for other players to vote...</p>
        <div class="waiting-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .select-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .select-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 600px;
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
  
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .option {
    background: white;
    border: 3px solid #e2e8f0;
    border-radius: 15px;
    padding: 1.25rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    animation: slideIn 0.5s ease-out forwards;
    opacity: 0;
    transform: translateX(-20px);
  }
  
  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .option:hover {
    border-color: #667eea;
    background: #f7fafc;
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.2);
  }
  
  .option.selected {
    border-color: #48bb78;
    background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
    box-shadow: 0 5px 20px rgba(72, 187, 120, 0.3);
  }
  
  .option-number {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  
  .option.selected .option-number {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  }
  
  .option-text {
    flex: 1;
    color: #2d3748;
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .like-button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0.25rem;
  }
  
  .like-button:hover {
    transform: scale(1.2);
  }
  
  .like-button.liked {
    animation: heartBeat 0.5s ease-out;
  }
  
  @keyframes heartBeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  
  .hint {
    text-align: center;
    color: #718096;
    font-size: 0.875rem;
    margin-top: 1.5rem;
  }
  
  .voted-message {
    text-align: center;
    padding: 2rem 0;
  }
  
  .voted-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .voted-message h3 {
    font-size: 1.5rem;
    color: #38a169;
    margin: 0 0 1rem 0;
  }
  
  .voted-message p {
    color: #718096;
    margin: 0.5rem 0;
  }
  
  .selected-answer {
    background: #f7fafc;
    padding: 1rem;
    border-radius: 10px;
    color: #4a5568;
    margin: 1rem 0;
    border-left: 4px solid #48bb78;
    text-align: left;
  }
  
  .waiting-text {
    margin-top: 1.5rem;
  }
  
  .waiting-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .waiting-dots span {
    width: 10px;
    height: 10px;
    background: #667eea;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  
  .waiting-dots span:nth-child(1) { animation-delay: -0.32s; }
  .waiting-dots span:nth-child(2) { animation-delay: -0.16s; }
  .waiting-dots span:nth-child(3) { animation-delay: 0s; }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @media (max-width: 480px) {
    .select-card {
      padding: 1.5rem;
    }
    
    .title {
      font-size: 1.5rem;
    }
    
    .timer {
      font-size: 1.1rem;
      padding: 0.4rem 0.8rem;
    }
    
    .option {
      padding: 1rem;
    }
    
    .option-number {
      width: 35px;
      height: 35px;
      font-size: 1rem;
    }
    
    .option-text {
      font-size: 0.95rem;
    }
  }
</style>