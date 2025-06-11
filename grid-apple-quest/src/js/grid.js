// Grid management functionality
// This file is part of the modular structure but main logic is in game.js

console.log("Grid module loaded - functionality integrated into game.js");

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = new Array(width * height).fill(null);
    }

    createGrid() {
        const gridElement = document.getElementById('grid');
        console.log('gridElement:', gridElement); // Debug: Check if gridElement is found
        gridElement.innerHTML = ''; // Clear existing grid
        gridElement.style.gridTemplateColumns = `repeat(${this.width}, 50px)`; // Set grid template columns
        gridElement.style.gridTemplateRows = `repeat(${this.height}, 50px)`; // Set grid template rows

        for (let i = 0; i < this.width * this.height; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            gridElement.appendChild(cell);
            //console.log('Cell created:', i); // Debug: Check if cells are created
        }
        console.log('Grid created with width:', this.width, 'and height:', this.height); // Debug: Confirm grid creation
    }

    getCell(x, y) {
        return this.cells[y * this.width + x];
    }

    setCell(x, y, value) {
        this.cells[y * this.width + x] = value;
        const cell = document.querySelector(`[data-index="${y * this.width + x}"]`);
        cell.className = 'cell ' + (value || '');
        
        // Add emoji representations using Unicode escape sequences
        switch(value) {
            case 'player':
                cell.textContent = '\uD83D\uDE0A'; // Smiling face
                break;
            case 'monster':
                cell.textContent = '\uD83D\uDC7B'; // Ghost
                break;
            case 'apple':
                cell.textContent = '\uD83C\uDF4E'; // Red apple
                break;
            default:
                cell.textContent = '';
        }
    }

    clearCell(x, y) {
        this.setCell(x, y, null);
    }

    getRandomEmptyPosition() {
        let emptyCells = this.cells
            .map((cell, index) => ({ cell, index }))
            .filter(item => !item.cell);
        if (emptyCells.length === 0) return null;
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        return {
            x: randomCell.index % this.width,
            y: Math.floor(randomCell.index / this.width)
        };
    }
}

let grid = null;

function createGrid(width, height) {
    console.log('Creating grid with width:', width, 'and height:', height); // Debug: Confirm createGrid call
    grid = new Grid(width, height);
    grid.createGrid();
}

// Make Grid and grid global
window.Grid = Grid;
window.grid = grid;
window.createGrid = createGrid;