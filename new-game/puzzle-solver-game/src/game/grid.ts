export class Grid {
    private cells: number[][];
    private size: number;

    constructor(size: number) {
        this.size = size;
        this.cells = this.createEmptyGrid();
    }

    private createEmptyGrid(): number[][] {
        return Array.from({ length: this.size }, () => Array(this.size).fill(0));
    }

    public render(): void {
        // Logic to render the grid on the UI
    }

    public updateCell(row: number, col: number, value: number): void {
        if (this.isValidCell(row, col)) {
            this.cells[row][col] = value;
        }
    }

    private isValidCell(row: number, col: number): boolean {
        return row >= 0 && row < this.size && col >= 0 && col < this.size;
    }

    public getCells(): number[][] {
        return this.cells;
    }
}