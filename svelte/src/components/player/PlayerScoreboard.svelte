<script>
  export let scoreboardData;
  export let currentPlayer;
  
  $: data = scoreboardData;
  $: sortedPlayers = [...data.players].sort((a, b) => b.points - a.points);
  $: myRank = sortedPlayers.findIndex(p => p.id === currentPlayer?.id) + 1;
  $: myPosition = getRankDisplay(myRank);
  
  function getRankDisplay(rank) {
    switch (rank) {
      case 1: return '🥇 1st';
      case 2: return '🥈 2nd';
      case 3: return '🥉 3rd';
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
  
  function isMyPlayer(player) {
    return player.id === currentPlayer?.id;
  }
</script>

<div class="scoreboard-container">
  <div class="scoreboard-card">
    <div class="round-header">
      <div class="round-icon">🏆</div>
      <h2 class="round-title">Round {data.round} Complete!</h2>
      <p class="round-progress">
        {#if data.round < data.totalRounds}
          Next: Round {data.round + 1}
        {:else}
          Final results coming up!
        {/if}
      </p>
    </div>
    
    <div class="my-performance">
      <div class="performance-card" class:highlight={myRank <= 3}>
        <div class="performance-rank">
          <span class="rank-display">{myPosition}</span>
        </div>
        <div class="performance-info">
          <div class="my-avatar" style="background-color: {currentPlayer?.avatar?.color}">
            <span class="my-emoji">{currentPlayer?.avatar?.emoji}</span>
          </div>
          <div class="performance-details">
            <div class="my-name">You</div>
            <div class="my-points">{currentPlayer?.points || 0} points</div>
            {#if currentPlayer?.pointsThisRound}
              <div class="points-gained">+{currentPlayer.pointsThisRound} this round</div>
            {/if}
          </div>
        </div>
      </div>
    </div>
    
    <div class="leaderboard-section">
      <h3 class="leaderboard-title">Full Leaderboard</h3>
      <div class="players-list">
        {#each sortedPlayers as player, index}
          <div 
            class="player-row {getRankClass(index + 1)}"
            class:is-me={isMyPlayer(player)}
            style="animation-delay: {index * 0.1}s"
          >
            <div class="player-rank">
              <span class="rank-number">{getRankDisplay(index + 1)}</span>
            </div>
            
            <div class="player-info">
              <div class="player-avatar" style="background-color: {player.avatar.color}">
                <span class="player-emoji">{player.avatar.emoji}</span>
              </div>
              <div class="player-details">
                <div class="player-name">
                  {player.name}
                  {#if isMyPlayer(player)}
                    <span class="you-badge">You</span>
                  {/if}
                </div>
                {#if player.lastLie}
                  <div class="last-lie">"{player.lastLie}"</div>
                {/if}
              </div>
            </div>
            
            <div class="player-stats">
              <div class="points-total">{player.points}</div>
              <div class="points-label">pts</div>
              {#if player.pointsThisRound}
                <div class="points-round">+{player.pointsThisRound}</div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="round-summary">
      <h4 class="summary-title">Round {data.round} Summary</h4>
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-icon">❓</span>
          <span class="stat-value">{data.question || 8}</span>
          <span class="stat-label">Questions</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🤥</span>
          <span class="stat-value">{data.totalLies || 0}</span>
          <span class="stat-label">Lies Created</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🎯</span>
          <span class="stat-value">{data.truthsFound || 0}</span>
          <span class="stat-label">Truths Found</span>
        </div>
      </div>
    </div>
    
    <div class="continue-indicator">
      <div class="continue-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p class="continue-text">
        {#if data.round < data.totalRounds}
          Get ready for Round {data.round + 1}...
        {:else}
          Calculating final results...
        {/if}
      </p>
    </div>
  </div>
</div>

<style>
  .scoreboard-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeIn 0.8s ease;
  }
  
  .scoreboard-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  .round-header {
    margin-bottom: 2rem;
  }
  
  .round-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }
  
  .round-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 0.5rem 0;
  }
  
  .round-progress {
    font-size: 1rem;
    color: #666;
    margin: 0;
  }
  
  .my-performance {
    margin-bottom: 2rem;
  }
  
  .performance-card {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
  }
  
  .performance-card.highlight {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    border-color: #f59e0b;
    color: white;
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    0% {
      box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
    }
    100% {
      box-shadow: 0 8px 30px rgba(251, 191, 36, 0.6);
    }
  }
  
  .performance-rank {
    flex-shrink: 0;
  }
  
  .rank-display {
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .performance-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }
  
  .my-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
  }
  
  .my-emoji {
    font-size: 1.5rem;
  }
  
  .performance-details {
    text-align: left;
    flex: 1;
  }
  
  .my-name {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .my-points {
    font-size: 1.4rem;
    font-weight: 700;
    color: #667eea;
  }
  
  .performance-card.highlight .my-points {
    color: white;
  }
  
  .points-gained {
    font-size: 0.9rem;
    opacity: 0.8;
    font-weight: 600;
  }
  
  .leaderboard-section {
    margin-bottom: 2rem;
    text-align: left;
  }
  
  .leaderboard-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }
  
  .players-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .player-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    animation: slideInUp 0.5s ease both;
    position: relative;
  }
  
  .player-row.rank-first {
    background: linear-gradient(135deg, #fbbf2420, #f59e0b20);
    border: 1px solid rgba(251, 191, 36, 0.3);
  }
  
  .player-row.rank-second {
    background: linear-gradient(135deg, #e5e7eb20, #d1d5db20);
    border: 1px solid rgba(209, 213, 219, 0.3);
  }
  
  .player-row.rank-third {
    background: linear-gradient(135deg, #f9731620, #ea580c20);
    border: 1px solid rgba(249, 115, 22, 0.3);
  }
  
  .player-row.rank-other {
    background: rgba(248, 250, 252, 0.7);
    border: 1px solid #e2e8f0;
  }
  
  .player-row.is-me {
    border: 2px solid #667eea;
    background: linear-gradient(135deg, #667eea20, #764ba220);
    transform: scale(1.02);
  }
  
  .player-rank {
    flex-shrink: 0;
    width: 40px;
  }
  
  .rank-number {
    font-size: 1rem;
    font-weight: 700;
    color: #666;
  }
  
  .player-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }
  
  .player-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
  }
  
  .player-emoji {
    font-size: 1rem;
  }
  
  .player-details {
    flex: 1;
    min-width: 0;
  }
  
  .player-name {
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
  
  .last-lie {
    font-size: 0.8rem;
    color: #666;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .player-stats {
    text-align: right;
    flex-shrink: 0;
  }
  
  .points-total {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
  }
  
  .points-label {
    font-size: 0.7rem;
    color: #666;
  }
  
  .points-round {
    font-size: 0.8rem;
    color: #22c55e;
    font-weight: 600;
  }
  
  .round-summary {
    margin-bottom: 2rem;
  }
  
  .summary-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .summary-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 12px;
  }
  
  .stat-icon {
    font-size: 1.2rem;
  }
  
  .stat-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: #333;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: #666;
    text-align: center;
  }
  
  .continue-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .continue-dots {
    display: flex;
    gap: 0.5rem;
  }
  
  .continue-dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #667eea;
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
  
  .continue-text {
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
    .scoreboard-container {
      padding: 0.5rem;
    }
    
    .scoreboard-card {
      padding: 1.5rem;
    }
    
    .round-title {
      font-size: 1.6rem;
    }
    
    .performance-card {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .performance-info {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .performance-details {
      text-align: center;
    }
    
    .player-row {
      gap: 0.75rem;
      padding: 0.75rem;
    }
    
    .last-lie {
      white-space: normal;
      overflow: visible;
      text-overflow: initial;
    }
    
    .summary-stats {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .stat-item {
      flex-direction: row;
      justify-content: center;
      gap: 0.5rem;
    }
  }
</style>