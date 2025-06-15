<script>
  import { onMount } from 'svelte'
  import io from 'socket.io-client'
  import JoinView from './components/JoinView.svelte'
  import CategoryPicker from './components/CategoryPicker.svelte'
  import LieInput from './components/LieInput.svelte'
  import OptionButtons from './components/OptionButtons.svelte'
  import WaitingView from './components/WaitingView.svelte'
  import QuestionView from './components/QuestionView.svelte'
  import RevealView from './components/RevealView.svelte'
  import Scoreboard from './components/Scoreboard.svelte'
  import { SOCKET_EVENTS, GAME_STATES } from './constants'

  let socket
  let playerJoined = false
  let playerId = ''
  let playerName = ''
  let joinError = ''

  let gameState = null
  let subStep = null
  let timer = 0
  let revealData = null
  let scoreboard = null

  const joinGame = name => {
    joinError = ''
    playerName = name.trim()
    if (playerName) {
      socket.emit(SOCKET_EVENTS.JOIN_GAME, { playerName })
    }
  }

  const selectCategory = id => socket.emit(SOCKET_EVENTS.SELECT_CATEGORY, { categoryId: id })
  const submitLie = lie => socket.emit(SOCKET_EVENTS.SUBMIT_LIE, { lie })
  const autoLie = () => socket.emit(SOCKET_EVENTS.AUTO_LIE)
  const selectOption = id => socket.emit(SOCKET_EVENTS.SELECT_OPTION, { optionId: id })

  onMount(() => {
    const socketUrl = window.location.port === '5173'
      ? 'http://localhost:3000'
      : window.location.origin
    socket = io(socketUrl)

    socket.on('connect', () => {
      socket.emit(SOCKET_EVENTS.REQUEST_GAME_STATE)
    })

    socket.on(SOCKET_EVENTS.GAME_STATE_UPDATE, d => { gameState = d })
    socket.on('sub_step_info', d => { subStep = d })
    socket.on(SOCKET_EVENTS.TIMER_UPDATE, d => { timer = d.secondsRemaining })
    socket.on(SOCKET_EVENTS.TRUTH_REVEAL_START, d => { revealData = d })
    socket.on(SOCKET_EVENTS.SCOREBOARD_UPDATE, d => { scoreboard = d })

    const handleJoin = data => {
      playerJoined = true
      playerId = data.player?.id || data.playerId
      gameState = data.gameState
    }

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, handleJoin)
    socket.on(SOCKET_EVENTS.PLAYER_RECONNECTED, handleJoin)
    socket.on(SOCKET_EVENTS.ERROR, d => { joinError = d.message })
  })

  $: currentState = gameState?.state
  $: categories = subStep?.categories || []
  $: question = subStep?.question || gameState?.currentQuestionData
  $: options = subStep?.options || []
</script>

<main>
  {#if !playerJoined}
    <JoinView onJoin={joinGame} {joinError}/>
  {:else}
    {#if currentState === GAME_STATES.LOBBY}
      <p>Waiting for the host to start...</p>
    {:else if currentState === GAME_STATES.CATEGORY_SELECTION}
      {#if subStep?.isSelector}
        <CategoryPicker {categories} onSelect={selectCategory}/>
      {:else}
        <p>Waiting for category choice...</p>
      {/if}
    {:else if currentState === GAME_STATES.QUESTION_READING}
      <QuestionView {question}/>
    {:else if currentState === GAME_STATES.LIE_SUBMISSION}
      {#if !subStep?.hasSubmittedLie}
        <LieInput onSubmit={submitLie} onAuto={autoLie}/>
      {:else}
        <WaitingView/>
      {/if}
    {:else if currentState === GAME_STATES.OPTION_SELECTION}
      {#if !subStep?.hasSelectedOption}
        <OptionButtons {options} onSelect={selectOption}/>
      {:else}
        <WaitingView/>
      {/if}
    {:else if currentState === GAME_STATES.TRUTH_REVEAL}
      <RevealView reveal={revealData}/>
    {:else if currentState === GAME_STATES.SCOREBOARD || currentState === GAME_STATES.GAME_ENDED}
      <Scoreboard players={scoreboard?.players || []}/>
    {/if}
    {#if timer}
      <div class="timer">⏱ {timer}s</div>
    {/if}
  {/if}
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 2rem;
    text-align: center;
  }
  .timer { margin-top: 1rem; font-size: 1.2rem }
</style>
