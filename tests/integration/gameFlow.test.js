const Game = require('../../src/models/Game');
const { GAME_STATES } = require('../../src/utils/constants');

describe('Integration - Complete Game Flow', () => {
  let game;
  const mockIo = { to: jest.fn().mockReturnThis(), emit: jest.fn() };

  beforeEach(async () => {
    jest.useFakeTimers();
    game = new Game(mockIo);
    await game.init();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should play through a full question cycle with two players', () => {
    const { player: p1 } = game.addPlayer('Alice', 'socket1');
    const { player: p2 } = game.addPlayer('Bob', 'socket2');

    const start = game.startGame();
    expect(start.success).toBe(true);
    expect(game.state).toBe(GAME_STATES.CATEGORY_SELECTION);

    // Select a category
    const selector = game.players.get(game.categorySelector);
    const categoryId = game.categoryOptions[0].id;
    game.selectCategory(selector.id, categoryId);
    expect(game.state).toBe(GAME_STATES.QUESTION_READING);

    // Advance to lie submission
    jest.runOnlyPendingTimers();
    expect(game.state).toBe(GAME_STATES.LIE_SUBMISSION);

    game.submitLie(p1.id, 'First lie');
    game.submitLie(p2.id, 'Second lie');

    expect(game.state).toBe(GAME_STATES.OPTION_SELECTION);

    const optionForP1 = game.getSubStepInfo(p1.id).options[0];
    const optionForP2 = game.getSubStepInfo(p2.id).options[0];

    game.selectOption(p1.id, optionForP1.id);
    game.selectOption(p2.id, optionForP2.id);

    expect(game.state).toBe(GAME_STATES.TRUTH_REVEAL);

    // Move to scoreboard
    jest.runOnlyPendingTimers();
    expect(game.state).toBe(GAME_STATES.SCOREBOARD);

    // Advance to next question (start of new round)
    jest.runOnlyPendingTimers();
    expect(game.state).toBe(GAME_STATES.CATEGORY_SELECTION);
  });
});
