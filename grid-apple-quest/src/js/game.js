// Grid Apple Quest - Main Game Logic
// Proper keyboard controls and auto-play functionality

// Game state management
let gameState = {
    grid: null,
    player: null,
    monsters: [],
    apples: [],
    score: 0,
    gameRunning: false,
    autoPlay: false,
    autoPlayInterval: null,
    speed: 300,
    gridSize: { width: 10, height: 8 }
};

// Initialize the game
function initializeGame() {
    setupGrid();
    setupEventListeners();
    startGame();
}

// Setup the game grid
function setupGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    gridElement.style.display = 'inline-grid';
    gridElement.style.gridTemplateColumns = `repeat(${gameState.gridSize.width}, 50px)`;
    gridElement.style.gridTemplateRows = `repeat(${gameState.gridSize.height}, 50px)`;
    gridElement.style.gap = '2px';
    gridElement.style.padding = '10px';
    gridElement.style.border = '3px solid #333';
    gridElement.style.backgroundColor = '#333';
    gridElement.style.borderRadius = '10px';
    gridElement.style.margin = '20px auto';
    
    // Create grid cells
    for (let i = 0; i < gameState.gridSize.width * gameState.gridSize.height; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.width = '50px';
        cell.style.height = '50px';
        cell.style.backgroundColor = '#f0f0f0';
        cell.style.border = '1px solid #ddd';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.fontSize = '24px';
        cell.style.position = 'relative';
        gridElement.appendChild(cell);
    }
}

// Setup event listeners for keyboard controls
function setupEventListeners() {
    // Remove any existing event listeners
    document.removeEventListener('keydown', handleKeyPress);
    document.removeEventListener('keyup', handleKeyRelease);
    
    // Add new event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyRelease);
    
    // Prevent default arrow key behavior for better game control
    document.addEventListener('keydown', function(e) {
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
            e.preventDefault();
        }
    });
}

// Handle keyboard input
function handleKeyPress(event) {
    // Don't process keys if game is not running or auto-play is active
    if (!gameState.gameRunning || gameState.autoPlay) return;
    
    let moved = false;
    
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            moved = movePlayer(0, -1);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            moved = movePlayer(0, 1);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moved = movePlayer(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            moved = movePlayer(1, 0);
            break;
        case ' ':
        case 'Spacebar':
            toggleAutoPlay();
            break;
    }
    
    if (moved) {
        updateDisplay();
        checkCollisions();
        checkWinCondition();
    }
}

function handleKeyRelease(event) {
    // Handle key release if needed for smoother movement
}

// Start a new game
function startGame() {
    gameState.gameRunning = true;
    gameState.score = 0;
    
    // Initialize player at position (1, 1)
    gameState.player = { x: 1, y: 1 };
    
    // Place apples randomly
    gameState.apples = [];
    for (let i = 0; i < 5; i++) {
        let apple;
        do {
            apple = {
                x: Math.floor(Math.random() * gameState.gridSize.width),
                y: Math.floor(Math.random() * gameState.gridSize.height)
            };
        } while (isPositionOccupied(apple.x, apple.y));
        gameState.apples.push(apple);
    }
    
    // Place monsters randomly
    gameState.monsters = [];
    for (let i = 0; i < 3; i++) {
        let monster;
        do {
            monster = {
                x: Math.floor(Math.random() * gameState.gridSize.width),
                y: Math.floor(Math.random() * gameState.gridSize.height)
            };
        } while (isPositionOccupied(monster.x, monster.y));
        gameState.monsters.push(monster);
    }
    
    updateDisplay();
    updateScore();
    updateMessage("Game started! Use arrow keys to move or click Auto-Play!");
}

// Reset the game
function resetGame() {
    gameState.gameRunning = false;
    gameState.autoPlay = false;
    
    if (gameState.autoPlayInterval) {
        clearInterval(gameState.autoPlayInterval);
        gameState.autoPlayInterval = null;
    }
    
    document.getElementById('autoPlayBtn').textContent = 'Start Auto-Play';
    document.getElementById('pauseBtn').disabled = true;
    
    startGame();
}

// Check if position is occupied
function isPositionOccupied(x, y) {
    if (gameState.player && gameState.player.x === x && gameState.player.y === y) return true;
    return gameState.apples.some(apple => apple.x === x && apple.y === y) ||
           gameState.monsters.some(monster => monster.x === x && monster.y === y);
}

// Check if position is valid
function isValidPosition(x, y) {
    return x >= 0 && x < gameState.gridSize.width && y >= 0 && y < gameState.gridSize.height;
}

// Move player
function movePlayer(dx, dy) {
    if (!gameState.gameRunning) return false;
    
    const newX = gameState.player.x + dx;
    const newY = gameState.player.y + dy;
    
    if (!isValidPosition(newX, newY)) return false;
    
    gameState.player.x = newX;
    gameState.player.y = newY;
    
    return true;
}

// Check for collisions
function checkCollisions() {
    // Check apple collection
    const appleIndex = gameState.apples.findIndex(apple => 
        apple.x === gameState.player.x && apple.y === gameState.player.y
    );
    
    if (appleIndex !== -1) {
        gameState.apples.splice(appleIndex, 1);
        gameState.score += 10;
        updateScore();
        updateMessage("Apple collected! +10 points");
    }
    
    // Check monster collision
    const monsterCollision = gameState.monsters.some(monster => 
        monster.x === gameState.player.x && monster.y === gameState.player.y
    );
    
    if (monsterCollision) {
        gameState.gameRunning = false;
        gameState.autoPlay = false;
        if (gameState.autoPlayInterval) {
            clearInterval(gameState.autoPlayInterval);
            gameState.autoPlayInterval = null;
        }
        document.getElementById('autoPlayBtn').textContent = 'Start Auto-Play';
        document.getElementById('pauseBtn').disabled = true;
        updateMessage("Game Over! Monster caught you! Press Start Game to try again.");
    }
}

// Check win condition
function checkWinCondition() {
    if (gameState.apples.length === 0) {
        gameState.gameRunning = false;
        gameState.autoPlay = false;
        if (gameState.autoPlayInterval) {
            clearInterval(gameState.autoPlayInterval);
            gameState.autoPlayInterval = null;
        }
        document.getElementById('autoPlayBtn').textContent = 'Start Auto-Play';
        document.getElementById('pauseBtn').disabled = true;
        updateMessage("You Win! All apples collected! Press Start Game for a new round.");
    }
}

// Update display
function updateDisplay() {
    const cells = document.querySelectorAll('.cell');
    
    // Clear all cells
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#f0f0f0';
        cell.style.position = 'relative';
    });
    
    // Draw apples first (background layer)
    gameState.apples.forEach(apple => {
        const appleIndex = apple.y * gameState.gridSize.width + apple.x;
        if (cells[appleIndex]) {
            cells[appleIndex].textContent = '🍎';
            cells[appleIndex].style.backgroundColor = '#FF9800';
        }
    });
    
    // Draw monsters (middle layer)
    gameState.monsters.forEach(monster => {
        const monsterIndex = monster.y * gameState.gridSize.width + monster.x;
        if (cells[monsterIndex]) {
            // Check if there's an apple at the same position
            const hasApple = gameState.apples.some(apple => apple.x === monster.x && apple.y === monster.y);
            if (hasApple) {
                // Show both apple and monster with monster on top
                cells[monsterIndex].innerHTML = '<span style="position: absolute; bottom: 0; right: 0; font-size: 12px;">🍎</span><span style="position: relative; z-index: 2;">👻</span>';
            } else {
                cells[monsterIndex].textContent = '👻';
            }
            cells[monsterIndex].style.backgroundColor = '#f44336';
        }
    });
    
    // Draw player last (top layer - highest priority)
    if (gameState.player) {
        const playerIndex = gameState.player.y * gameState.gridSize.width + gameState.player.x;
        if (cells[playerIndex]) {
            // Check if there's an apple at the same position
            const hasApple = gameState.apples.some(apple => apple.x === gameState.player.x && apple.y === gameState.player.y);
            const hasMonster = gameState.monsters.some(monster => monster.x === gameState.player.x && monster.y === gameState.player.y);
            
            if (hasApple && hasMonster) {
                // Show all three with player on top
                cells[playerIndex].innerHTML = '<span style="position: absolute; bottom: 0; left: 0; font-size: 12px;">🍎</span><span style="position: absolute; bottom: 0; right: 0; font-size: 12px;">👻</span><span style="position: relative; z-index: 3;">😊</span>';
            } else if (hasApple) {
                // Show apple in background, player on top
                cells[playerIndex].innerHTML = '<span style="position: absolute; bottom: 0; right: 0; font-size: 12px;">🍎</span><span style="position: relative; z-index: 2;">😊</span>';
            } else if (hasMonster) {
                // Show monster in background, player on top (collision will be handled separately)
                cells[playerIndex].innerHTML = '<span style="position: absolute; bottom: 0; right: 0; font-size: 12px;">👻</span><span style="position: relative; z-index: 2;">😊</span>';
            } else {
                // Just player
                cells[playerIndex].textContent = '😊';
            }
            cells[playerIndex].style.backgroundColor = '#4CAF50';
        }
    }
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = gameState.score;
}

// Update message
function updateMessage(message) {
    document.getElementById('message').textContent = message;
}

// Auto-play functionality
function toggleAutoPlay() {
    const btn = document.getElementById('autoPlayBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (!gameState.autoPlay) {
        gameState.autoPlay = true;
        btn.textContent = 'Stop Auto-Play';
        pauseBtn.disabled = false;
        
        gameState.autoPlayInterval = setInterval(() => {
            autoStep();
        }, gameState.speed);
        
        updateMessage("Auto-play started! AI is now controlling the player.");
    } else {
        gameState.autoPlay = false;
        btn.textContent = 'Start Auto-Play';
        pauseBtn.disabled = true;
        
        if (gameState.autoPlayInterval) {
            clearInterval(gameState.autoPlayInterval);
            gameState.autoPlayInterval = null;
        }
        
        updateMessage("Auto-play stopped! Use arrow keys to control the player.");
    }
}

function pauseGame() {
    if (gameState.autoPlayInterval) {
        clearInterval(gameState.autoPlayInterval);
        gameState.autoPlayInterval = null;
        document.getElementById('pauseBtn').textContent = 'Resume';
        document.getElementById('pauseBtn').onclick = resumeGame;
        updateMessage("Auto-play paused!");
    }
}

function resumeGame() {
    if (gameState.autoPlay && gameState.gameRunning) {
        gameState.autoPlayInterval = setInterval(() => {
            autoStep();
        }, gameState.speed);
        document.getElementById('pauseBtn').textContent = 'Pause';
        document.getElementById('pauseBtn').onclick = pauseGame;
        updateMessage("Auto-play resumed!");
    }
}

function updateSpeed() {
    const slider = document.getElementById('speedSlider');
    gameState.speed = parseInt(slider.value);
    document.getElementById('speedValue').textContent = gameState.speed + 'ms';
    
    // Update interval if auto-play is running
    if (gameState.autoPlayInterval) {
        clearInterval(gameState.autoPlayInterval);
        gameState.autoPlayInterval = setInterval(() => {
            autoStep();
        }, gameState.speed);
    }
}

// AI auto-step function
function autoStep() {
    if (!gameState.gameRunning || !gameState.autoPlay) return;
    
    const move = getNextMove();
    if (move) {
        const moved = movePlayer(move.dx, move.dy);
        if (moved) {
            updateDisplay();
            checkCollisions();
            checkWinCondition();
        }
    }
}

// Simple AI to find next move with basic pathfinding
function getNextMove() {
    if (gameState.apples.length === 0) return null;
    
    // Find nearest apple using Manhattan distance
    let nearestApple = gameState.apples[0];
    let minDistance = Math.abs(gameState.player.x - nearestApple.x) + Math.abs(gameState.player.y - nearestApple.y);
    
    for (let i = 1; i < gameState.apples.length; i++) {
        const distance = Math.abs(gameState.player.x - gameState.apples[i].x) + Math.abs(gameState.player.y - gameState.apples[i].y);
        if (distance < minDistance) {
            minDistance = distance;
            nearestApple = gameState.apples[i];
        }
    }
    
    // Calculate possible moves
    const directions = [
        { dx: 1, dy: 0, name: 'right' },   // Right
        { dx: -1, dy: 0, name: 'left' },   // Left
        { dx: 0, dy: 1, name: 'down' },    // Down
        { dx: 0, dy: -1, name: 'up' }      // Up
    ];
    
    // Score each direction
    let bestMove = null;
    let bestScore = -Infinity;
    
    for (const dir of directions) {
        const newX = gameState.player.x + dir.dx;
        const newY = gameState.player.y + dir.dy;
        
        // Check if move is valid
        if (!isValidPosition(newX, newY)) continue;
        
        // Check if move would hit a monster
        const wouldHitMonster = gameState.monsters.some(monster => 
            monster.x === newX && monster.y === newY
        );
        if (wouldHitMonster) continue;
        
        // Calculate score for this move
        let score = 0;
        
        // Distance to nearest apple (negative because we want to minimize distance)
        const distanceToApple = Math.abs(newX - nearestApple.x) + Math.abs(newY - nearestApple.y);
        score -= distanceToApple;
        
        // Distance from monsters (positive because we want to maximize distance)
        const minMonsterDistance = Math.min(...gameState.monsters.map(monster => 
            Math.abs(monster.x - newX) + Math.abs(monster.y - newY)
        ));
        score += minMonsterDistance * 2; // Weight monster avoidance higher
        
        // Prefer moves toward the apple
        const currentDistanceToApple = Math.abs(gameState.player.x - nearestApple.x) + Math.abs(gameState.player.y - nearestApple.y);
        if (distanceToApple < currentDistanceToApple) {
            score += 10; // Bonus for getting closer to apple
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = dir;
        }
    }
    
    return bestMove;
}