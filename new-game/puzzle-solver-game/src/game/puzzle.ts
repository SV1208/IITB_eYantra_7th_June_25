class Puzzle {
    private grid: number[][];
    private size: number;

    constructor(size: number) {
        this.size = size;
        this.grid = this.createSolvedGrid();
    }

    private createSolvedGrid(): number[][] {
        const grid = [];
        let number = 1;
        for (let i = 0; i < this.size; i++) {
            const row = [];
            for (let j = 0; j < this.size; j++) {
                row.push(number++);
            }
            grid.push(row);
        }
        grid[this.size - 1][this.size - 1] = 0; // Empty space
        return grid;
    }

    shuffle(): void {
        for (let i = 0; i < 100; i++) {
            const emptyCell = this.findEmptyCell();
            const possibleMoves = this.getPossibleMoves(emptyCell);
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            this.swap(emptyCell, randomMove);
        }
    }

    private findEmptyCell(): { row: number; col: number } {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    return { row: i, col: j };
                }
            }
        }
        throw new Error("No empty cell found");
    }

    private getPossibleMoves(emptyCell: { row: number; col: number }): { row: number; col: number }[] {
        const moves = [];
        const directions = [
            { row: -1, col: 0 }, // Up
            { row: 1, col: 0 },  // Down
            { row: 0, col: -1 }, // Left
            { row: 0, col: 1 }   // Right
        ];

        for (const direction of directions) {
            const newRow = emptyCell.row + direction.row;
            const newCol = emptyCell.col + direction.col;
            if (this.isInBounds(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
            }
        }
        return moves;
    }

    private isInBounds(row: number, col: number): boolean {
        return row >= 0 && row < this.size && col >= 0 && col < this.size;
    }

    private swap(cell1: { row: number; col: number }, cell2: { row: number; col: number }): void {
        const temp = this.grid[cell1.row][cell1.col];
        this.grid[cell1.row][cell1.col] = this.grid[cell2.row][cell2.col];
        this.grid[cell2.row][cell2.col] = temp;
    }

    isSolved(): boolean {
        let number = 1;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (i === this.size - 1 && j === this.size - 1) {
                    return this.grid[i][j] === 0; // Last cell should be empty
                }
                if (this.grid[i][j] !== number++) {
                    return false;
                }
            }
        }
        return true;
    }

    getGrid(): number[][] {
        return this.grid;
    }
}