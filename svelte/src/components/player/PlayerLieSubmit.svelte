<script>
  import { createEventDispatcher } from 'svelte'
  
  export let socket
  export let question = {}
  export let timer = 0
  
  const dispatch = createEventDispatcher()
  
  let lie = ''
  let isSubmitting = false
  let hasSubmitted = false
  let error = ''
  
  const MAX_LENGTH = 100
  
  const handleSubmit = () => {
    if (!lie.trim()) {
      error = 'Please enter your lie'
      return
    }
    
    if (lie.trim().length > MAX_LENGTH) {
      error = `Lie must be ${MAX_LENGTH} characters or less`
      return
    }
    
    isSubmitting = true
    error = ''
    
    socket.emit('submit_lie', { lie: lie.trim() })
    
    // Listen for server response
    socket.once('lie_submitted', (response) => {
      isSubmitting = false
      if (response.success) {
        hasSubmitted = true
        dispatch('submitted', { lie: lie.trim() })
      } else {
        error = response.error || 'Failed to submit lie'
      }
    })
    
    // Timeout fallback
    setTimeout(() => {
      if (isSubmitting) {
        isSubmitting = false
        error = 'Submission timeout. Please try again.'
      }
    }, 5000)
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSubmitting && !hasSubmitted) {
      e.preventDefault()
      handleSubmit()
    }
  }
  
  $: charactersLeft = MAX_LENGTH - lie.length
  $: isOverLimit = lie.length > MAX_LENGTH
</script>

<div class="submit-container">
  <div class="submit-card">
    <div class="header">
      <h2 class="title">Time to Lie! 🤥</h2>
      {#if timer > 0}
        <div class="timer" class:urgent={timer <= 10}>
          ⏱ {timer}s
        </div>
      {/if}
    </div>
    
    <div class="question-box">
      <p class="question-label">The Question:</p>
      <p class="question-text">{question.question || 'Loading question...'}</p>
    </div>
    
    {#if !hasSubmitted}
      <div class="form">
        <label for="lie-input">Write a believable fake answer:</label>
        <textarea
          id="lie-input"
          bind:value={lie}
          on:keypress={handleKeyPress}
          placeholder="Make it sound real..."
          maxlength={MAX_LENGTH * 2}
          disabled={isSubmitting}
          class:error={error || isOverLimit}
          rows="3"
        />
        
        <div class="input-footer">
          <span class="character-count" class:over={isOverLimit}>
            {charactersLeft} characters left
          </span>
          {#if error}
            <span class="error-message">{error}</span>
          {/if}
        </div>
        
        <button
          class="submit-button"
          on:click={handleSubmit}
          disabled={isSubmitting || !lie.trim() || isOverLimit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Lie'}
        </button>
        
        <p class="hint">💡 Tip: Make it sound like it could be the real answer!</p>
      </div>
    {:else}
      <div class="success-message">
        <div class="success-icon">✅</div>
        <h3>Lie Submitted!</h3>
        <p>Your lie:</p>
        <div class="submitted-lie">
          "{lie}"
        </div>
        <p class="waiting-text">Waiting for other players...</p>
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
  .submit-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .submit-card {
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
  
  .question-box {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    padding: 1.5rem;
    border-radius: 15px;
    margin-bottom: 1.5rem;
    box-shadow: 0 5px 20px rgba(240, 147, 251, 0.3);
  }
  
  .question-label {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .question-text {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.4;
  }
  
  .form {
    margin-top: 1.5rem;
  }
  
  label {
    display: block;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    transition: all 0.2s;
    box-sizing: border-box;
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
  }
  
  textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  textarea.error {
    border-color: #f56565;
  }
  
  textarea:disabled {
    background: #f7fafc;
    cursor: not-allowed;
  }
  
  .input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.25rem;
    margin-bottom: 1rem;
  }
  
  .character-count {
    font-size: 0.875rem;
    color: #718096;
  }
  
  .character-count.over {
    color: #f56565;
    font-weight: 600;
  }
  
  .error-message {
    color: #f56565;
    font-size: 0.875rem;
  }
  
  .submit-button {
    width: 100%;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 1rem;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(72, 187, 120, 0.4);
  }
  
  .submit-button:disabled {
    background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
    cursor: not-allowed;
    opacity: 0.8;
  }
  
  .hint {
    text-align: center;
    color: #718096;
    font-size: 0.875rem;
    margin-top: 1rem;
  }
  
  .success-message {
    text-align: center;
    padding: 2rem 0;
  }
  
  .success-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .success-message h3 {
    font-size: 1.5rem;
    color: #38a169;
    margin: 0 0 1rem 0;
  }
  
  .success-message p {
    color: #718096;
    margin: 0.5rem 0;
  }
  
  .submitted-lie {
    background: #f7fafc;
    padding: 1rem;
    border-radius: 10px;
    font-style: italic;
    color: #4a5568;
    margin: 1rem 0;
    border-left: 4px solid #667eea;
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
    .submit-card {
      padding: 1.5rem;
    }
    
    .title {
      font-size: 1.5rem;
    }
    
    .timer {
      font-size: 1.1rem;
      padding: 0.4rem 0.8rem;
    }
    
    .question-box {
      padding: 1.25rem;
    }
    
    .question-text {
      font-size: 1rem;
    }
  }
</style>