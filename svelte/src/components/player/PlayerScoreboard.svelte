<script>
  export let gameState;
  export let myPlayerData;
  export let isGameOver = false;
  
  // Sort players by score (descending)
  $: sortedPlayers = (gameState.players || [])
    .filter(p => p.connected || p.score > 0)
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  
  // Find my position in the rankings
  $: myPosition = sortedPlayers.findIndex(p => p.id === myPlayerData.id) + 1;
  $: myStats = sortedPlayers.find(p => p.id === myPlayerData.id) || myPlayerData;
  
  // Get ranking positions with ties handled
  function getRankingPositions(players) {
    const rankings = [];
    let currentRank = 1;
    
    for (let i = 0; i < players.length; i++) {
      if (i > 0 && players[i].score !== players[i - 1].score) {
        currentRank = i + 1;
      }
      rankings.push({
        ...players[i],
        rank: currentRank,
        position: i + 1
      });
    }
    
    return rankings;
  }
  
  $: rankedPlayers = getRankingPositions(sortedPlayers);
  
  // Get medal/trophy for ranking
  function getRankIcon(rank) {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  }
  
  // Get rank color
  function getRankColor(rank) {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return 'rgba(255, 255, 255, 0.8)';
    }
  }
  
  // Get status message
  function getStatusMessage() {
    if (isGameOver) {
      if (myPosition === 1) {
        return { icon: '🎉', text: "You won the game!", color: 'success' };
      } else if (myPosition <= 3) {
        return { icon: '🎊', text: `${myPosition === 2 ? '2nd' : '3rd'} place finish!`, color: 'warning' };
      } else {
        return { icon: '👏', text: "Great effort!", color: 'neutral' };
      }
    } else {
      if (myPosition === 1) {
        return { icon: '👑', text: "You're in the lead!", color: 'success' };
      } else if (myPosition <= 3) {
        return { icon: '⭐', text: "You're in the top 3!", color: 'warning' };
      } else {
        return { icon: '💪', text: "Keep going strong!", color: 'neutral' };
      }
    }
  }
  
  $: statusMessage = getStatusMessage();
  
  // Calculate next round multiplier
  $: nextRoundMultiplier = gameState.round < 3 ? gameState.round + 1 : 3;
  $: nextLiePoints = 500 * nextRoundMultiplier;
  $: nextTruthPoints = 1000 * nextRoundMultiplier;
</script>

<div class="scoreboard-container">
  <!-- Header -->
  <div class="scoreboard-header fade-in">
    <h1>
      {#if isGameOver}
        🏁 Final Results
      {:else}
        📊 Scoreboard
      {/if}
    </h1>
    <p>
      {#if isGameOver}
        Thanks for playing! Here's how everyone finished.
      {:else}
        Round {gameState.round || 1} complete • {gameState.round < 3 ? 'Next round coming up' : 'Final round next'}
      {/if}
    </p>
  </div>
  
  <!-- My Status -->
  <div class="my-status slide-up">
    <div class="status-card glass" class:winner={myPosition === 1 && isGameOver} 
         class:podium={myPosition <= 3}>
      <div class="status-icon" style="color: {statusMessage.color === 'success' ? 'var(--success)' : statusMessage.color === 'warning' ? 'var(--warning)' : 'var(--white)'}">
        {statusMessage.icon}
      </div>
      <h2>{statusMessage.text}</h2>
      <div class="my-ranking">
        <div class="rank-display">
          <span class="rank-icon" style="color: {getRankColor(myPosition)}">
            {getRankIcon(myPosition)}
          </span>
          <span class="rank-text">
            {myPosition === 1 ? '1st' : myPosition === 2 ? '2nd' : myPosition === 3 ? '3rd' : `${myPosition}th`} Place
          </span>
        </div>
        <div class="score-display">
          <span class="score-number">{myStats.score || 0}</span>
          <span class="score-label">points</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Full Rankings -->
  <div class="rankings-section scale-in">
    <div class="rankings-card glass">
      <h3>🏆 Final Rankings</h3>
      <div class="rankings-list">
        {#each rankedPlayers as player, index}
          <div 
            class="ranking-item"
            class:me={player.id === myPlayerData.id}
            class:winner={player.rank === 1}
            class:podium={player.rank <= 3}
            style="animation-delay: {index * 100}ms"
          >
            <div class="rank-info">
              <span class="rank-position" style="color: {getRankColor(player.rank)}">
                {getRankIcon(player.rank)}
              </span>
            </div>
            
            <div class="player-info">
              <div 
                class="player-avatar"
                style="background: {player.avatar.color}"
              >
                {player.avatar.emoji}
              </div>
              <div class="player-details">
                <div class="player-name">
                  {player.id === myPlayerData.id ? 'You' : player.name}
                  {#if player.id === myPlayerData.id}
                    <span class="me-badge">👤</span>
                  {/if}
                </div>
                <div class="player-stats">
                  <span class="stat-item">
                    {player.score || 0} points
                  </span>
                  {#if player.lastLie}
                    <span class="stat-item">
                      Last lie: "{player.lastLie}"
                    </span>
                  {/if}
                </div>
              </div>
            </div>
            
            <div class="score-info">
              <div class="score-value">{player.score || 0}</div>
              {#if player.rank === 1 && !isGameOver}
                <div class="leader-crown">👑</div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <!-- Next Round Info (if not game over) -->
  {#if !isGameOver && gameState.round < 3}
    <div class="next-round-info slide-up">
      <div class="info-card glass">
        <h3>⚡ Next Round</h3>
        <div class="round-details">
          <div class="round-number">
            <span class="round-label">Round</span>
            <span class="round-value">{gameState.round + 1}</span>
          </div>
          <div class="multiplier-info">
            <div class="multiplier-item">
              <span class="multiplier-label">Fooling others:</span>
              <span class="multiplier-value">{nextLiePoints} pts each</span>
            </div>
            <div class="multiplier-item">
              <span class="multiplier-label">Finding truth:</span>
              <span class="multiplier-value">{nextTruthPoints} pts</span>
            </div>
          </div>
        </div>
        <p class="round-encouragement">
          {myPosition === 1 ? 'Defend your lead!' : myPosition <= 3 ? 'Climb higher!' : 'Make your move!'}
        </p>
      </div>
    </div>
  {/if}
  
  <!-- Game Summary (if game over) -->
  {#if isGameOver}
    <div class="game-summary slide-up">
      <div class="summary-card glass">
        <h3>🎮 Game Summary</h3>
        <div class="summary-stats">
          <div class="summary-item">
            <span class="summary-emoji">🏆</span>
            <span class="summary-text">
              Winner: {rankedPlayers[0]?.id === myPlayerData.id ? 'You' : rankedPlayers[0]?.name}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-emoji">👥</span>
            <span class="summary-text">{rankedPlayers.length} players competed</span>
          </div>
          <div class="summary-item">
            <span class="summary-emoji">🎯</span>
            <span class="summary-text">3 rounds completed</span>
          </div>
        </div>
        <p class="thank-you">Thanks for playing Lie-Ability! 🎉</p>
      </div>
    </div>
  {/if}
  
  <!-- Game Context -->
  <div class="game-context">
    <div class="context-items">
      {#if !isGameOver}
        <div class="context-item">
          <span class="context-emoji">📈</span>
          <span>Points multiply each round</span>
        </div>
        <div class="context-item">
          <span class="context-emoji">🎲</span>
          <span>Get ready for round {gameState.round + 1}</span>
        </div>
      {:else}
        <div class="context-item">
          <span class="context-emoji">🎊</span>
          <span>Game completed</span>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .scoreboard-container {
    height: 100%;
    overflow-y: auto;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  
  .scoreboard-header {
    text-align: center;
  }
  
  .scoreboard-header h1 {
    color: var(--white);
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-3);
    font-weight: 900;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .scoreboard-header p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
    font-weight: 500;
  }
  
  .status-card {
    padding: var(--space-6);
    border-radius: var(--radius-2xl);
    text-align: center;
    position: relative;
    transition: all var(--transition);
  }
  
  .status-card.winner {
    background: rgba(255, 215, 0, 0.15);
    border: 2px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
  }
  
  .status-card.podium {
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .status-icon {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--space-3);
    display: block;
    animation: bounce-in 0.8s ease-out;
  }
  
  .status-card h2 {
    color: var(--white);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-4);
    font-weight: 700;
  }
  
  .my-ranking {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }
  
  .rank-display,
  .score-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }
  
  .rank-icon {
    font-size: var(--font-size-3xl);
    font-weight: 900;
  }
  
  .rank-text {
    color: var(--white);
    font-weight: 700;
    font-size: var(--font-size-lg);
  }
  
  .score-number {
    color: var(--white);
    font-size: var(--font-size-3xl);
    font-weight: 900;
    line-height: 1;
  }
  
  .score-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-base);
    font-weight: 600;
  }
  
  .rankings-card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
  }
  
  .rankings-card h3 {
    color: var(--white);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
    font-weight: 700;
    text-align: center;
  }
  
  .rankings-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .ranking-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-lg);
    transition: all var(--transition);
    animation: slide-up 0.3s ease-out;
  }
  
  .ranking-item.me {
    background: rgba(102, 126, 234, 0.2);
    border-color: var(--primary);
    box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
  }
  
  .ranking-item.winner {
    background: rgba(255, 215, 0, 0.15);
    border-color: rgba(255, 215, 0, 0.4);
  }
  
  .ranking-item.podium:not(.me) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .rank-info {
    flex-shrink: 0;
    width: 40px;
    text-align: center;
  }
  
  .rank-position {
    font-size: var(--font-size-xl);
    font-weight: 900;
  }
  
  .player-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex: 1;
    min-width: 0;
  }
  
  .player-avatar {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xl);
    border: 2px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
  }
  
  .player-details {
    flex: 1;
    min-width: 0;
  }
  
  .player-name {
    color: var(--white);
    font-weight: 700;
    font-size: var(--font-size-base);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-1);
  }
  
  .me-badge {
    font-size: var(--font-size-sm);
  }
  
  .player-stats {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
  
  .stat-item {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-xs);
    line-height: 1.2;
  }
  
  .score-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    flex-shrink: 0;
  }
  
  .score-value {
    color: var(--white);
    font-size: var(--font-size-xl);
    font-weight: 900;
  }
  
  .leader-crown {
    font-size: var(--font-size-base);
    animation: bounce 2s infinite;
  }
  
  .info-card,
  .summary-card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
    text-align: center;
  }
  
  .info-card h3,
  .summary-card h3 {
    color: var(--white);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
    font-weight: 700;
  }
  
  .round-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }
  
  .round-number {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }
  
  .round-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-base);
    font-weight: 600;
  }
  
  .round-value {
    color: var(--white);
    font-size: var(--font-size-4xl);
    font-weight: 900;
  }
  
  .multiplier-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .multiplier-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2);
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius);
  }
  
  .multiplier-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
    font-weight: 500;
  }
  
  .multiplier-value {
    color: var(--white);
    font-size: var(--font-size-sm);
    font-weight: 700;
  }
  
  .round-encouragement {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
    font-weight: 600;
    font-style: italic;
    margin: 0;
  }
  
  .summary-stats {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }
  
  .summary-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
  }
  
  .summary-emoji {
    font-size: var(--font-size-lg);
  }
  
  .summary-text {
    color: var(--white);
    font-size: var(--font-size-base);
    font-weight: 500;
  }
  
  .thank-you {
    color: var(--white);
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0;
  }
  
  .game-context {
    margin-top: auto;
  }
  
  .context-items {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }
  
  .context-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
    font-weight: 500;
    background: rgba(255, 255, 255, 0.1);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
  }
  
  .context-emoji {
    font-size: var(--font-size-base);
  }
  
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
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
  
  @media (max-width: 768px) {
    .scoreboard-container {
      padding: var(--space-3);
      gap: var(--space-4);
    }
    
    .scoreboard-header h1 {
      font-size: var(--font-size-2xl);
    }
    
    .my-ranking {
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .ranking-item {
      flex-wrap: wrap;
      justify-content: space-between;
    }
    
    .player-info {
      flex: none;
      min-width: 200px;
    }
    
    .round-details {
      gap: var(--space-3);
    }
    
    .round-value {
      font-size: var(--font-size-3xl);
    }
    
    .context-items {
      flex-direction: column;
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .ranking-item {
      flex-direction: column;
      text-align: center;
      gap: var(--space-2);
    }
    
    .player-info {
      min-width: auto;
      width: 100%;
    }
    
    .score-info {
      flex-direction: row;
      gap: var(--space-2);
    }
    
    .summary-stats {
      gap: var(--space-2);
    }
  }
</style>