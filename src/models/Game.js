const { v4: uuidv4 } = require('uuid');
const Player = require('./Player');
const TimerService = require('../services/TimerService');
const QuestionService = require('../services/QuestionService');
const { GAME_STATES, GAME_CONFIG, TIMERS, SOCKET_EVENTS } = require('../utils/constants');

class Game {
  constructor(io) {
    this.id = uuidv4();
    this.io = io; // Socket.IO instance for emitting events
    this.players = new Map(); // Map of playerId to Player objects
    this.state = GAME_STATES.LOBBY;
    this.timerService = new TimerService();
    this.questionService = new QuestionService();
    this.initialized = false; // Track initialization status
    
    // Game progression tracking
    this.currentRound = 1;
    this.currentQuestion = 1;
    this.currentQuestionData = null;
    this.categoryOptions = [];
    this.selectedCategory = null;
    this.categorySelector = null; // Player ID who should select category
    
    // Question state
    this.playerLies = new Map(); // playerId -> lie text
    this.playerGuesses = new Map(); // playerId -> option index
    this.playerLikes = new Map(); // playerId -> array of liked playerIds
    this.shuffledOptions = []; // All options (lies + truth) in random order
    this.truthIndex = -1; // Index of truth in shuffledOptions
    
    // Don't call init() here - it should be called explicitly
  }

  async init() {
    try {
      await this.questionService.loadQuestionPacks();
      console.log(`🎮 [GAME INIT] Game ${this.id} initialized with question packs`);
      this.initialized = true;
    } catch (error) {
      console.error('❌ [GAME INIT] Failed to initialize game:', error);
      this.initialized = false;
    }
  }

  // Player Management Methods
  addPlayer(name, socketId) {
    if (!this.initialized) {
      return { success: false, error: 'Game still initializing, please wait' };
    }

    if (this.players.size >= GAME_CONFIG.MAX_PLAYERS) {
      return { success: false, error: 'Game is full' };
    }

    if (this.state !== GAME_STATES.LOBBY) {
      return { success: false, error: 'Game already in progress' };
    }

    // Check if name is already taken
    for (const player of this.players.values()) {
      if (player.name === name) {
        return { success: false, error: 'Name already taken' };
      }
    }

    const player = new Player(name, socketId);
    this.players.set(player.id, player);
    
    console.log(`👥 [GAME STATE] Player ${name} joined game ${this.id} (${this.players.size}/${GAME_CONFIG.MAX_PLAYERS})`);
    
    this.broadcastToAll(SOCKET_EVENTS.PLAYER_JOINED, {
      player: player.getPublicData(),
      totalPlayers: this.players.size
    });

    return { success: true, player };
  }

  removePlayer(playerId) {
    const player = this.players.get(playerId);
    if (!player) return false;

    this.players.delete(playerId);
    
    console.log(`👥 [GAME STATE] Player ${player.name} left game ${this.id} (${this.players.size}/${GAME_CONFIG.MAX_PLAYERS})`);
    
    this.broadcastToAll(SOCKET_EVENTS.PLAYER_LEFT, {
      playerId,
      playerName: player.name,
      totalPlayers: this.players.size
    });

    // If we're in a game and this was the category selector, auto-advance
    if (this.categorySelector === playerId && this.state === GAME_STATES.CATEGORY_SELECTION) {
      console.log(`⚡ [GAME STATE] Category selector left, auto-selecting category`);
      this.timerService.cancelTimer('category_selection');
      this.autoSelectCategory();
    }

    return true;
  }

  reconnectPlayer(playerId, newSocketId) {
    const player = this.players.get(playerId);
    if (!player) return false;

    player.reconnect(newSocketId);
    
    console.log(`🔄 [GAME STATE] Player ${player.name} reconnected to game ${this.id}`);
    
    this.broadcastToAll(SOCKET_EVENTS.PLAYER_RECONNECTED, {
      playerId,
      playerName: player.name
    });

    // Send current game state to reconnected player
    this.sendGameStateToPlayer(playerId);
    return true;
  }

  disconnectPlayer(playerId) {
    const player = this.players.get(playerId);
    if (!player) return false;

    player.disconnect();
    console.log(`🔌 [GAME STATE] Player ${player.name} disconnected from game ${this.id}`);
    return true;
  }

  // Game Control Methods
  startGame() {
    if (this.state !== GAME_STATES.LOBBY) {
      return { success: false, error: 'Game already started' };
    }

    if (this.players.size < GAME_CONFIG.MIN_PLAYERS) {
      return { success: false, error: `Need at least ${GAME_CONFIG.MIN_PLAYERS} players` };
    }

    this.state = GAME_STATES.CATEGORY_SELECTION;
    this.currentRound = 1;
    this.currentQuestion = 1;

    // Reset all players for new game
    for (const player of this.players.values()) {
      player.resetForNewGame();
    }

    console.log(`🎮 [GAME STATE] Game started: Round ${this.currentRound}, Question ${this.currentQuestion}`);

    this.broadcastToAll(SOCKET_EVENTS.GAME_STARTED, {
      totalRounds: GAME_CONFIG.TOTAL_ROUNDS,
      questionsPerRound: GAME_CONFIG.QUESTIONS_PER_ROUND
    });

    this.startCategorySelection();
    return { success: true };
  }

  // Game State Transition Methods
  startCategorySelection() {
    this.state = GAME_STATES.CATEGORY_SELECTION;
    
    // Reset question state
    this.currentQuestionData = null;
    this.playerLies.clear();
    this.playerGuesses.clear();
    this.playerLikes.clear();
    this.shuffledOptions = [];
    
    // Reset player question state
    for (const player of this.players.values()) {
      player.resetForNewQuestion();
    }

    console.log(`📝 [GAME STATE] Starting category selection for Round ${this.currentRound}, Question ${this.currentQuestion}`);

    // For final round, skip category selection
    if (this.currentRound === GAME_CONFIG.FINAL_ROUND) {
      console.log(`🏁 [GAME STATE] Final round - auto-selecting question`);
      this.currentQuestionData = this.questionService.getRandomFinalRoundQuestion();
      this.startQuestionReading();
      return;
    }

    // Get category options and select random player to choose
    this.categoryOptions = this.questionService.getRandomCategories(false);
    const connectedPlayers = Array.from(this.players.values()).filter(p => p.status === 'connected');
    this.categorySelector = connectedPlayers[Math.floor(Math.random() * connectedPlayers.length)].id;
    const selector = this.players.get(this.categorySelector);

    console.log(`🎯 [GAME STATE] ${selector.name} selected to choose category (${TIMERS.CATEGORY_SELECTION / 1000}s timer)`);

    this.broadcastToAll(SOCKET_EVENTS.CATEGORY_SELECTION_START, {
      categories: this.categoryOptions.map(opt => ({ id: opt.id, category: opt.category })),
      selectorId: this.categorySelector,
      selectorName: selector.name,
      timeLimit: TIMERS.CATEGORY_SELECTION / 1000
    });

    // Start timer
    this.timerService.startTimer(
      'category_selection',
      TIMERS.CATEGORY_SELECTION,
      () => {
        console.log(`⏰ [TIMER] Category selection timer expired - auto-selecting`);
        this.autoSelectCategory();
      },
      (secondsRemaining) => this.broadcastToAll(SOCKET_EVENTS.TIMER_UPDATE, { 
        type: 'category_selection', 
        secondsRemaining 
      })
    );
  }

  selectCategory(playerId, categoryId) {
    if (this.state !== GAME_STATES.CATEGORY_SELECTION) {
      console.log(`❌ [CATEGORY] Wrong state: ${this.state}`);
      return { success: false, error: 'Not in category selection phase' };
    }

    if (playerId !== this.categorySelector) {
      const player = this.players.get(playerId);
      const selector = this.players.get(this.categorySelector);
      console.log(`❌ [CATEGORY] Wrong selector: ${player?.name} tried to select, but ${selector?.name} should select`);
      return { success: false, error: 'You are not the category selector' };
    }

    console.log(`🎯 [CATEGORY] Looking for category ID ${categoryId} in options:`, this.categoryOptions.map(opt => ({ id: opt.id, category: opt.category })));

    const selectedOption = this.categoryOptions.find(opt => opt.id === categoryId);
    if (!selectedOption) {
      console.log(`❌ [CATEGORY] Invalid category ID: ${categoryId}`);
      return { success: false, error: 'Invalid category' };
    }

    console.log(`✅ [GAME STATE] Category "${selectedOption.category}" selected by player`);

    this.timerService.cancelTimer('category_selection');
    this.currentQuestionData = selectedOption.question;
    this.startQuestionReading();
    
    return { success: true };
  }

  autoSelectCategory() {
    if (this.categoryOptions.length > 0) {
      const randomOption = this.categoryOptions[Math.floor(Math.random() * this.categoryOptions.length)];
      console.log(`🎲 [GAME STATE] Auto-selected category: "${randomOption.category}"`);
      this.currentQuestionData = randomOption.question;
      this.startQuestionReading();
    }
  }

  startQuestionReading() {
    this.state = GAME_STATES.QUESTION_READING;

    console.log(`❓ [GAME STATE] Displaying question: "${this.currentQuestionData.question}" (${TIMERS.QUESTION_READING / 1000}s)`);

    this.broadcastToAll(SOCKET_EVENTS.QUESTION_READING_START, {
      question: this.currentQuestionData.question,
      category: this.currentQuestionData.category,
      timeLimit: TIMERS.QUESTION_READING / 1000
    });

    this.timerService.startTimer(
      'question_reading',
      TIMERS.QUESTION_READING,
      () => {
        console.log(`⏰ [TIMER] Question reading timer expired - starting lie submission`);
        this.startLieSubmission();
      },
      (secondsRemaining) => this.broadcastToAll(SOCKET_EVENTS.TIMER_UPDATE, { 
        type: 'question_reading', 
        secondsRemaining 
      })
    );
  }

  startLieSubmission() {
    this.state = GAME_STATES.LIE_SUBMISSION;

    console.log(`🤥 [GAME STATE] Lie submission phase started (${TIMERS.LIE_SUBMISSION / 1000}s timer)`);

    this.broadcastToAll(SOCKET_EVENTS.LIE_SUBMISSION_START, {
      timeLimit: TIMERS.LIE_SUBMISSION / 1000
    });

    this.timerService.startTimer(
      'lie_submission',
      TIMERS.LIE_SUBMISSION,
      () => {
        console.log(`⏰ [TIMER] Lie submission timer expired`);
        this.autoCompleteSubmissions();
      },
      (secondsRemaining) => this.broadcastToAll(SOCKET_EVENTS.TIMER_UPDATE, { 
        type: 'lie_submission', 
        secondsRemaining 
      })
    );
  }

  submitLie(playerId, lie) {
    if (this.state !== GAME_STATES.LIE_SUBMISSION) {
      return { success: false, error: 'Not in lie submission phase' };
    }

    const player = this.players.get(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    // Check if lie is actually the truth
    if (lie.toLowerCase().trim() === this.currentQuestionData.answer.toLowerCase().trim()) {
      return { success: false, error: 'That\'s the truth! Submit a lie instead.' };
    }

    player.submitLie(lie);
    this.playerLies.set(playerId, lie);

    const connectedPlayers = Array.from(this.players.values()).filter(p => p.status === 'connected');
    const submittedCount = connectedPlayers.filter(p => p.hasSubmittedLie).length;
    
    console.log(`📝 [GAME STATE] Lie submitted (${submittedCount}/${connectedPlayers.length} players)`);

    // Check if all connected players have submitted
    this.checkLieSubmissionComplete();
    
    return { success: true };
  }

  checkLieSubmissionComplete() {
    const connectedPlayers = Array.from(this.players.values()).filter(p => p.status === 'connected');
    const submittedCount = connectedPlayers.filter(p => p.hasSubmittedLie).length;
    
    console.log(`📊 [LIE SUBMISSION] ${submittedCount}/${connectedPlayers.length} players have submitted lies`);
    
    // Only advance if ALL players have submitted
    if (submittedCount === connectedPlayers.length) {
      console.log(`✅ [GAME STATE] All players submitted lies - advancing early`);
      this.timerService.cancelTimer('lie_submission');
      this.startOptionSelection();
    } else {
      console.log(`⏳ [GAME STATE] Waiting for ${connectedPlayers.length - submittedCount} more players to submit lies`);
      // Don't auto-submit here - let the timer handle it
    }
  }

  // This method is called ONLY when the timer expires
  autoCompleteSubmissions() {
    const connectedPlayers = Array.from(this.players.values()).filter(p => p.status === 'connected');
    
    console.log(`⏰ [TIMER] Lie submission timer expired - auto-completing remaining submissions`);
    
    // Auto-submit lies for players who haven't submitted
    for (const player of connectedPlayers) {
      if (!player.hasSubmittedLie) {
        const autoLie = this.questionService.getRandomLieFromQuestion(this.currentQuestionData);
        player.submitLie(autoLie);
        this.playerLies.set(player.id, autoLie);
        console.log(`🤖 [GAME STATE] Auto-submitted lie for ${player.name}: "${autoLie}"`);
      }
    }

    this.startOptionSelection();
  }

  startOptionSelection() {
    this.state = GAME_STATES.OPTION_SELECTION;

    // Compile all options (player lies + truth), combining duplicate lies
    const lieMap = new Map();

    for (const [playerId, lie] of this.playerLies.entries()) {
      const key = lie.trim().toLowerCase();
      if (!lieMap.has(key)) {
        lieMap.set(key, { text: lie, type: 'lie', submittedBy: [playerId] });
      } else {
        lieMap.get(key).submittedBy.push(playerId);
      }
    }

    const uniqueOptions = Array.from(lieMap.values());

    // Pad with extra lies from the question to hide duplicates
    const playersCount = Array.from(this.players.values()).filter(p => p.status === 'connected').length;
    const usedTexts = new Set([...lieMap.keys(), this.currentQuestionData.answer.trim().toLowerCase()]);
    const fillerLies = [...this.currentQuestionData.lies];

    // simple shuffle of filler lies
    for (let i = fillerLies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fillerLies[i], fillerLies[j]] = [fillerLies[j], fillerLies[i]];
    }

    for (const lie of fillerLies) {
      if (uniqueOptions.length >= playersCount) break;
      const key = lie.trim().toLowerCase();
      if (!usedTexts.has(key)) {
        usedTexts.add(key);
        uniqueOptions.push({ text: lie, type: 'lie', submittedBy: null });
      }
    }

    // Add truth
    uniqueOptions.push({
      text: this.currentQuestionData.answer,
      type: 'truth',
      submittedBy: null
    });

    // Shuffle options
    this.shuffledOptions = this.questionService.shuffleOptions(uniqueOptions);
    
    // Find truth index in shuffled array
    this.truthIndex = this.shuffledOptions.findIndex(opt => opt.text === this.currentQuestionData.answer);

    console.log(`🗳️ [GAME STATE] Voting phase started with ${this.shuffledOptions.length} options (${TIMERS.OPTION_SELECTION / 1000}s timer)`);
    console.log(`🎯 [GAME STATE] Truth is at index ${this.truthIndex}: "${this.currentQuestionData.answer}"`);

    this.broadcastToAll(SOCKET_EVENTS.OPTION_SELECTION_START, {
      options: this.shuffledOptions.map(opt => ({ id: opt.id, text: opt.text })),
      timeLimit: TIMERS.OPTION_SELECTION / 1000
    });

    this.timerService.startTimer(
      'option_selection',
      TIMERS.OPTION_SELECTION,
      () => {
        console.log(`⏰ [TIMER] Option selection timer expired`);
        this.autoCompleteVoting();
      },
      (secondsRemaining) => this.broadcastToAll(SOCKET_EVENTS.TIMER_UPDATE, { 
        type: 'option_selection', 
        secondsRemaining 
      })
    );
  }

  selectOption(playerId, optionId) {
    if (this.state !== GAME_STATES.OPTION_SELECTION) {
      return { success: false, error: 'Not in option selection phase' };
    }

    const player = this.players.get(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    const option = this.shuffledOptions.find(opt => opt.id === optionId);
    if (!option) {
      return { success: false, error: 'Invalid option' };
    }

    const optionIndex = this.shuffledOptions.indexOf(option);
    player.selectOption(optionIndex);
    this.playerGuesses.set(playerId, optionIndex);

    const connectedPlayers = Array.from(this.players.values()).filter(p => p.status === 'connected');
    const selectedCount = connectedPlayers.filter(p => p.hasSelectedOption).length;
    
    console.log(`🗳️ [GAME STATE] Vote recorded (${selectedCount}/${connectedPlayers.length} players)`);

    this.checkOptionSelectionComplete();
    return { success: true };
  }

  likeLie(playerId, likedPlayerId) {
    // Players can like lies during option selection
    if (this.state !== GAME_STATES.OPTION_SELECTION) {
      return { success: false, error: 'Can only like lies during option selection' };
    }

    const player = this.players.get(playerId);
    const likedPlayer = this.players.get(likedPlayerId);
    
    if (!player || !likedPlayer) {
      return { success: false, error: 'Player not found' };
    }

    if (playerId === likedPlayerId) {
      return { success: false, error: 'Cannot like your own lie' };
    }

    player.likeLie(likedPlayerId);
    return { success: true };
  }

  checkOptionSelectionComplete() {
    const connectedPlayers = Array.from(this.players.values()).filter(p => p.status === 'connected');
    const selectedCount = connectedPlayers.filter(p => p.hasSelectedOption).length;
    
    console.log(`📊 [OPTION SELECTION] ${selectedCount}/${connectedPlayers.length} players have voted`);
    
    // Only advance if ALL players have voted
    if (selectedCount === connectedPlayers.length) {
      console.log(`✅ [GAME STATE] All players voted - advancing early`);
      this.timerService.cancelTimer('option_selection');
      this.startTruthReveal();
    } else {
      console.log(`⏳ [GAME STATE] Waiting for ${connectedPlayers.length - selectedCount} more players to vote`);
      // Don't auto-vote here - let the timer handle it
    }
  }

  // This method is called ONLY when the timer expires
  autoCompleteVoting() {
    const connectedPlayers = Array.from(this.players.values()).filter(p => p.status === 'connected');
    
    console.log(`⏰ [TIMER] Option selection timer expired - auto-voting for remaining players`);
    
    // Auto-vote for players who haven't voted (random choice)
    for (const player of connectedPlayers) {
      if (!player.hasSelectedOption) {
        const randomIndex = Math.floor(Math.random() * this.shuffledOptions.length);
        player.selectOption(randomIndex);
        this.playerGuesses.set(player.id, randomIndex);
        console.log(`🤖 [GAME STATE] Auto-voted for ${player.name}: option ${randomIndex}`);
      }
    }

    this.startTruthReveal();
  }

  startTruthReveal() {
    this.state = GAME_STATES.TRUTH_REVEAL;
    this.timerService.cancelTimer('option_selection');

    // Calculate scores and reveal results
    this.calculateScores();
    
    // Prepare reveal data
    const revealData = this.prepareRevealData();
    
    console.log(`🎯 [GAME STATE] Truth reveal: "${revealData.truth.answer}" (${revealData.truth.voteCount} correct votes)`);
    revealData.lies.forEach(lie => {
      console.log(`🤥 [GAME STATE] Lie: "${lie.lie}" by ${lie.submittedBy} (${lie.voteCount} votes)`);
    });
    
    this.broadcastToAll(SOCKET_EVENTS.TRUTH_REVEAL_START, revealData);

    // Move to scoreboard after reveal
    setTimeout(() => {
      this.showScoreboard();
    }, TIMERS.TRUTH_REVEAL);
  }

  calculateScores() {
    const pointMultiplier = GAME_CONFIG.POINTS[`ROUND_${this.currentRound}`];
    
    console.log(`🏆 [SCORING] Calculating scores for Round ${this.currentRound} (${pointMultiplier.FOOL_PLAYER}pts per fool, ${pointMultiplier.FIND_TRUTH}pts for truth)`);

    // Count votes for each option
    const voteCounts = new Map();
    for (const optionIndex of this.playerGuesses.values()) {
      voteCounts.set(optionIndex, (voteCounts.get(optionIndex) || 0) + 1);
    }

    // Award points for fooling players (lies that got votes)
    for (const [playerId, lie] of this.playerLies.entries()) {
      const player = this.players.get(playerId);
      if (!player) continue;

      // Find how many people voted for this player's lie
      let votesReceived = 0;
      for (const [voterId, optionIndex] of this.playerGuesses.entries()) {
        const votedOption = this.shuffledOptions[optionIndex];
        if (votedOption.text === lie) {
          votesReceived++;
        }
      }

      const foolPoints = votesReceived * pointMultiplier.FOOL_PLAYER;
      player.addPoints(foolPoints);
      player.roundStats.playersTooled += votesReceived;
      
      if (foolPoints > 0) {
        console.log(`🎯 [SCORING] ${player.name} fooled ${votesReceived} players (+${foolPoints} points)`);
      }
    }

    // Award points for finding the truth
    for (const [playerId, optionIndex] of this.playerGuesses.entries()) {
      if (optionIndex === this.truthIndex) {
        const player = this.players.get(playerId);
        if (player) {
          player.addPoints(pointMultiplier.FIND_TRUTH);
          player.roundStats.correctGuesses++;
          console.log(`✅ [SCORING] ${player.name} found the truth (+${pointMultiplier.FIND_TRUTH} points)`);
        }
      }
    }

    // Count likes received
    for (const player of this.players.values()) {
      let likesReceived = 0;
      for (const otherPlayer of this.players.values()) {
        if (otherPlayer.likes.includes(player.id)) {
          likesReceived++;
        }
      }
      player.roundStats.likesReceived = likesReceived;
      if (likesReceived > 0) {
        console.log(`👍 [SCORING] ${player.name} received ${likesReceived} likes`);
      }
    }
  }

  prepareRevealData() {
    // Group lies by vote count for dramatic reveal
    const liesByVotes = new Map();
    
    for (const [playerId, lie] of this.playerLies.entries()) {
      let votes = 0;
      const voters = [];
      
      for (const [voterId, optionIndex] of this.playerGuesses.entries()) {
        const votedOption = this.shuffledOptions[optionIndex];
        if (votedOption.text === lie) {
          votes++;
          voters.push(this.players.get(voterId).name);
        }
      }
      
      if (!liesByVotes.has(votes)) {
        liesByVotes.set(votes, []);
      }
      
      liesByVotes.get(votes).push({
        lie,
        submittedBy: this.players.get(playerId).name,
        submittedById: playerId,
        voters,
        voteCount: votes
      });
    }

    // Sort by vote count (ascending for dramatic effect)
    const sortedLies = [];
    const voteCounts = Array.from(liesByVotes.keys()).sort((a, b) => a - b);
    
    for (const voteCount of voteCounts) {
      const liesWithThisCount = liesByVotes.get(voteCount);
      // Randomize order of lies with same vote count
      liesWithThisCount.sort(() => 0.5 - Math.random());
      sortedLies.push(...liesWithThisCount);
    }

    // Find who voted for the truth
    const truthVoters = [];
    for (const [playerId, optionIndex] of this.playerGuesses.entries()) {
      if (optionIndex === this.truthIndex) {
        truthVoters.push(this.players.get(playerId).name);
      }
    }

    return {
      lies: sortedLies,
      truth: {
        answer: this.currentQuestionData.answer,
        voters: truthVoters,
        voteCount: truthVoters.length
      },
      question: this.currentQuestionData.question
    };
  }

  showScoreboard() {
    this.state = GAME_STATES.SCOREBOARD;

    // Sort players by points (descending)
    const sortedPlayers = Array.from(this.players.values())
      .sort((a, b) => b.points - a.points)
      .map((player, index) => ({
        ...player.getScoreboardData(),
        rank: index + 1
      }));

    console.log(`🏆 [GAME STATE] Scoreboard for Round ${this.currentRound}, Question ${this.currentQuestion}:`);
    sortedPlayers.forEach(player => {
      console.log(`   ${player.rank}. ${player.name}: ${player.points} points`);
    });

    this.broadcastToAll(SOCKET_EVENTS.SCOREBOARD_UPDATE, {
      players: sortedPlayers,
      round: this.currentRound,
      question: this.currentQuestion,
      isGameEnd: this.isGameEnd()
    });

    // Advance to next question or end game
    setTimeout(() => {
      this.advanceGame();
    }, TIMERS.SCOREBOARD);
  }

  advanceGame() {
    if (this.isGameEnd()) {
      this.endGame();
      return;
    }

    // Advance question/round
    if (this.currentRound < GAME_CONFIG.FINAL_ROUND) {
      if (this.currentQuestion < GAME_CONFIG.QUESTIONS_PER_ROUND) {
        this.currentQuestion++;
        console.log(`🎮 [GAME STATE] Advancing to Round ${this.currentRound}, Question ${this.currentQuestion}`);
      } else {
        this.currentRound++;
        this.currentQuestion = 1;
        console.log(`🎮 [GAME STATE] Advancing to Round ${this.currentRound}, Question ${this.currentQuestion}`);
      }
    } else {
      // Final round has only 1 question
      this.endGame();
      return;
    }

    this.startCategorySelection();
  }

  isGameEnd() {
    return (this.currentRound === GAME_CONFIG.FINAL_ROUND && this.currentQuestion === 1 && this.state === GAME_STATES.SCOREBOARD) ||
           (this.currentRound > GAME_CONFIG.FINAL_ROUND);
  }

  endGame() {
    this.state = GAME_STATES.GAME_ENDED;
    this.timerService.cancelAllTimers();

    // Final scoreboard
    const finalScores = Array.from(this.players.values())
      .sort((a, b) => b.points - a.points)
      .map((player, index) => ({
        ...player.getScoreboardData(),
        rank: index + 1
      }));

    console.log(`🏁 [GAME STATE] Game ended! Final scores:`);
    finalScores.forEach(player => {
      console.log(`   ${player.rank}. ${player.name}: ${player.points} points`);
    });
    console.log(`🎊 [GAME STATE] Winner: ${finalScores[0].name}!`);

    this.broadcastToAll(SOCKET_EVENTS.GAME_ENDED, {
      finalScores,
      winner: finalScores[0]
    });

    // Reset to lobby after a delay
    setTimeout(() => {
      this.returnToLobby();
    }, 10000);
  }

  returnToLobby() {
    this.state = GAME_STATES.LOBBY;
    this.currentRound = 1;
    this.currentQuestion = 1;
    this.currentQuestionData = null;
    
    console.log(`🔄 [GAME STATE] Returned to lobby - ready for new game`);
    
    // Reset all players but keep them in the game
    for (const player of this.players.values()) {
      player.resetForNewGame();
    }

    this.broadcastToAll(SOCKET_EVENTS.GAME_STATE_UPDATE, this.getGameState());
  }

  // Utility Methods
  getGameState() {
    return {
      gameId: this.id,
      state: this.state,
      players: Array.from(this.players.values()).map(p => p.getPublicData()),
      currentRound: this.currentRound,
      currentQuestion: this.currentQuestion,
      totalRounds: GAME_CONFIG.TOTAL_ROUNDS,
      questionsPerRound: GAME_CONFIG.QUESTIONS_PER_ROUND,
      categorySelector: this.categorySelector,
      currentQuestionData: this.state === GAME_STATES.QUESTION_READING ? this.currentQuestionData : null,
      availableQuestionPacks: this.questionService.getAvailablePacks(),
      currentQuestionPack: this.questionService.currentPack
    };
  }

  getSubStepInfo(playerId) {
    const baseInfo = {
      state: this.state,
      isSelector: this.categorySelector === playerId,
      hasSubmittedLie: this.players.get(playerId)?.hasSubmittedLie || false,
      hasSelectedOption: this.players.get(playerId)?.hasSelectedOption || false
    };

    switch (this.state) {
      case GAME_STATES.CATEGORY_SELECTION:
        return {
          ...baseInfo,
          categories: this.categoryOptions?.map(opt => ({ id: opt.id, category: opt.category })),
          timeRemaining: Math.ceil(this.timerService.getRemainingTime('category_selection') / 1000)
        };
      case GAME_STATES.QUESTION_READING:
        return {
          ...baseInfo,
          question: this.currentQuestionData,
          timeRemaining: Math.ceil(this.timerService.getRemainingTime('question_reading') / 1000)
        };
      case GAME_STATES.LIE_SUBMISSION:
        return {
          ...baseInfo,
          timeRemaining: Math.ceil(this.timerService.getRemainingTime('lie_submission') / 1000)
        };
      case GAME_STATES.OPTION_SELECTION:
        return {
          ...baseInfo,
          options: this.shuffledOptions?.map(opt => ({ id: opt.id, text: opt.text })),
          timeRemaining: Math.ceil(this.timerService.getRemainingTime('option_selection') / 1000)
        };
      default:
        return baseInfo;
    }
  }

  sendGameStateToPlayer(playerId) {
    const player = this.players.get(playerId);
    if (!player || !player.socketId) {
      console.warn(`❌ Cannot send game state to player ${playerId}: player not found or no socket`);
      return;
    }

    console.log(`📤 [GAME STATE] Sending game state to ${player.name} (${this.state})`);
    
    // Send both game state and sub-step info
    this.io.to(player.socketId).emit(SOCKET_EVENTS.GAME_STATE_UPDATE, this.getGameState());
    this.io.to(player.socketId).emit('sub_step_info', this.getSubStepInfo(playerId));
  }

  broadcastToAll(event, data) {
    for (const player of this.players.values()) {
      if (player.socketId) {
        this.io.to(player.socketId).emit(event, data);
      }
    }
  }

  getRandomLieForCurrentQuestion() {
    if (!this.currentQuestionData) {
      return null;
    }
    return this.questionService.getRandomLieFromQuestion(this.currentQuestionData);
  }

  changeQuestionPack(packName) {
    if (this.state !== GAME_STATES.LOBBY) {
      return { success: false, error: 'Can only change question pack in lobby' };
    }

    if (this.questionService.setCurrentPack(packName)) {
      console.log(`📦 [GAME STATE] Question pack changed to: ${packName}`);
      this.broadcastToAll(SOCKET_EVENTS.GAME_STATE_UPDATE, this.getGameState());
      return { success: true };
    }

    return { success: false, error: 'Question pack not found' };
  }
}

module.exports = Game;