# Contents of /grid-apple-quest/README.md

# Grid Apple Quest Game

## Overview
Grid Apple Quest is a web-based game where the player controls a hero navigating through an 8x8 grid. The objective is to avoid monsters while trying to reach the apple to win the game.

## Project Structure
The project is organized into the following directories and files:

```
grid-apple-quest
├── src
│   ├── css
│   │   └── style.css       # Styles for the game, including layout and animations
│   ├── js
│   │   ├── game.js         # Main game logic
│   │   ├── player.js       # Player class and movement logic
│   │   ├── monster.js      # Monster class and behavior
│   │   └── grid.js         # Grid management
│   └── index.html          # Main HTML file for the game interface
├── tests
│   ├── game.test.js        # Unit tests for game logic
│   ├── player.test.js      # Unit tests for player functionality
│   └── monster.test.js     # Unit tests for monster functionality
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```

## Gameplay Instructions
1. **Movement**: Use the arrow keys to move the hero around the grid.
2. **Objective**: Reach the apple while avoiding the monsters. If the hero collides with a monster, the game ends.
3. **Winning**: The game is won when the hero reaches the apple's tile.

## Setup Instructions
1. Clone the repository or download the project files.
2. Open the project in a web browser.
3. Ensure all assets are correctly placed in their respective directories.
4. Open `index.html` to start the game.

## License
This project is open-source and available for modification and distribution. Enjoy the game!