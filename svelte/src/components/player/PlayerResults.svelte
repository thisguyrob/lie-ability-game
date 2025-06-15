<script>
  export let revealData = {}
  export let playerData = {}
  export let onContinue = () => {}
  
  $: isCorrect = revealData.correctPlayers?.includes(playerData.id)
  $: pointsEarned = calculatePointsEarned()
  $: fooledPlayers = getFooledPlayers()
  
  function calculatePointsEarned() {
    let points = 0
    if (isCorrect) points += 100
    if (fooledPlayers.length > 0) points += fooledPlayers.length * 50
    return points
  }
  
  function getFooledPlayers() {
    if (!revealData.playerVotes || !playerData.lieSubmission) return []
    
    return Object.entries(revealData.playerVotes)
      .filter(([playerId, vote]) => 
        playerId !== playerData.id && 
        vote.optionId === playerData.lieSubmission.id
      )
      .map(([playerId]) => 
        revealData.players?.find(p => p.id === playerId)
      )
      .filter(Boolean)
  }
</script>

<div class="results-container">
  <div class="results-card">
    <div class="header">
      <h2 class="title">Round Results 🎉</h2>
    </div>
    
    <div class="main-result" class:correct={isCorrect} class:incorrect={!isCorrect}>
      <div class="result-icon">
        {isCorrect ? '✅' : '❌'}
      </div>
      <h3 class="result-text">
        {isCorrect ? 'You found the truth!' : 'You were fooled!'}
      </h3>
    </div>
    
    <div class="truth-reveal">
      <p class="truth-label">The correct answer was:</p>
      <div class="truth-box">
        {revealData.truth || 'Loading...'}
      </div>
    </div>
    
    {#if fooledPlayers.length > 0}
      <div class="fooled-section">
        <p class="fooled-label">You fooled {fooledPlayers.length} player{fooledPlayers.length > 1 ? 's' : ''}!</p>
        <div class="fooled-players">
          {#each fooledPlayers as player}
            <div class="fooled-player">
              <span class="player-avatar" style="background-color: {player.avatar.color}">
                {player.avatar.emoji}
              </span>
              <span class="player-name">{player.name}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <div class="points-section">
      <div class="points-earned">
        <span class="points-label">Points earned:</span>
        <span class="points-value">+{pointsEarned}</span>
      </div>
      {#if isCorrect}
        <p class="points-breakdown">+100 for finding the truth</p>
      {/if}
      {#if fooledPlayers.length > 0}
        <p class="points-breakdown">+{fooledPlayers.length * 50} for fooling {fooledPlayers.length} player{fooledPlayers.length > 1 ? 's' : ''}</p>
      {/if}
    </div>
    
    <button class="continue-button" on:click={onContinue}>
      Continue
    </button>
  </div>
</div>

<style>
  .results-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .results-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 500px;
  }
  
  .header {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #2d3748;
    margin: 0;
  }
  
  .main-result {
    text-align: center;
    padding: 1.5rem;
    border-radius: 15px;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .main-result.correct {
    background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
    border: 2px solid #48bb78;
  }
  
  .main-result.incorrect {
    background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
    border: 2px solid #f56565;
  }
  
  .result-icon {
    font-size: 3rem;
    margin-bottom: 0.75rem;
    animation: popIn 0.5s ease-out;
  }
  
  @keyframes popIn {
    0% { transform: scale(0); }
    80% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .result-text {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 700;
  }
  
  .main-result.correct .result-text {
    color: #38a169;
  }
  
  .main-result.incorrect .result-text {
    color: #e53e3e;
  }
  
  .truth-reveal {
    margin-bottom: 1.5rem;
  }
  
  .truth-label {
    color: #718096;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
    text-align: center;
  }
  
  .truth-box {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    padding: 1rem;
    border-radius: 12px;
    font-weight: 600;
    text-align: center;
    box-shadow: 0 5px 15px rgba(240, 147, 251, 0.3);
  }
  
  .fooled-section {
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .fooled-label {
    color: #2d3748;
    font-weight: 600;
    margin: 0 0 1rem 0;
  }
  
  .fooled-players {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }
  
  .fooled-player {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f7fafc;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 2px solid #e2e8f0;
  }
  
  .player-avatar {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }
  
  .player-name {
    font-size: 0.9rem;
    color: #4a5568;
    font-weight: 500;
  }
  
  .points-section {
    background: #f7fafc;
    padding: 1.25rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .points-earned {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .points-label {
    color: #4a5568;
    font-weight: 600;
  }
  
  .points-value {
    font-size: 2rem;
    font-weight: 800;
    color: #48bb78;
    animation: countUp 0.5s ease-out;
  }
  
  @keyframes countUp {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .points-breakdown {
    color: #718096;
    font-size: 0.875rem;
    margin: 0.25rem 0;
  }
  
  .continue-button {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  
  .continue-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
  
  @media (max-width: 480px) {
    .results-card {
      padding: 1.5rem;
    }
    
    .title {
      font-size: 1.5rem;
    }
    
    .result-icon {
      font-size: 2.5rem;
    }
    
    .result-text {
      font-size: 1.25rem;
    }
    
    .points-value {
      font-size: 1.75rem;
    }
  }
</style>