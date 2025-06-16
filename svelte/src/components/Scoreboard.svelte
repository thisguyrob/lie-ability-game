<script>
  import { createEventDispatcher } from 'svelte';
  
  export let gameState;
  export let isGameOver = false;
  
  const dispatch = createEventDispatcher();
  
  // Sort players by score (descending)
  $: sortedPlayers = (gameState.players || [])
    .filter(p => p.connected || p.score > 0)
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  
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
      default: return `#${rank}`;
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
  
  // Calculate next round multiplier
  $: nextRoundMultiplier = gameState.round < 3 ? gameState.round + 1 : 3;
  $: nextLiePoints = 500 * nextRoundMultiplier;
  $: nextTruthPoints = 1000 * nextRoundMultiplier;
  
  function resetGame() {
    dispatch('resetGame');
  }
</script>

<div class="scoreboard">
  <div class="container">
    <!-- Header -->
    <div class="scoreboard-header fade-in">
      <h1>
        {#if isGameOver}
          🏁 Final Results
        {:else}
          📊 Current Standings
        {/if}
      </h1>
      <p>
        {#if isGameOver}
          Congratulations to all players! Here's how everyone finished.
        {:else}
          Round {gameState.round || 1} complete • {gameState.round < 3 ? `Round ${gameState.round + 1} coming up` : 'Final round next'}
        {/if}
      </p>
    </div>
    
    <!-- Winner Spotlight (for game over or current leader) -->
    {#if rankedPlayers.length > 0}
      <div class="winner-spotlight slide-up">
        <div class="spotlight-card" class:winner={isGameOver} class:leader={!isGameOver}>
          <div class="spotlight-content">
            <div class="winner-crown">
              {#if isGameOver}
                🎉
              {:else}
                👑
              {/if}
            </div>
            <div 
              class="winner-avatar"
              style="background: {rankedPlayers[0].avatar.color}"
            >
              {rankedPlayers[0].avatar.emoji}
            </div>
            <div class="winner-info">
              <h2 class="winner-name">{rankedPlayers[0].name}</h2>
              <p class="winner-title">
                {#if isGameOver}
                  🏆 Game Winner!
                {:else}
                  👑 Current Leader
                {/if}
              </p>
              <div class="winner-score">
                <span class="score-number">{rankedPlayers[0].score || 0}</span>
                <span class="score-label">points</span>
              </div>
            </div>
          </div>
          
          {#if !isGameOver && rankedPlayers.length > 1}
            <div class="lead-info">
              <p>Leading by {(rankedPlayers[0].score || 0) - (rankedPlayers[1].score || 0)} points</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}
    
    <!-- Full Rankings -->
    <div class="rankings-section scale-in">
      <div class="rankings-card">
        <h3>🏆 Full Rankings</h3>
        <div class="rankings-table">
          <div class="table-header">
            <div class="header-rank">Rank</div>
            <div class="header-player">Player</div>
            <div class="header-score">Score</div>
            <div class="header-last">Last Submission</div>
          </div>
          
          <div class="table-body">
            {#each rankedPlayers as player, index}
              <div 
                class="ranking-row"
                class:winner={player.rank === 1}
                class:podium={player.rank <= 3}
                style="animation-delay: {index * 150}ms"
              >
                <div class="rank-cell">
                  <span class="rank-icon" style="color: {getRankColor(player.rank)}">
                    {getRankIcon(player.rank)}
                  </span>
                </div>
                
                <div class="player-cell">
                  <div 
                    class="player-avatar"
                    style="background: {player.avatar.color}"
                  >
                    {player.avatar.emoji}
                  </div>
                  <div class="player-details">
                    <div class="player-name">{player.name}</div>
                    <div class="player-status">
                      <span class="status-dot" class:connected={player.connected}></span>
                      <span>{player.connected ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
                
                <div class="score-cell">
                  <span class="score-value">{player.score || 0}</span>
                  <span class="score-points">pts</span>
                </div>
                
                <div class="last-cell">
                  {#if player.lastLie}
                    <span class="last-lie">"{player.lastLie}"</span>
                  {:else}
                    <span class="no-submission">—</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Round Transition Info -->
    {#if !isGameOver}
      <div class="transition-info slide-up">
        <div class="transition-card glass">
          <h3>⚡ Next Round Preview</h3>
          <div class="round-preview">
            <div class="round-number">
              <span class="round-label">Round</span>
              <span class="round-value">{gameState.round + 1}</span>
            </div>
            <div class="points-info">
              <div class="points-item">
                <span class="points-label">Fooling others:</span>
                <span class="points-value">{nextLiePoints} pts each</span>
              </div>
              <div class="points-item">
                <span class="points-label">Finding truth:</span>
                <span class="points-value">{nextTruthPoints} pts</span>
              </div>
            </div>
          </div>
          <p class="transition-message">
            {#if gameState.round === 1}
              🔥 Points are about to double! The competition heats up!
            {:else if gameState.round === 2}
              💥 Final round coming up with TRIPLE points! Everything is on the line!
            {:else}
              🏁 That was the final round! Get ready for results!
            {/if}
          </p>
        </div>
      </div>
    {:else}
      <!-- Game Over Actions -->
      <div class="game-over-actions slide-up">
        <div class="actions-card glass">
          <h3>🎮 Game Complete</h3>
          <p>Thanks for playing Lie-Ability! Want to play again?</p>
          <button 
            class="btn btn-primary btn-lg"
            on:click={resetGame}
          >
            🔄 New Game
          </button>
        </div>
      </div>
    {/if}
    
    <!-- Statistics -->
    <div class="game-statistics slide-up">
      <div class="stats-card glass">
        <h3>📈 Game Statistics</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{sortedPlayers.length}</span>
            <span class="stat-label">Players</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{isGameOver ? 3 : gameState.round || 1}</span>
            <span class="stat-label">{isGameOver ? 'Rounds Played' : 'Current Round'}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{Math.max(...sortedPlayers.map(p => p.score || 0))}</span>
            <span class="stat-label">Highest Score</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{Math.round(sortedPlayers.reduce((sum, p) => sum + (p.score || 0), 0) / sortedPlayers.length) || 0}</span>
            <span class="stat-label">Average Score</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .scoreboard {
    min-height: 100vh;
    padding: var(--space-6) 0;
  }
  
  .scoreboard-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  .scoreboard-header h1 {
    font-size: var(--font-size-5xl);
    font-weight: 900;
    color: var(--white);
    margin-bottom: var(--space-3);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .scoreboard-header p {
    font-size: var(--font-size-xl);
    color: rgba(255, 255, 255, 0.9);
  }
  
  .winner-spotlight {
    margin-bottom: var(--space-8);
  }
  
  .spotlight-card {
    max-width: 600px;
    margin: 0 auto;
    padding: var(--space-8);
    border-radius: var(--radius-2xl);
    text-align: center;
    position: relative;
    transition: all var(--transition);
  }
  
  .spotlight-card.winner {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
    animation: winner-glow 2s ease-in-out infinite;
  }
  
  .spotlight-card.leader {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .spotlight-content {
    position: relative;
  }
  
  .winner-crown {
    font-size: var(--font-size-6xl);
    margin-bottom: var(--space-4);
    animation: bounce 2s infinite;
  }
  
  .winner-avatar {
    width: 120px;
    height: 120px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-6xl);
    margin: 0 auto var(--space-4);
    border: 4px solid rgba(255, 255, 255, 0.5);
    box-shadow: var(--shadow-2xl);
  }
  
  .winner-name {
    color: var(--white);
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-2);
    font-weight: 900;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .spotlight-card.winner .winner-name {
    color: var(--gray-800);
    text-shadow: none;
  }
  
  .winner-title {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
    font-weight: 600;
  }
  
  .spotlight-card.winner .winner-title {
    color: var(--gray-700);
  }
  
  .winner-score {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: var(--space-2);
  }
  
  .score-number {
    font-size: var(--font-size-5xl);
    font-weight: 900;
    color: var(--white);
    line-height: 1;
  }
  
  .spotlight-card.winner .score-number {
    color: var(--gray-800);
  }
  
  .score-label {
    font-size: var(--font-size-lg);
    color: rgba(255, 255, 255, 0.8);
    font-weight: 600;
  }
  
  .spotlight-card.winner .score-label {
    color: var(--gray-600);
  }
  
  .lead-info {
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .lead-info p {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-lg);
    font-weight: 500;
    margin: 0;
  }
  
  .rankings-card {
    background: var(--white);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    box-shadow: var(--shadow-2xl);
    margin-bottom: var(--space-8);
  }
  
  .rankings-card h3 {
    color: var(--gray-800);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-5);
    font-weight: 700;
    text-align: center;
  }
  
  .rankings-table {
    width: 100%;
  }
  
  .table-header {
    display: grid;
    grid-template-columns: 80px 1fr 100px 200px;
    gap: var(--space-3);
    padding: var(--space-3);
    background: var(--gray-100);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-3);
  }
  
  .table-header > div {
    color: var(--gray-600);
    font-size: var(--font-size-sm);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .table-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .ranking-row {
    display: grid;
    grid-template-columns: 80px 1fr 100px 200px;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--gray-50);
    border-radius: var(--radius-lg);
    border: 2px solid transparent;
    transition: all var(--transition);
    animation: slide-up 0.3s ease-out;
  }
  
  .ranking-row.winner {
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.3);
  }
  
  .ranking-row.podium:not(.winner) {
    background: rgba(192, 192, 192, 0.1);
    border-color: rgba(192, 192, 192, 0.3);
  }
  
  .rank-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .rank-icon {
    font-size: var(--font-size-xl);
    font-weight: 900;
  }
  
  .player-cell {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  
  .player-avatar {
    width: 48px;
    height: 48px;
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
    color: var(--gray-800);
    font-weight: 700;
    font-size: var(--font-size-lg);
    line-height: 1.2;
    margin-bottom: var(--space-1);
  }
  
  .player-status {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    color: var(--gray-500);
    font-size: var(--font-size-xs);
    font-weight: 500;
  }
  
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background: var(--error);
  }
  
  .status-dot.connected {
    background: var(--success);
  }
  
  .score-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
  }
  
  .score-value {
    color: var(--gray-800);
    font-size: var(--font-size-xl);
    font-weight: 900;
  }
  
  .score-points {
    color: var(--gray-500);
    font-size: var(--font-size-sm);
    font-weight: 600;
  }
  
  .last-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .last-lie {
    color: var(--gray-600);
    font-size: var(--font-size-sm);
    font-style: italic;
    text-align: center;
    line-height: 1.3;
  }
  
  .no-submission {
    color: var(--gray-400);
    font-size: var(--font-size-base);
  }
  
  .transition-card,
  .actions-card,
  .stats-card {
    max-width: 600px;
    margin: 0 auto var(--space-6);
    padding: var(--space-6);
    border-radius: var(--radius-2xl);
    text-align: center;
  }
  
  .transition-card h3,
  .actions-card h3,
  .stats-card h3 {
    color: var(--white);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
    font-weight: 700;
  }
  
  .round-preview {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: var(--space-5);
    gap: var(--space-4);
    flex-wrap: wrap;
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
    font-size: var(--font-size-5xl);
    font-weight: 900;
  }
  
  .points-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .points-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius);
    min-width: 250px;
  }
  
  .points-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
    font-weight: 500;
  }
  
  .points-value {
    color: var(--white);
    font-size: var(--font-size-sm);
    font-weight: 700;
  }
  
  .transition-message {
    color: var(--white);
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0;
  }
  
  .actions-card p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-4);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-4);
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    background: rgba(255, 255, 255, 0.1);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
  }
  
  .stat-number {
    color: var(--white);
    font-size: var(--font-size-2xl);
    font-weight: 900;
    line-height: 1;
  }
  
  .stat-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
    font-weight: 600;
    text-align: center;
  }
  
  @keyframes winner-glow {
    0%, 100% {
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
    }
    50% {
      box-shadow: 0 0 60px rgba(255, 215, 0, 0.6);
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
  
  @media (max-width: 1024px) {
    .table-header,
    .ranking-row {
      grid-template-columns: 60px 1fr 80px 150px;
      gap: var(--space-2);
    }
    
    .header-last,
    .last-cell {
      display: none;
    }
    
    .table-header,
    .ranking-row {
      grid-template-columns: 60px 1fr 80px;
    }
  }
  
  @media (max-width: 768px) {
    .scoreboard-header h1 {
      font-size: var(--font-size-3xl);
    }
    
    .winner-avatar {
      width: 80px;
      height: 80px;
      font-size: var(--font-size-3xl);
    }
    
    .winner-name {
      font-size: var(--font-size-2xl);
    }
    
    .round-preview {
      flex-direction: column;
    }
    
    .points-item {
      min-width: auto;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .table-header,
    .ranking-row {
      grid-template-columns: 1fr 80px;
      gap: var(--space-2);
    }
    
    .header-rank,
    .rank-cell {
      display: none;
    }
    
    .player-cell {
      flex-direction: column;
      text-align: center;
      gap: var(--space-2);
    }
  }
  
  @media (max-width: 480px) {
    .scoreboard {
      padding: var(--space-4) 0;
    }
    
    .spotlight-card,
    .rankings-card,
    .transition-card,
    .actions-card,
    .stats-card {
      padding: var(--space-4);
    }
    
    .round-value {
      font-size: var(--font-size-3xl);
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>