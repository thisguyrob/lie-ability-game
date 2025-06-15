<script>
  import { onMount } from 'svelte'
  import QRCode from 'qrcode'
  import PlayerList from './PlayerList.svelte'
  
  export let players = []
  export let onStart = () => {}
  
  let qrCodeUrl = ''
  let gameUrl = ''
  
  onMount(async () => {
    // Get the server URL with local IP
    try {
      const response = await fetch('/api/server-info')
      const data = await response.json()
      gameUrl = data.publicUrl ? `${data.publicUrl}/player` : `${window.location.origin}/player`
    } catch (error) {
      // Fallback to current origin
      gameUrl = `${window.location.origin}/player`
    }
    
    // Generate QR code
    try {
      qrCodeUrl = await QRCode.toDataURL(gameUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#2d3748',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    }
  })
</script>

<section class="lobby">
  <h2 class="game-title">🎮 Lie-Ability Game</h2>
  <div class="lobby-content">
    <!-- Left side: QR Code and Start Button -->
    <div class="qr-section">
      <div class="qr-container">
        <h3 class="join-title">Join the Game!</h3>
        <p class="join-subtitle">Scan the QR code with your phone</p>
        
        {#if qrCodeUrl}
          <div class="qr-code">
            <img src={qrCodeUrl} alt="QR Code to join game" />
          </div>
        {:else}
          <div class="qr-placeholder">
            <div class="loading-spinner"></div>
            <p>Generating QR code...</p>
          </div>
        {/if}
        
      </div>
    </div>
    
    <!-- Right side: Player List -->
    <div class="players-section">
      <h3 class="players-title">
        Players ({players.length})
      </h3>
      <div class="players-container">
        {#if players.length > 0}
          <PlayerList {players}/>
        {:else}
          <div class="no-players">
            <p>Waiting for players...</p>
            <div class="waiting-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <button class="start-button" on:click={onStart} disabled={players.length < 2}>
    {players.length < 2 ? `Need ${2 - players.length} more player${2 - players.length === 1 ? '' : 's'}` : '🚀 Start Game'}
  </button>
</section>

<style>
  .lobby {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
  }

  .lobby-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24rem;
    max-width: 1200px;
    margin: 0 auto;
    flex: 1;
    align-items: center;
    padding: 0 2rem 2rem 2rem;
  }

  /* Left Side - QR Code Section */
  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .game-title {
    font-size: 3rem;
    font-weight: 800;
    color: white;
    text-align: center;
    margin: 0;
    padding: 2rem 0 0 0;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    letter-spacing: -1px;
  }

  .qr-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 30px;
    padding: 3rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .join-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 0.5rem 0;
  }

  .join-subtitle {
    font-size: 1.1rem;
    color: #718096;
    margin: 0 0 2rem 0;
  }

  .qr-code {
    margin: 1rem 0;
  }

  .qr-code img {
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    height: auto;
  }

  .qr-placeholder {
    width: 300px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f7fafc;
    border-radius: 20px;
    margin: 1rem auto;
    color: #718096;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .game-url {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid rgba(113, 128, 150, 0.2);
  }

  .url-label {
    font-size: 0.9rem;
    color: #718096;
    margin: 0 0 0.5rem 0;
  }

  .url-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #667eea;
    word-break: break-all;
    margin: 0;
    background: rgba(102, 126, 234, 0.1);
    padding: 0.8rem 1rem;
    border-radius: 12px;
    border: 2px solid rgba(102, 126, 234, 0.2);
  }

  .start-button {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 1.2rem 3rem;
    font-size: 1.4rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 40px rgba(72, 187, 120, 0.4);
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    min-width: 250px;
    margin: 0 auto 2rem auto;
    display: block;
  }

  .start-button:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 50px rgba(72, 187, 120, 0.5);
  }

  .start-button:disabled {
    background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
    cursor: not-allowed;
    opacity: 0.8;
    box-shadow: 0 5px 20px rgba(160, 174, 192, 0.3);
  }

  /* Right Side - Players Section */
  .players-section {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 30px;
    padding: 2rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    height: fit-content;
    max-height: 70vh;
    overflow: hidden;
  }

  .players-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: white;
    margin: 0 0 1.5rem 0;
    text-align: center;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .players-container {
    max-height: calc(70vh - 6rem);
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .players-container::-webkit-scrollbar {
    width: 6px;
  }

  .players-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .players-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  .players-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .no-players {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    padding: 3rem 1rem;
  }

  .no-players p {
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
  }

  .waiting-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }

  .waiting-dots span {
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.6);
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

  /* Responsive Design */
  @media (max-width: 768px) {
    .lobby {
      padding: 1rem;
    }

    .lobby-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .game-title {
      font-size: 2rem;
    }

    .qr-container {
      padding: 2rem;
    }

    .join-title {
      font-size: 1.5rem;
    }

    .start-button {
      padding: 1rem 2rem;
      font-size: 1.2rem;
      min-width: 200px;
    }

    .players-section {
      max-height: 50vh;
    }
  }
</style>
