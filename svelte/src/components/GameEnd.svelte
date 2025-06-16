<script>
  export let data;
  
  // Sort players by final points
  $: finalStandings = [...data.finalStandings].sort((a, b) => b.points - a.points);
  
  function getRankDisplay(rank) {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  }
  
  function getRankClass(rank) {
    switch (rank) {
      case 1: return 'winner';
      case 2: return 'second';
      case 3: return 'third';
      default: return 'other';
    }
  }
</script>

<div class="game-end-container">
  <div class="celebration-header">
    <div class="celebration-icon">🎊</div>
    <h1 class="game-complete-title">Game Complete!</h1>
    <div class="confetti"></div>
  </div>
  
  <div class="winner-spotlight">
    <div class="winner-card">
      <div class="winner-crown">👑</div>
      <div class="winner-avatar" style="background-color: {data.winner.avatar.color}">
        <span class="winner-emoji">{data.winner.avatar.emoji}</span>
      </div>
      <h2 class="winner-name">{data.winner.name}</h2>
      <div class="winner-title">Champion Liar!</div>
      <div class="winner-points">{data.winner.points} points</div>
      <div class="winner-celebration">
        <div class="sparkle">✨</div>
        <div class="sparkle">✨</div>
        <div class="sparkle">✨</div>
      </div>
    </div>
  </div>
  
  <div class="final-standings">
    <h3 class="standings-title">Final Standings</h3>
    <div class="standings-grid">
      {#each finalStandings as player, index}
        <div 
          class="standing-card {getRankClass(index + 1)}" 
          style="animation-delay: {index * 0.15}s"
        >
          <div class="standing-rank">
            <span class="rank-icon">{getRankDisplay(index + 1)}</span>
            <span class="rank-number">{index + 1}</span>
          </div>
          
          <div class="standing-player">
            <div class="standing-avatar" style="background-color: {player.avatar.color}">
              <span class="standing-emoji">{player.avatar.emoji}</span>
            </div>
            <div class="standing-info">
              <div class="standing-name">{player.name}</div>
              <div class="standing-stats">
                <span class="lies-stat">🤥 {player.liesSubmitted || 0} lies</span>
                <span class="truth-stat">🎯 {player.truthsFound || 0} truths</span>
              </div>
            </div>
          </div>
          
          <div class="standing-points">
            <div class="points-value">{player.points}</div>
            <div class="points-label">pts</div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <div class="game-stats">
    <h3 class="stats-title">Game Statistics</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🎮</div>
        <div class="stat-value">{data.totalRounds}</div>
        <div class="stat-label">Rounds Played</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">❓</div>
        <div class="stat-value">{data.totalQuestions || 0}</div>
        <div class="stat-label">Questions Asked</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🤥</div>
        <div class="stat-value">{data.totalLies || 0}</div>
        <div class="stat-label">Lies Created</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-value">{data.totalPlayers || finalStandings.length}</div>
        <div class="stat-label">Players</div>
      </div>
    </div>
  </div>
  
  <div class="play-again-section">
    <div class="thanks-message">
      <h3>Thanks for Playing Lie-Ability! 🎉</h3>
      <p>Hope you had a blast creating lies and hunting for truth!</p>
    </div>
    
    <div class="play-again-hint">
      <p>Want to play again? Refresh the page to start a new game!</p>
    </div>
  </div>
</div>

<style>
  .game-end-container {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    animation: fadeIn 1s ease;
  }
  
  .celebration-header {
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .celebration-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }
  
  .game-complete-title {
    font-size: 4rem;
    font-weight: 700;
    color: white;
    margin: 0;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    from {
      text-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.5);
    }
    to {
      text-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.8);
    }
  }
  
  .confetti {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
  
  .confetti::before,
  .confetti::after {
    content: '🎉';
    position: absolute;
    font-size: 2rem;
    animation: confetti-fall 3s linear infinite;
  }
  
  .confetti::before {
    left: 20%;
    animation-delay: 0s;
  }
  
  .confetti::after {
    right: 20%;
    animation-delay: 1s;
  }
  
  @keyframes confetti-fall {
    0% {
      transform: translateY(-100px) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(400px) rotate(360deg);
      opacity: 0;
    }
  }
  
  .winner-spotlight {
    display: flex;
    justify-content: center;
  }
  
  .winner-card {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: white;
    border-radius: 24px;
    padding: 3rem;
    text-align: center;
    box-shadow: 0 16px 50px rgba(251, 191, 36, 0.4);
    position: relative;
    overflow: hidden;
    animation: winnerPulse 2s ease-in-out infinite alternate;
  }
  
  @keyframes winnerPulse {
    0% {
      transform: scale(1);
      box-shadow: 0 16px 50px rgba(251, 191, 36, 0.4);
    }
    100% {
      transform: scale(1.02);
      box-shadow: 0 20px 60px rgba(251, 191, 36, 0.6);
    }
  }
  
  .winner-crown {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }
  
  .winner-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem auto;
    border: 5px solid rgba(255, 255, 255, 0.3);
    animation: avatarSpin 4s linear infinite;
  }
  
  @keyframes avatarSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .winner-emoji {
    font-size: 3rem;
  }
  
  .winner-name {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }
  
  .winner-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }
  
  .winner-points {
    font-size: 2rem;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    display: inline-block;
    margin-bottom: 1.5rem;
  }
  
  .winner-celebration {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
  
  .sparkle {
    font-size: 1.5rem;
    animation: sparkle 1.5s ease-in-out infinite alternate;
  }
  
  .sparkle:nth-child(2) { animation-delay: 0.5s; }
  .sparkle:nth-child(3) { animation-delay: 1s; }
  
  @keyframes sparkle {
    0% { transform: scale(1) rotate(0deg); opacity: 0.7; }
    100% { transform: scale(1.3) rotate(180deg); opacity: 1; }
  }
  
  .final-standings {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
  
  .standings-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 2rem 0;
    text-align: center;
  }
  
  .standings-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .standing-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    border-radius: 16px;
    transition: all 0.3s ease;
    animation: slideInLeft 0.6s ease both;
  }
  
  .standing-card.winner {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: white;
  }
  
  .standing-card.second {
    background: linear-gradient(135deg, #e5e7eb, #d1d5db);
    color: #374151;
  }
  
  .standing-card.third {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: white;
  }
  
  .standing-card.other {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    color: #374151;
  }
  
  .standing-rank {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  }
  
  .rank-icon {
    font-size: 2rem;
  }
  
  .rank-number {
    font-size: 0.9rem;
    font-weight: 600;
    opacity: 0.8;
  }
  
  .standing-player {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }
  
  .standing-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
  
  .standing-emoji {
    font-size: 1.8rem;
  }
  
  .standing-name {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .standing-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  .standing-points {
    text-align: right;
    flex-shrink: 0;
  }
  
  .points-value {
    font-size: 1.8rem;
    font-weight: 700;
  }
  
  .points-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  .game-stats {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .stats-title {
    font-size: 2rem;
    font-weight: 700;
    color: white;
    margin: 0 0 2rem 0;
    text-align: center;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
  }
  
  .stat-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .stat-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  .play-again-section {
    text-align: center;
    color: white;
  }
  
  .thanks-message h3 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
  }
  
  .thanks-message p {
    font-size: 1.2rem;
    margin: 0 0 2rem 0;
    opacity: 0.9;
  }
  
  .play-again-hint p {
    font-size: 1.1rem;
    opacity: 0.8;
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
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @media (max-width: 768px) {
    .game-complete-title {
      font-size: 3rem;
    }
    
    .winner-card {
      padding: 2rem;
    }
    
    .winner-avatar {
      width: 100px;
      height: 100px;
    }
    
    .winner-name {
      font-size: 2rem;
    }
    
    .standings-grid {
      gap: 0.75rem;
    }
    
    .standing-card {
      padding: 1.25rem;
      gap: 1rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .game-complete-title {
      font-size: 2.5rem;
    }
    
    .standing-card {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .standing-player {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .standing-stats {
      justify-content: center;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>