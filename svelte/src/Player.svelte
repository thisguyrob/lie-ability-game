<script>
  import { onMount } from 'svelte'
  import io from 'socket.io-client'
  import PlayerJoin from './components/player/PlayerJoin.svelte'
  import PlayerStatus from './components/player/PlayerStatus.svelte'
  import PlayerCategorySelect from './components/player/PlayerCategorySelect.svelte'
  import PlayerLieSubmit from './components/player/PlayerLieSubmit.svelte'
  import PlayerOptionSelect from './components/player/PlayerOptionSelect.svelte'
  import PlayerResults from './components/player/PlayerResults.svelte'

  let socket
  let gameState = null
  let subStep = null
  let timer = 0
  let player = null
  let isConnected = false
  let revealData = null
  let hasJoined = false

  onMount(() => {
    socket = io()
    
    socket.on('connect', () => {
      isConnected = true
      if (hasJoined) {
        socket.emit('request_game_state')
      }
    })
    
    socket.on('disconnect', () => {
      isConnected = false
    })
    
    socket.on('game_state_update', d => {
      gameState = d
    })
    
    socket.on('sub_step_info', d => {
      subStep = d
    })
    
    socket.on('timer_update', d => {
      timer = d.secondsRemaining
    })
    
    socket.on('truth_reveal_start', d => {
      revealData = d
    })
    
    socket.on('player_joined_response', d => {
      if (d.success) {
        player = d.player
        hasJoined = true
        socket.emit('request_game_state')
      }
    })
    
    socket.on('player_data_update', d => {
      if (player && d.playerId === player.id) {
        player = { ...player, ...d.updates }
      }
    })
  })

  const handleJoined = (event) => {
    player = event.detail
    hasJoined = true
  }

  const handleContinue = () => {
    revealData = null
  }

  // Reactive statements
  $: currentState = gameState?.state
  $: currentQuestion = subStep?.question || gameState?.currentQuestionData
  $: categories = subStep?.categories || []
  $: options = subStep?.options || []
  $: isSelector = subStep?.isSelector
  $: showStatus = hasJoined && currentState !== 'lobby'
</script>

{#if showStatus}
  <PlayerStatus {player} {isConnected} gameState={currentState} />
{/if}

<main class:with-status={showStatus}>
  {#if !hasJoined}
    <PlayerJoin {socket} on:joined={handleJoined} />
  {:else if currentState === 'lobby'}
    <div class="lobby-waiting">
      <h2>🎮 Lie-Ability Game</h2>
      <p>Welcome, {player?.name}!</p>
      <p>Waiting for the game to start...</p>
      <div class="waiting-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  {:else if currentState === 'category_selection'}
    <PlayerCategorySelect {socket} {categories} {isSelector} {timer} />
  {:else if currentState === 'question_reading'}
    <div class="question-reading">
      <h2>📖 Question Time</h2>
      <div class="question-display">
        <p class="question-text">{currentQuestion?.question || 'Loading question...'}</p>
      </div>
      <p class="instruction">Get ready to submit your lie!</p>
    </div>
  {:else if currentState === 'lie_submission' && !subStep?.hasSubmittedLie}
    <PlayerLieSubmit {socket} question={currentQuestion} {timer} />
  {:else if currentState === 'lie_submission' && subStep?.hasSubmittedLie}
    <div class="waiting-screen">
      <h2>✅ Lie Submitted!</h2>
      <p>Waiting for other players to submit their lies...</p>
      <div class="waiting-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  {:else if currentState === 'option_selection' && !subStep?.hasSelectedOption}
    <PlayerOptionSelect {socket} {options} {timer} />
  {:else if currentState === 'option_selection' && subStep?.hasSelectedOption}
    <div class="waiting-screen">
      <h2>🗳️ Vote Submitted!</h2>
      <p>Waiting for other players to vote...</p>
      <div class="waiting-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  {:else if currentState === 'truth_reveal' && revealData}
    <PlayerResults {revealData} playerData={player} onContinue={handleContinue} />
  {:else if currentState === 'scoreboard' || currentState === 'game_ended'}
    <div class="scoreboard-screen">
      <h2>{currentState === 'game_ended' ? '🏆 Final Results' : '📊 Scoreboard'}</h2>
      <p>Check the main screen for scores!</p>
      {#if currentState !== 'game_ended'}
        <p>Get ready for the next round...</p>
      {/if}
    </div>
  {:else}
    <div class="waiting-screen">
      <h2>🎮 Game in Progress</h2>
      <p>Please wait...</p>
      <div class="waiting-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
  }
  
  main.with-status {
    padding-top: 70px;
  }
  
  .lobby-waiting,
  .question-reading,
  .waiting-screen,
  .scoreboard-screen {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
  }
  
  .lobby-waiting h2,
  .question-reading h2,
  .waiting-screen h2,
  .scoreboard-screen h2 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 1rem 0;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .lobby-waiting p,
  .waiting-screen p,
  .scoreboard-screen p {
    font-size: 1.1rem;
    margin: 0.5rem 0;
    opacity: 0.9;
  }
  
  .question-display {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    margin: 1.5rem 0;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
  }
  
  .question-text {
    color: #2d3748;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.4;
  }
  
  .instruction {
    font-size: 1rem;
    margin-top: 1rem;
    opacity: 0.8;
  }
  
  .waiting-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }
  
  .waiting-dots span {
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.7);
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
    main.with-status {
      padding-top: 60px;
    }
    
    .lobby-waiting,
    .question-reading,
    .waiting-screen,
    .scoreboard-screen {
      padding: 1.5rem;
    }
    
    .lobby-waiting h2,
    .question-reading h2,
    .waiting-screen h2,
    .scoreboard-screen h2 {
      font-size: 1.75rem;
    }
    
    .question-display {
      padding: 1.5rem;
    }
    
    .question-text {
      font-size: 1.1rem;
    }
  }
</style>
