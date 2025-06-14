// Game constants
const GAME_STATES = {
  LOBBY: 'lobby',
  CATEGORY_SELECTION: 'category_selection', 
  QUESTION_READING: 'question_reading',
  LIE_SUBMISSION: 'lie_submission',
  OPTION_SELECTION: 'option_selection',
  TRUTH_REVEAL: 'truth_reveal',
  SCOREBOARD: 'scoreboard',
  GAME_ENDED: 'game_ended'
};

const PLAYER_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected'
};

const TIMERS = {
  CATEGORY_SELECTION: 15000, // 15 seconds
  QUESTION_READING: 10000,   // 10 seconds
  LIE_SUBMISSION: 30000,     // 30 seconds
  OPTION_SELECTION: 30000,   // 30 seconds
  TRUTH_REVEAL: 5000,        // 5 seconds per lie reveal
  SCOREBOARD: 10000          // 10 seconds
};

const GAME_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 16,
  QUESTIONS_PER_ROUND: 8,
  TOTAL_ROUNDS: 3,
  FINAL_ROUND: 3,
  CATEGORIES_PER_QUESTION: 4,
  POINTS: {
    ROUND_1: {
      FOOL_PLAYER: 500,
      FIND_TRUTH: 1000
    },
    ROUND_2: {
      FOOL_PLAYER: 1000,  // doubled
      FIND_TRUTH: 2000
    },
    ROUND_3: {
      FOOL_PLAYER: 1500,  // tripled
      FIND_TRUTH: 3000
    }
  }
};

const SOCKET_EVENTS = {
  // Client to Server
  JOIN_GAME: 'join_game',
  LEAVE_GAME: 'leave_game',
  START_GAME: 'start_game',
  SELECT_CATEGORY: 'select_category',
  SUBMIT_LIE: 'submit_lie',
  AUTO_LIE: 'auto_lie',
  SELECT_OPTION: 'select_option',
  LIKE_LIE: 'like_lie',
  UPDATE_AVATAR: 'update_avatar',
  REQUEST_GAME_STATE: 'request_game_state',
  CHANGE_QUESTION_PACK: 'change_question_pack',
  
  // Server to Client
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  PLAYER_RECONNECTED: 'player_reconnected',
  GAME_STATE_UPDATE: 'game_state_update',
  GAME_STARTED: 'game_started',
  CATEGORY_SELECTION_START: 'category_selection_start',
  QUESTION_READING_START: 'question_reading_start',
  LIE_SUBMISSION_START: 'lie_submission_start',
  OPTION_SELECTION_START: 'option_selection_start',
  TRUTH_REVEAL_START: 'truth_reveal_start',
  SCOREBOARD_UPDATE: 'scoreboard_update',
  GAME_ENDED: 'game_ended',
  ERROR: 'error',
  TIMER_UPDATE: 'timer_update',
  PLAYER_AVATAR_UPDATED: 'player_avatar_updated',
  HOST_SUB_STEP_INFO: 'host_sub_step_info',
  AVAILABLE_QUESTION_PACKS: 'available_question_packs'
};

const AVATAR_EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '🥰', '😍', '🤩', '😎', '🤓',
  '🤔', '😏', '😊', '☺️', '😌', '😉', '🤭', '😋', '😛', '😜',
  '🤪', '😇', '🥳', '🤠', '🤡', '🤖', '👻', '🎃', '🔥', '⭐',
  '🌟', '✨', '💫', '🌈', '🦄', '🐱', '🐶', '🐸', '🐵', '🦊'
];

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A3CB38',
  '#FD79A8', '#E17055', '#74B9FF', '#81ECEC', '#FAB1A0'
];

module.exports = {
  GAME_STATES,
  PLAYER_STATUS,
  TIMERS,
  GAME_CONFIG,
  SOCKET_EVENTS,
  AVATAR_EMOJIS,
  AVATAR_COLORS
};
