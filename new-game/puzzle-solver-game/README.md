# Puzzle Solver Game

## Overview
The Puzzle Solver Game is a fun and interactive puzzle game where players can solve scrambled puzzles by aligning the pieces correctly. The game features a grid layout where players can click on cells to rearrange the puzzle pieces and attempt to solve the puzzle.

## Features
- Scrambled puzzle pieces displayed in a grid format.
- Clickable cells to rearrange pieces.
- Visual feedback on puzzle state.
- Ability to reset the game and start over.
- Logic to determine if the puzzle can be solved.

## Project Structure
```
puzzle-solver-game
├── src
│   ├── app.ts          # Entry point of the application
│   ├── game
│   │   ├── puzzle.ts   # Puzzle state management
│   │   ├── grid.ts     # Grid layout management
│   │   └── solver.ts   # Puzzle solving logic
│   ├── ui
│   │   ├── gameBoard.ts # Game board rendering
│   │   └── controls.ts  # User interaction management
│   └── types
│       └── index.ts    # Type definitions
├── package.json         # npm configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/puzzle-solver-game.git
   ```
2. Navigate to the project directory:
   ```
   cd puzzle-solver-game
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the game, run the following command:
```
npm start
```
This will launch the game in your default web browser.

## Gameplay
- The puzzle starts in a scrambled state.
- Click on the cells to rearrange the pieces.
- The goal is to align all pieces in the correct order.
- Use the reset option to start a new game at any time.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.