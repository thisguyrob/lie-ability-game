<script>
  import { onMount } from 'svelte'
  import io from 'socket.io-client'
  import Lobby from './components/Lobby.svelte'
  import CategoryView from './components/CategoryView.svelte'
  import QuestionView from './components/QuestionView.svelte'
  import WaitingView from './components/WaitingView.svelte'
  import OptionsView from './components/OptionsView.svelte'
  import RevealView from './components/RevealView.svelte'
  import Scoreboard from './components/Scoreboard.svelte'

  let socket
  let gameState = null
  let subStep = null
  let timer = 0
  let revealData = null
  let scoreboard = null

  const startGame = () => socket.emit('start_game')

  onMount(() => {
    const socketUrl = window.location.port === '5173'
      ? 'http://localhost:3000'
      : window.location.origin
    socket = io(socketUrl)
    socket.on('connect', () => socket.emit('request_game_state'))
    socket.on('game_state_update', d => { gameState = d })
    socket.on('host_sub_step_info', d => { subStep = d })
    socket.on('timer_update', d => { timer = d.secondsRemaining })
    socket.on('truth_reveal_start', d => { revealData = d })
    socket.on('scoreboard_update', d => { scoreboard = d })
    socket.on('player_joined', () => socket.emit('request_game_state'))
    socket.on('player_left', () => socket.emit('request_game_state'))
  })

  $: players = gameState?.players || []
  $: currentState = gameState?.state
  $: currentQuestion = subStep?.question || gameState?.currentQuestionData
  $: categories = subStep?.categories || []
  $: options = subStep?.options || []
</script>

<main>
  {#if currentState === 'lobby'}
    <Lobby {players} onStart={startGame}/>
  {:else if currentState === 'category_selection'}
    <CategoryView {categories}
      selectorName={players.find(p => p.id === gameState.categorySelector)?.name}
      isSelector={subStep?.isSelector}/>
  {:else if currentState === 'question_reading'}
    <QuestionView question={currentQuestion}/>
  {:else if currentState === 'lie_submission'}
    <WaitingView/>
  {:else if currentState === 'option_selection'}
    <OptionsView {options}/>
  {:else if currentState === 'truth_reveal'}
    <RevealView reveal={revealData}/>
  {:else if currentState === 'scoreboard' || currentState === 'game_ended'}
    <Scoreboard players={scoreboard?.players || []}/>
  {/if}
  {#if timer}
    <div class="timer">⏱ {timer}s</div>
  {/if}
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 2rem;
    text-align: center;
  }
  .timer {
    margin-top: 1rem;
    font-size: 1.2rem;
  }
</style>
