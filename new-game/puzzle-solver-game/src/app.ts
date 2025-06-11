import { Puzzle } from './game/puzzle';
import { GameBoard } from './ui/gameBoard';
import { Controls } from './ui/controls';

class App {
    private puzzle: Puzzle;
    private gameBoard: GameBoard;
    private controls: Controls;

    constructor() {
        this.puzzle = new Puzzle();
        this.gameBoard = new GameBoard(this.puzzle);
        this.controls = new Controls(this.puzzle, this.gameBoard);
    }

    public start() {
        this.puzzle.shuffle();
        this.gameBoard.draw();
        this.controls.setupEventListeners();
        this.gameLoop();
    }

    private gameLoop() {
        // Main game loop logic can be implemented here
        requestAnimationFrame(() => this.gameLoop());
    }
}

const app = new App();
app.start();