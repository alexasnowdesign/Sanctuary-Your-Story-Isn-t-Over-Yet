<!-- Workspace-specific custom instructions for point-and-click visual novel game project -->

## Project Overview
Building a point-and-click game with:
- Map-based navigation between rooms
- Clickable interactive elements
- Visual novel dialogue system with dialogue boxes
- Asset support for game graphics
- Background music and sound effects system

## Project Type
Vite + Vanilla JavaScript

## Setup Progress

- [x] Verify copilot-instructions.md setup
- [x] Create project structure
- [x] Create game engine (Game class)
- [x] Create room and object systems
- [x] Create dialogue system with branching
- [x] Set up inventory and game state
- [x] Create development tasks and server launcher
- [x] Create audio system with music management
- [x] Verify no compilation errors

## Quick Start

1. Run `start-server.bat` to launch the development server
2. Open `http://localhost:8000` in your browser
3. The game will load with two sample rooms

## Game Architecture

### Core Systems
- **Game Engine** (`js/game.js`) - Main game controller and loop
- **Room System** (`js/room.js`) - Rooms, clickable objects, and characters
- **Dialogue System** (`js/dialogue.js`) - Branching dialogue and choices
- **Audio System** (`js/audio.js`) - Background music, sound effects, volume control

### Key Classes
- `Game` - Main game controller
- `Room` - Individual room/location
- `ClickableObject` - Interactive elements in rooms
- `Character` - NPC characters
- `DialogueManager` - Manages dialogue display
- `Dialogue` - Dialogue tree nodes
- `AudioManager` - Manages background music and sound effects

## Adding Your Assets

Replace placeholder images and audio in:
- `assets/rooms/` - Room background images
- `assets/characters/` - Character sprites
- `assets/ui/` - UI elements
- `assets/audio/` - Background music and sound effects

Update `js/game.js` to register audio files and set room background music with your actual files.

