class Monster {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        const dx = Math.sign(player.x - this.x);
        const dy = Math.sign(player.y - this.y);
        
        const newX = this.x + (Math.random() < 0.7 ? dx : 0);
        const newY = this.y + (Math.random() < 0.7 ? dy : 0);

        if (newX >= 0 && newX < grid.width && newY >= 0 && newY < grid.height) {
            grid.clearCell(this.x, this.y);
            this.x = newX;
            this.y = newY;
            
            if (grid.getCell(this.x, this.y) === 'player') {
                gameOver();
                return;
            }
            
            grid.setCell(this.x, this.y, 'monster');
        }
    }
}

let monsters = [];

function spawnMonster() {
    const pos = grid.getRandomEmptyPosition();
    if (pos) {
        const monster = new Monster(pos.x, pos.y);
        monsters.push(monster);
        grid.setCell(pos.x, pos.y, 'monster');
        console.log('Monster spawned at:', monster.x, monster.y); // Debug: Confirm monster spawn
    } else {
        console.warn('No empty position to spawn monster!');
    }
}

function moveMonsters() {
    monsters.forEach(monster => monster.move());
}

function clearMonsters() {
    monsters.forEach(monster => grid.clearCell(monster.x, monster.y));
    monsters = [];
}

// Make Monster and functions global
window.Monster = Monster;
window.monsters = monsters;
window.spawnMonster = spawnMonster;
window.moveMonsters = moveMonsters;
window.clearMonsters = clearMonsters;

// Monster/Ghost management functionality
// This file is part of the modular structure but main logic is in game.js

console.log("Monster module loaded - functionality integrated into game.js");