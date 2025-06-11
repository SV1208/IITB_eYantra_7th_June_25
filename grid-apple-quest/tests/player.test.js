// This file contains unit tests for the Player class, verifying that movement and collision detection work as expected.

import { Player } from '../src/js/player.js';

describe('Player Class', () => {
    let player;

    beforeEach(() => {
        player = new Player();
    });

    test('initial position should be (0, 0)', () => {
        expect(player.position).toEqual({ x: 0, y: 0 });
    });

    test('move right to (0, 1)', () => {
        player.move('right');
        expect(player.position).toEqual({ x: 0, y: 1 });
    });

    test('move down to (1, 0)', () => {
        player.move('down');
        expect(player.position).toEqual({ x: 1, y: 0 });
    });

    test('collision with monster', () => {
        player.position = { x: 1, y: 1 };
        const monsterPosition = { x: 1, y: 1 };
        expect(player.checkCollision(monsterPosition)).toBe(true);
    });

    test('reaching the apple', () => {
        player.position = { x: 2, y: 2 };
        const applePosition = { x: 2, y: 2 };
        expect(player.checkCollision(applePosition)).toBe(true);
    });
});