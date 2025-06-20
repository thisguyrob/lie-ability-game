<script>
  export let data;
  
  // Sort players by points (descending) once data is available
  $: sortedPlayers = [...(data?.players || [])].sort((a, b) => b.points - a.points);
  
  function getRankDisplay(rank) {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  }
  
  function getRankClass(rank) {
    switch (rank) {
      case 1: return 'rank-first';
      case 2: return 'rank-second';
      case 3: return 'rank-third';
      default: return 'rank-other';
    }
  }
</script>

<div class="scoreboard-container">
  <div class="scoreboard-header">
    <h2 class="scoreboard-title">
      {#if data.isGameEnd}
        🎊 Game Complete! 🎊
      {:else}
        Question {data.question || 1} Complete!
      {/if}
    </h2>
    <p class="round-progress">
      {(() => {
        const round = data.round || 1;
        const question = data.question || 1;
        const totalRounds = data.totalRounds || 3;
        const questionsPerRound = data.questionsPerRound || 8;
        
        // Calculate questions remaining in current round
        const questionsRemainingInRound = questionsPerRound - question;
        
        // Calculate rounds remaining until The Big Lie (final round)
        const roundsUntilFinal = totalRounds - round;
        
        let progressText = '';
        
        if (questionsRemainingInRound > 0) {
          progressText += `${questionsRemainingInRound} question${questionsRemainingInRound !== 1 ? 's' : ''} left in round`;
        }
        
        if (roundsUntilFinal > 0) {
          if (progressText) progressText += ' • ';
          if (roundsUntilFinal === 1) {
            progressText += 'Next up: The Big Lie!';
          } else {
            progressText += `${roundsUntilFinal} round${roundsUntilFinal !== 1 ? 's' : ''} until The Big Lie`;
          }
        } else if (round === totalRounds) {
          // We're in The Big Lie round
          if (progressText) progressText += ' • ';
          progressText += 'The Big Lie!';
        }
        
        if (data.isGameEnd) {
          return '🏆 Final Results 🏆';
        }
        
        return progressText || 'Final question complete!';
      })()}
    </p>
  </div>
  
  <div class="leaderboard">
    <div class="leaderboard-header">
      <h3 class="leaderboard-title">🏆 Leaderboard</h3>
    </div>
    
    <div class="players-list">
      {#each sortedPlayers as player, index}
        <div 
          class="player-row {getRankClass(index + 1)}" 
          style="animation-delay: {index * 0.1}s"
        >
          <div class="player-rank">
            <span class="rank-display">{getRankDisplay(index + 1)}</span>
          </div>
          
          <div class="player-info">
            <div class="player-avatar" style="background-color: {player.avatar?.color || '#667eea'}">
              <span class="player-emoji">{player.avatar?.emoji || '😀'}</span>
            </div>
            <div class="player-details">
              <div class="player-name">{player.name}</div>
              {#if player.lastLie}
                <div class="last-lie">
                  "{player.lastLie}" 
                  {#if player.likesReceived && player.likesReceived > 0}
                    <span class="likes-indicator">👍🏻</span>
                  {/if}
                </div>
              {/if}
            </div>
          </div>
          
          <div class="player-stats">
            <div class="points-total">{player.points}</div>
            <div class="points-label">points</div>
            {#if player.pointsThisRound}
              <div class="points-gained">+{player.pointsThisRound}</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  {#if !data.isGameEnd}
    <div class="continue-indicator">
      <div class="continue-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>
        {#if data.round < data.totalRounds}
          Get ready for Round {data.round + 1}...
        {:else}
          Preparing final results...
        {/if}
      </p>
    </div>
  {:else}
    <div class="game-complete-footer">
      <div class="winner-spotlight">
        <div class="winner-crown">👑</div>
        <h3 class="winner-name">{sortedPlayers[0]?.name} is the Champion!</h3>
        <p class="winner-message">Congratulations on your masterful deception!</p>
      </div>
      <div class="play-again-section">
        <p class="thanks-message">Thanks for playing Lie-Ability! 🎉</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .scoreboard-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    animation: fadeIn 0.8s ease;
  }
  
  .scoreboard-header {
    text-align: center;
  }
  
  .scoreboard-title {
    font-size: 3rem;
    font-weight: 700;
    color: white;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  
  .round-progress {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }
  
  .leaderboard {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .leaderboard-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    padding: 1.5rem;
    text-align: center;
  }
  
  .leaderboard-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: white;
    margin: 0;
  }
  
  .players-list {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .player-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    border-radius: 16px;
    transition: all 0.3s ease;
    animation: slideInUp 0.6s ease both;
    position: relative;
    overflow: hidden;
  }
  
  .player-row::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: currentColor;
    opacity: 0.3;
  }
  
  .rank-first {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: white;
  }
  
  .rank-second {
    background: linear-gradient(135deg, #e5e7eb, #d1d5db);
    color: #374151;
  }
  
  .rank-third {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: white;
  }
  
  .rank-other {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    color: #374151;
  }
  
  .player-rank {
    flex-shrink: 0;
  }
  
  .rank-display {
    font-size: 2rem;
    font-weight: 700;
  }
  
  .rank-first .rank-display {
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-5px);
    }
    60% {
      transform: translateY(-3px);
    }
  }
  
  .player-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    min-width: 0;
  }
  
  .player-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
  }
  
  .player-emoji {
    font-size: 1.8rem;
  }
  
  .player-details {
    flex: 1;
    min-width: 0;
  }
  
  .player-name {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .last-lie {
    font-size: 1rem;
    opacity: 0.8;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  
  .rank-first .likes-indicator,
  .rank-second .likes-indicator,
  .rank-third .likes-indicator {
    color: inherit;
    opacity: 0.9;
  }
  
  .player-stats {
    text-align: right;
    flex-shrink: 0;
  }
  
  .points-total {
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1;
  }
  
  .points-label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 0.25rem;
  }
  
  .points-gained {
    background: rgba(34, 197, 94, 0.2);
    color: #059669;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    display: inline-block;
  }
  
  .rank-first .points-gained,
  .rank-second .points-gained,
  .rank-third .points-gained {
    background: rgba(255, 255, 255, 0.2);
    color: inherit;
  }
  
  .continue-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .continue-dots {
    display: flex;
    gap: 0.5rem;
  }
  
  .continue-dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    animation: dot-bounce 1.4s infinite ease-in-out both;
  }
  
  .continue-dots span:nth-child(1) { animation-delay: -0.32s; }
  .continue-dots span:nth-child(2) { animation-delay: -0.16s; }
  
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
  
  .continue-indicator p {
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0;
  }
  
  .game-complete-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    animation: fadeIn 1s ease;
  }
  
  .winner-spotlight {
    text-align: center;
    animation: winnerAppear 1s ease;
  }
  
  @keyframes winnerAppear {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .winner-crown {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }
  
  .winner-name {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  
  .winner-message {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
  
  .play-again-section {
    text-align: center;
  }
  
  .thanks-message {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.8);
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
    .scoreboard-title {
      font-size: 2.5rem;
    }
    
    .round-progress {
      font-size: 1.1rem;
    }
    
    .leaderboard-title {
      font-size: 1.5rem;
    }
    
    .player-row {
      gap: 1rem;
      padding: 1.25rem;
    }
    
    .rank-display {
      font-size: 1.6rem;
    }
    
    .player-avatar {
      width: 50px;
      height: 50px;
    }
    
    .player-emoji {
      font-size: 1.5rem;
    }
    
    .player-name {
      font-size: 1.2rem;
    }
    
    .last-lie {
      font-size: 0.9rem;
    }
    
    .likes-indicator {
      font-size: 0.85rem;
    }
    
    .points-total {
      font-size: 1.8rem;
    }
  }
  
  @media (max-width: 480px) {
    .scoreboard-container {
      gap: 1.5rem;
    }
    
    .scoreboard-title {
      font-size: 2rem;
    }
    
    .player-row {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .player-info {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .player-stats {
      text-align: center;
    }
    
    .last-lie {
      text-align: center;
      white-space: normal;
      overflow: visible;
      text-overflow: initial;
    }
  }
</style>