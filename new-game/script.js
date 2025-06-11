class PuzzleGame {
    constructor() {
        this.gridSize = 4;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.emptyIndex = this.gridSize * this.gridSize - 1;
        this.currentState = [];
        this.solvedState = [];
        this.defaultImage = this.createDefaultImage();
        
        this.initializeGame();
        this.setupEventListeners();
    }

    createDefaultImage() {
        // Create a canvas with a default colorful pattern
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 400;
        
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 400, 400);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.25, '#4ecdc4');
        gradient.addColorStop(0.5, '#45b7d1');
        gradient.addColorStop(0.75, '#96ceb4');
        gradient.addColorStop(1, '#feca57');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);
        
        // Add some decorative elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * 400,
                Math.random() * 400,
                Math.random() * 30 + 10,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // Add numbers for easier solving
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        
        const pieceSize = 400 / this.gridSize;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const number = row * this.gridSize + col + 1;
                if (number < this.gridSize * this.gridSize) {
                    ctx.fillText(
                        number.toString(),
                        col * pieceSize + pieceSize / 2,
                        row * pieceSize + pieceSize / 2 + 8
                    );
                }
            }
        }
        
        return canvas.toDataURL();
    }

    initializeGame() {
        this.moves = 0;
        this.updateMovesDisplay();
        this.startTime = Date.now();
        this.startTimer();
        
        // Initialize solved state
        this.solvedState = Array.from({length: this.gridSize * this.gridSize}, (_, i) => i);
        
        // Initialize current state and shuffle
        this.currentState = [...this.solvedState];
        this.shufflePuzzle();
        
        this.renderGameBoard();
        this.renderReferenceImage();
    }

    shufflePuzzle() {
        // Shuffle by making random valid moves to ensure solvability
        for (let i = 0; i < 500; i++) {
            const possibleMoves = this.getPossibleMoves();
            if (possibleMoves.length > 0) {
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                this.swapPieces(this.emptyIndex, randomMove);
            }
        }
    }

    getPossibleMoves() {
        const moves = [];
        const row = Math.floor(this.emptyIndex / this.gridSize);
        const col = this.emptyIndex % this.gridSize;
        
        // Up
        if (row > 0) moves.push(this.emptyIndex - this.gridSize);
        // Down
        if (row < this.gridSize - 1) moves.push(this.emptyIndex + this.gridSize);
        // Left
        if (col > 0) moves.push(this.emptyIndex - 1);
        // Right
        if (col < this.gridSize - 1) moves.push(this.emptyIndex + 1);
        
        return moves;
    }

    swapPieces(index1, index2) {
        [this.currentState[index1], this.currentState[index2]] = 
        [this.currentState[index2], this.currentState[index1]];
        
        if (index1 === this.emptyIndex) {
            this.emptyIndex = index2;
        } else if (index2 === this.emptyIndex) {
            this.emptyIndex = index1;
        }
    }

    renderGameBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        gameBoard.innerHTML = '';
        
        this.currentState.forEach((pieceValue, index) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.index = index;
            
            if (pieceValue === this.gridSize * this.gridSize - 1) {
                piece.classList.add('empty');
                piece.textContent = '';
            } else {
                const row = Math.floor(pieceValue / this.gridSize);
                const col = pieceValue % this.gridSize;
                const pieceSize = 400 / this.gridSize;
                
                piece.style.backgroundImage = `url(${this.defaultImage})`;
                piece.style.backgroundPosition = 
                    `-${col * pieceSize}px -${row * pieceSize}px`;
                piece.style.backgroundSize = '400px 400px';
                
                // Add visual feedback for clickable pieces
                const possibleMoves = this.getPossibleMoves();
                if (possibleMoves.includes(index)) {
                    piece.classList.add('movable');
                }
            }
            
            piece.addEventListener('click', () => this.handlePieceClick(index));
            gameBoard.appendChild(piece);
        });
    }

    renderReferenceImage() {
        const referenceGrid = document.getElementById('reference-grid');
        referenceGrid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        referenceGrid.innerHTML = '';
        
        for (let i = 0; i < this.gridSize * this.gridSize - 1; i++) {
            const piece = document.createElement('div');
            piece.className = 'reference-piece';
            
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            const pieceSize = 400 / this.gridSize;
            
            piece.style.backgroundImage = `url(${this.defaultImage})`;
            piece.style.backgroundPosition = 
                `-${col * pieceSize}px -${row * pieceSize}px`;
            piece.style.backgroundSize = '400px 400px';
            
            referenceGrid.appendChild(piece);
        }
        
        // Add empty space for last piece
        const emptyPiece = document.createElement('div');
        emptyPiece.className = 'reference-piece';
        emptyPiece.style.background = '#f0f0f0';
        referenceGrid.appendChild(emptyPiece);
    }

    handlePieceClick(clickedIndex) {
        const possibleMoves = this.getPossibleMoves();
        
        if (possibleMoves.includes(clickedIndex)) {
            // Add a smooth animation effect
            const clickedPiece = document.querySelector(`[data-index="${clickedIndex}"]`);
            clickedPiece.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                this.swapPieces(this.emptyIndex, clickedIndex);
                this.moves++;
                this.updateMovesDisplay();
                this.renderGameBoard();
                
                if (this.checkWin()) {
                    setTimeout(() => this.showWinModal(), 300);
                }
            }, 150);
        } else {
            // Visual feedback for invalid moves
            const clickedPiece = document.querySelector(`[data-index="${clickedIndex}"]`);
            if (clickedPiece && !clickedPiece.classList.contains('empty')) {
                clickedPiece.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    clickedPiece.style.animation = '';
                }, 500);
            }
        }
    }

    checkWin() {
        return this.currentState.every((value, index) => value === this.solvedState[index]);
    }

    showWinModal() {
        clearInterval(this.timerInterval);
        const modal = document.getElementById('win-modal');
        const finalStats = document.getElementById('final-stats');
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        
        finalStats.textContent = `Moves: ${this.moves} | Time: ${this.formatTime(elapsed)}`;
        modal.classList.remove('hidden');
    }

    updateMovesDisplay() {
        document.getElementById('moves-counter').textContent = `Moves: ${this.moves}`;
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('timer').textContent = `Time: ${this.formatTime(elapsed)}`;
        }, 1000);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    showHint() {
        // Highlight pieces that are in wrong position
        const pieces = document.querySelectorAll('.puzzle-piece');
        pieces.forEach((piece, index) => {
            piece.classList.remove('highlighted', 'correct');
            if (this.currentState[index] === this.solvedState[index] && 
                this.currentState[index] !== this.gridSize * this.gridSize - 1) {
                piece.classList.add('correct');
            } else if (this.currentState[index] !== this.solvedState[index] && 
                       this.currentState[index] !== this.gridSize * this.gridSize - 1) {
                piece.classList.add('highlighted');
            }
        });
        
        setTimeout(() => {
            pieces.forEach(piece => piece.classList.remove('highlighted', 'correct'));
        }, 3000);
    }

    changeDifficulty(newSize) {
        this.gridSize = newSize;
        this.emptyIndex = this.gridSize * this.gridSize - 1;
        this.defaultImage = this.createDefaultImage();
        this.initializeGame();
    }

    setupEventListeners() {
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.initializeGame();
        });
        
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showHint();
        });
        
        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            this.changeDifficulty(parseInt(e.target.value));
        });
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            document.getElementById('win-modal').classList.add('hidden');
            this.initializeGame();
        });
        
        // Close modal when clicking outside
        document.getElementById('win-modal').addEventListener('click', (e) => {
            if (e.target.id === 'win-modal') {
                document.getElementById('win-modal').classList.add('hidden');
            }
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
});