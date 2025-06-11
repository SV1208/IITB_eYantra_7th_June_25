export interface PuzzleState {
    grid: GridCell[][];
    isSolved: boolean;
}

export interface GridCell {
    value: number;
    isEmpty: boolean;
}