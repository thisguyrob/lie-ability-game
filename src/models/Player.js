const { v4: uuidv4 } = require('uuid');
const { PLAYER_STATUS, AVATAR_EMOJIS, AVATAR_COLORS } = require('../utils/constants');

class Player {
  constructor(name, socketId) {
    this.id = uuidv4();
    this.name = name;
    this.socketId = socketId;
    this.status = PLAYER_STATUS.CONNECTED;
    this.points = 0;
    this.avatar = this.generateAvatar();
    
    // Game state tracking
    this.currentLie = null;
    this.currentGuess = null;
    this.likes = [];
    this.hasSubmittedLie = false;
    this.hasSelectedOption = false;

    // Track how many players this player's last lie fooled
    this.playersFooledLastQuestion = 0;
    
    // Round tracking
    this.roundStats = {
      liesSubmitted: [],
      correctGuesses: 0,
      playersFooled: 0,
      likesReceived: 0
    };
  }

  generateAvatar() {
    const emoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    return { emoji, color };
  }

  setAvatar(emoji, color) {
    this.avatar = { emoji, color };
  }

  updateSocketId(newSocketId) {
    this.socketId = newSocketId;
    this.status = PLAYER_STATUS.CONNECTED;
  }

  disconnect() {
    this.status = PLAYER_STATUS.DISCONNECTED;
    this.socketId = null;
  }

  reconnect(socketId) {
    this.socketId = socketId;
    this.status = PLAYER_STATUS.CONNECTED;
  }

  submitLie(lie) {
    this.currentLie = lie;
    this.hasSubmittedLie = true;
    this.roundStats.liesSubmitted.push(lie);
  }

  selectOption(optionIndex) {
    this.currentGuess = optionIndex;
    this.hasSelectedOption = true;
  }

  likeLie(playerId) {
    if (!this.likes.includes(playerId)) {
      this.likes.push(playerId);
    }
  }

  addPoints(points) {
    this.points += points;
  }

  resetForNewQuestion() {
    this.currentLie = null;
    this.currentGuess = null;
    this.likes = [];
    this.hasSubmittedLie = false;
    this.hasSelectedOption = false;
    this.playersFooledLastQuestion = 0;
  }

  resetForNewGame() {
    this.points = 0;
    this.roundStats = {
      liesSubmitted: [],
      correctGuesses: 0,
      playersFooled: 0,
      likesReceived: 0
    };
    this.resetForNewQuestion();
  }

  // Get safe player data for sending to clients
  getPublicData() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      points: this.points,
      avatar: this.avatar,
      hasSubmittedLie: this.hasSubmittedLie,
      hasSelectedOption: this.hasSelectedOption,
      currentLie: this.currentLie, // Only include this in certain contexts
      likesCount: this.likes.length
    };
  }

  // Get minimal data for scoreboard
  getScoreboardData() {
    return {
      id: this.id,
      name: this.name,
      points: this.points,
      avatar: this.avatar,
      lastLie: this.roundStats.liesSubmitted[this.roundStats.liesSubmitted.length - 1] || null,
      likesReceived: this.roundStats.likesReceived,
      playersFooled: this.playersFooledLastQuestion
    };
  }
}

module.exports = Player;
