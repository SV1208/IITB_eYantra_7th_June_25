import Monster from '../src/js/monster.js';

describe('Monster Class', () => {
    let monster;

    beforeEach(() => {
        monster = new Monster();
    });

    test('should move randomly on the grid', () => {
        const initialPosition = { x: monster.x, y: monster.y };
        monster.moveRandomly();
        expect(monster.x).not.toBe(initialPosition.x);
        expect(monster.y).not.toBe(initialPosition.y);
    });

    test('should detect collision with the hero', () => {
        const heroPosition = { x: 2, y: 2 };
        monster.x = 2;
        monster.y = 2;
        expect(monster.checkCollision(heroPosition)).toBe(true);
    });

    test('should not detect collision when not overlapping', () => {
        const heroPosition = { x: 1, y: 1 };
        monster.x = 2;
        monster.y = 2;
        expect(monster.checkCollision(heroPosition)).toBe(false);
    });
});