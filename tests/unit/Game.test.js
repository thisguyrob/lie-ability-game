const Game = require('../../src/models/Game');
const { GAME_STATES } = require('../../src/utils/constants');

describe('Game', () => {
  let game;
  const mockIo = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    game = new Game(mockIo);
    await game.init();
  });

  test('should start in lobby state', () => {
    expect(game.state).toBe(GAME_STATES.LOBBY);
  });

  test('should add players correctly', () => {
    const result = game.addPlayer('Test', 'socket1');
    expect(result.success).toBe(true);
    expect(game.players.size).toBe(1);
  });

  test('should remove players correctly', () => {
    const { player } = game.addPlayer('Test', 'socket1');
    expect(game.players.size).toBe(1);
    const removed = game.removePlayer(player.id);
    expect(removed).toBe(true);
    expect(game.players.size).toBe(0);
  });
});
