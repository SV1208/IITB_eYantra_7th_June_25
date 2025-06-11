const { Game } = require('../src/js/game');
const { Player } = require('../src/js/player');
const { Monster } = require('../src/js/monster');

describe('Game Logic', () => {
    let game;

    beforeEach(() => {
        game = new Game();
        game.initialize();
    });

    test('Game initializes correctly', () => {
        expect(game.isGameOver).toBe(false);
        expect(game.player.position).toEqual({ x: 0, y: 0 });
        expect(game.applePosition).toBeDefined();
        expect(game.monsters.length).toBeGreaterThan(0);
    });

    test('Player reaches the apple', () => {
        game.player.position = game.applePosition;
        game.checkWinCondition();
        expect(game.isGameOver).toBe(true);
        expect(game.hasWon).toBe(true);
    });

    test('Player collides with a monster', () => {
        game.player.position = game.monsters[0].position;
        game.checkLoseCondition();
        expect(game.isGameOver).toBe(true);
        expect(game.hasLost).toBe(true);
    });

    test('Game resets correctly', () => {
        game.reset();
        expect(game.isGameOver).toBe(false);
        expect(game.player.position).toEqual({ x: 0, y: 0 });
    });
});