<script>
  export let gameEndData;
  export let currentPlayer;
  
  $: data = gameEndData;
  $: finalStandings = [...data.finalStandings].sort((a, b) => b.points - a.points);
  $: myRank = finalStandings.findIndex(p => p.id === currentPlayer?.id) + 1;
  $: isWinner = myRank === 1;
  $: isTopThree = myRank <= 3;
  
  function getRankDisplay(rank) {
    switch (rank) {
      case 1: return '🏆 Champion';
      case 2: return '🥈 Runner-up';
      case 3: return '🥉 Third Place';
      default: return `#${rank}`;
    }
  }
  
  function getRankEmoji(rank) {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎮';
    }
  }
  
  function getEncouragementMessage(rank, totalPlayers) {
    if (rank === 1) return "You're the ultimate deceiver! 🎭";
    if (rank === 2) return "So close to victory! Great job! 🌟";
    if (rank === 3) return "Solid performance! Well played! 🎯";
    if (rank <= totalPlayers / 2) return "Nice work! You're getting good at this! 👏";
    return "Thanks for playing! Practice makes perfect! 🎲";
  }
</script>

<div class="game-end-container">
  <div class="game-end-card">
    <div class="celebration-header">
      <div class="celebration-icon">🎊</div>
      <h1 class="game-complete-title">Game Complete!</h1>
    </div>
    
    <div class="my-result-section">
      <div class="result-card" class:winner={isWinner} class:podium={isTopThree}>
        <div class="result-rank">
          <span class="rank-emoji">{getRankEmoji(myRank)}</span>
          <span class="rank-text">{getRankDisplay(myRank)}</span>
        </div>
        
        <div class="my-final-info">
          <div class="my-avatar" style="background-color: {currentPlayer?.avatar?.color}">
            <span class="my-emoji">{currentPlayer?.avatar?.emoji}</span>
          </div>
          <div class="my-details">
            <div class="my-name">You</div>
            <div class="final-points">{currentPlayer?.points || 0} points</div>
          </div>
        </div>
        
        <div class="encouragement">
          <p class="encouragement-text">
            {getEncouragementMessage(myRank, finalStandings.length)}
          </p>
        </div>
      </div>
    </div>
    
    <div class="winner-spotlight" class:hidden={isWinner}>
      <h3 class="winner-title">🏆 Game Champion</h3>
      <div class="winner-info">
        <div class="winner-avatar" style="background-color: {data.winner.avatar.color}">
          <span class="winner-emoji">{data.winner.avatar.emoji}</span>
        </div>
        <div class="winner-details">
          <div class="winner-name">{data.winner.name}</div>
          <div class="winner-points">{data.winner.points} points</div>
        </div>
      </div>
    </div>
    
    <div class="final-standings">
      <h3 class="standings-title">Final Standings</h3>
      <div class="standings-list">
        {#each finalStandings.slice(0, 5) as player, index}
          <div 
            class="standing-item"
            class:is-me={player.id === currentPlayer?.id}
            style="animation-delay: {index * 0.1}s"
          >
            <div class="standing-rank">
              <span class="rank-number">{index + 1}</span>
              <span class="rank-icon">{getRankEmoji(index + 1)}</span>
            </div>
            
            <div class="standing-player">
              <div class="standing-avatar" style="background-color: {player.avatar.color}">
                <span class="standing-emoji">{player.avatar.emoji}</span>
              </div>
              <div class="standing-info">
                <div class="standing-name">
                  {player.name}
                  {#if player.id === currentPlayer?.id}
                    <span class="you-badge">You</span>
                  {/if}
                </div>
                <div class="standing-stats">
                  <span class="stat">🤥 {player.liesSubmitted || 0}</span>
                  <span class="stat">🎯 {player.truthsFound || 0}</span>
                </div>
              </div>
            </div>
            
            <div class="standing-points">
              <span class="points-value">{player.points}</span>
              <span class="points-label">pts</span>
            </div>
          </div>
        {/each}
        
        {#if finalStandings.length > 5}
          <div class="more-players">
            +{finalStandings.length - 5} more player{finalStandings.length - 5 !== 1 ? 's' : ''}
          </div>
        {/if}
      </div>
    </div>
    
    <div class="game-stats">
      <h3 class="stats-title">Your Game Stats</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-value">{myRank}</div>
          <div class="stat-label">Final Rank</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-value">{currentPlayer?.points || 0}</div>
          <div class="stat-label">Total Points</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🤥</div>
          <div class="stat-value">{currentPlayer?.liesSubmitted || 0}</div>
          <div class="stat-label">Lies Created</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔍</div>
          <div class="stat-value">{currentPlayer?.truthsFound || 0}</div>
          <div class="stat-label">Truths Found</div>
        </div>
      </div>
    </div>
    
    <div class="thanks-section">
      <h3 class="thanks-title">Thanks for Playing! 🎉</h3>
      <p class="thanks-message">
        Hope you had a blast creating lies and hunting for truth! Want to play again? 
        Ask the host to start a new game!
      </p>
      
      <div class="play-again-hint">
        <div class="hint-icon">💡</div>
        <p class="hint-text">Pro tip: The best lies are believable but wrong!</p>
      </div>
    </div>
  </div>
</div>

<style>
  .game-end-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeIn 1s ease;
  }
  
  .game-end-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  .celebration-header {
    margin-bottom: 2rem;
  }
  
  .celebration-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }
  
  .game-complete-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin: 0;
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    from {
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    to {
      text-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    }
  }
  
  .my-result-section {
    margin-bottom: 2rem;
  }
  
  .result-card {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    border-radius: 20px;
    padding: 2rem;
    transition: all 0.3s ease;
  }
  
  .result-card.winner {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    border-color: #f59e0b;
    color: white;
    animation: winnerPulse 2s ease-in-out infinite alternate;
  }
  
  .result-card.podium:not(.winner) {
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
    border-color: #94a3b8;
  }
  
  @keyframes winnerPulse {
    0% {
      transform: scale(1);
      box-shadow: 0 8px 30px rgba(251, 191, 36, 0.4);
    }
    100% {
      transform: scale(1.02);
      box-shadow: 0 12px 40px rgba(251, 191, 36, 0.6);
    }
  }
  
  .result-rank {
    margin-bottom: 1.5rem;
  }
  
  .rank-emoji {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
    animation: bounce 2s infinite;
  }
  
  .rank-text {
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .my-final-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .my-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
  
  .my-emoji {
    font-size: 1.8rem;
  }
  
  .my-details {
    text-align: left;
  }
  
  .my-name {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .final-points {
    font-size: 1.8rem;
    font-weight: 700;
    color: #667eea;
  }
  
  .result-card.winner .final-points {
    color: white;
  }
  
  .encouragement-text {
    font-size: 1.1rem;
    margin: 0;
    opacity: 0.9;
  }
  
  .winner-spotlight {
    background: linear-gradient(135deg, #667eea20, #764ba220);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
  }
  
  .winner-spotlight.hidden {
    display: none;
  }
  
  .winner-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .winner-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  
  .winner-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
  
  .winner-emoji {
    font-size: 1.5rem;
  }
  
  .winner-details {
    text-align: left;
  }
  
  .winner-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .winner-points {
    font-size: 1.4rem;
    font-weight: 700;
    color: #667eea;
  }
  
  .final-standings {
    margin-bottom: 2rem;
    text-align: left;
  }
  
  .standings-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }
  
  .standings-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .standing-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(248, 250, 252, 0.7);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.3s ease;
    animation: slideInUp 0.5s ease both;
  }
  
  .standing-item.is-me {
    border: 2px solid #667eea;
    background: linear-gradient(135deg, #667eea20, #764ba220);
    transform: scale(1.02);
  }
  
  .standing-rank {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    width: 60px;
  }
  
  .rank-number {
    font-size: 1rem;
    font-weight: 700;
    color: #666;
  }
  
  .rank-icon {
    font-size: 1.2rem;
  }
  
  .standing-player {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }
  
  .standing-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
  }
  
  .standing-emoji {
    font-size: 1rem;
  }
  
  .standing-info {
    flex: 1;
    min-width: 0;
  }
  
  .standing-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .you-badge {
    background: #667eea;
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 700;
  }
  
  .standing-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #666;
  }
  
  .stat {
    font-weight: 500;
  }
  
  .standing-points {
    text-align: right;
    flex-shrink: 0;
  }
  
  .points-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    display: block;
  }
  
  .points-label {
    font-size: 0.7rem;
    color: #666;
  }
  
  .more-players {
    text-align: center;
    padding: 1rem;
    color: #666;
    font-style: italic;
    background: rgba(248, 250, 252, 0.5);
    border-radius: 12px;
    border: 1px dashed #e2e8f0;
  }
  
  .game-stats {
    margin-bottom: 2rem;
  }
  
  .stats-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1.5rem 0;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;
    border: 1px solid #e2e8f0;
  }
  
  .stat-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: #666;
  }
  
  .thanks-section {
    text-align: center;
  }
  
  .thanks-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .thanks-message {
    font-size: 1rem;
    color: #666;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }
  
  .play-again-hint {
    background: linear-gradient(135deg, #22c55e20, #4ade8020);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .hint-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .hint-text {
    font-size: 0.9rem;
    color: #374151;
    margin: 0;
    text-align: left;
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
    .game-end-container {
      padding: 0.5rem;
    }
    
    .game-end-card {
      padding: 1.5rem;
    }
    
    .game-complete-title {
      font-size: 2rem;
    }
    
    .result-card {
      padding: 1.5rem;
    }
    
    .my-final-info {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .my-details {
      text-align: center;
    }
    
    .standing-item {
      gap: 0.75rem;
      padding: 0.75rem;
    }
    
    .standing-stats {
      gap: 0.75rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .stat-card {
      padding: 1rem;
    }
    
    .play-again-hint {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
    
    .hint-text {
      text-align: center;
    }
  }
</style>