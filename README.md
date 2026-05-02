# The Locked Study - Escape Room Game

A browser-based escape room puzzle game built with vanilla JavaScript, HTML, and CSS.

## Features

- **Interactive Room Scene** - Click on objects to explore and interact
- **Multiple Puzzle Types:**
  - Numpad combination lock (Safe puzzle)
  - Drag-and-drop sequence puzzle (Bookshelf)
  - Symbol matching puzzle (Toolbox)
- **Inventory System** - Collect items and use them to solve puzzles
- **Clue Collection** - Gather hints as you progress
- **Countdown Timer** - Race against time to escape
- **Win/Lose Conditions** - Dynamic game states

## Gameplay

1. **Explore** the locked study by clicking on objects
2. **Collect Items** that can be used to solve puzzles
3. **Solve Puzzles** to unlock items and progress
4. **Use Items** on objects that require them (e.g., hammer to break vase)
5. **Escape** by opening the front door with the brass key

## How to Play

1. Open `index.html` in your browser
2. The game starts with 10 minutes on the timer
3. Click on room objects to interact with them
4. Look for clues and gather items from your inventory sidebar
5. Solve all puzzles and unlock the door to escape!

## Project Structure

```
├── index.html           # Main HTML file
├── room.css            # Styling for room and objects
├── gameData.json       # Game configuration and puzzle data
├── gameState.js        # Core game state management
├── room.js             # Room interactions and puzzle manager
├── inventory.js        # Inventory UI and management
├── timer.js            # Countdown timer logic
├── numpad.js           # Numpad puzzle implementation
├── sequence.js         # Book sequence puzzle implementation
├── symbol.js           # Symbol matching puzzle implementation
└── README.md           # This file
```

## Game Data Structure

The game is configured through `gameData.json`:
- **Meta**: Game title, timer duration, win condition
- **Rooms**: Room definitions
- **Objects**: Interactive room objects with states and interactions
- **Items**: Inventory items with descriptions
- **Puzzles**: Puzzle definitions and solutions
- **Clues**: Hint text for discovery

## Technologies

- **HTML5** - Structure and DOM
- **CSS3** - Styling, animations, and transformations
- **Vanilla JavaScript** - Game logic and interactions
- **JSON** - Game data configuration

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge)

## Game Loop

1. Player clicks room object → Triggers interaction handler
2. System checks if item is required
3. Item requirement met → Execute success action (setState, giveItem, message)
4. Item requirement not met → Show failure message
5. Update inventory and object states in DOM
6. Check win condition (door open) → Trigger win state

## Tips for Playing

- Look for clues on objects - they hint at puzzle solutions
- The window holds important numerical information
- Paintings can provide visual clues
- Use items strategically - some are consumed after use
- Check your clues panel for discovered hints
