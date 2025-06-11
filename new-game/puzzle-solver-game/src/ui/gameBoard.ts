class GameBoard {
    constructor(private puzzle: Puzzle, private grid: Grid) {}

    draw(): void {
        this.grid.render();
        // Additional rendering logic can be added here
    }

    update(): void {
        // Logic to refresh the display based on the puzzle state
        this.draw();
    }
}

export default GameBoard;