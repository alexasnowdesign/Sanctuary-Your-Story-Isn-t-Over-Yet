# Point & Click Visual Novel Game

A browser-based point-and-click game engine with visual novel dialogue system.

## Features

- **Map-based Navigation**: Click between different rooms/locations
- **Interactive Elements**: Clickable objects in each room with callbacks
- **Dialogue System**: Visual novel-style dialogue boxes with branching choices
- **Inventory System**: Pick up and track items throughout the game
- **Character Support**: Display NPCs in rooms
- **Asset Management**: Support for custom background and character images
- **Audio System**: Background music per room, sound effects, volume control, and fade transitions

## Project Structure

```
.
├── index.html              # Main game file
├── style.css               # Styling
├── package.json            # Project metadata
├── js/
│   ├── game.js            # Main game engine and controller
│   ├── room.js            # Room system and clickable objects
│   ├── dialogue.js        # Dialogue and conversation system
│   └── audio.js           # Audio and music management
└── assets/
    ├── rooms/             # Room background images
    ├── characters/        # Character sprite images
    ├── ui/               # UI element images
    └── audio/            # Background music and sound effects
```

## Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (Python included)

### Running the Game

#### Option 1: Using Python (Built-in)
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

#### Option 2: Simple File Server
```bash
# On Windows PowerShell
python -m http.server 8000

# Or use any other local server (Node.js, etc.)
```

## How to Use

### Adding Rooms

```javascript
const room = game.createRoom('room_id', 'Room Name', 'assets/rooms/background.png');
```

### Adding Clickable Objects

```javascript
const door = new ClickableObject('door', 'Door', x, y, width, height);
door.onClick(() => {
    console.log('Door clicked!');
    game.loadRoom('next_room_id');
});
room.addClickableObject(door);
```

### Creating Dialogues

```javascript
const dialogue = createSimpleDialogue('dialogue_id', 'Hello!', ['Say hi', 'Leave']);
game.showDialogue(dialogue);
```

### Managing Inventory

```javascript
game.addToInventory('Key');
game.removeFromInventory('Key');
```

### Audio System

#### Register Audio Files

```javascript
// Register single audio file
game.registerAudio('bgm_room1', 'assets/audio/room1_music.mp3');

// Register multiple audio files at once
game.registerAudios({
    'bgm_menu': 'assets/audio/menu_theme.mp3',
    'bgm_room1': 'assets/audio/room1_theme.mp3',
    'sfx_click': 'assets/audio/click.wav',
    'sfx_door': 'assets/audio/door_open.wav'
});
```

#### Set Room Background Music

```javascript
const room = game.createRoom('room1', 'Living Room', 'assets/rooms/room1.png');
room.setBackgroundMusic('bgm_room1', { fadeIn: 1000, loop: true });
```

#### Play Music and Sound Effects

```javascript
// Play background music
game.playBGM('bgm_room1', { fadeIn: 1000, loop: true });

// Stop background music with fade out
game.stopBGM(fadeOut = 500);

// Pause/Resume music
game.pauseBGM();
game.resumeBGM();

// Play sound effects
game.playSFX('sfx_click');
game.playSFX('sfx_door', { volume: 0.8 });
```

#### Volume Control

```javascript
// Set volume for different audio types (0-1)
game.setBGMVolume(0.7);    // Background music volume
game.setSFXVolume(0.8);    // Sound effects volume
game.setMasterVolume(0.9); // Master volume for all audio

// Mute/Unmute all audio
game.muteAudio();
game.unmuteAudio();
```

### Game Variables

```javascript
game.setVariable('player_name', 'John');
let name = game.getVariable('player_name');
```

## Asset Setup

Replace placeholder images and audio in the following directories:
- `assets/rooms/` - Background images for each room (PNG recommended)
- `assets/characters/` - Character sprite images (PNG recommended)
- `assets/ui/` - UI element images (PNG recommended)
- `assets/audio/` - Background music and sound effects (MP3 or WAV recommended)

**Audio Format Notes:**
- **MP3**: Best compatibility, smaller file size, use for background music
- **WAV**: Better quality for short sound effects, larger file size
- **OGG**: Good compression, excellent quality, use for long tracks
- Test audio playback across different browsers for maximum compatibility

## Customization

### Changing Canvas Size
Edit in `game.js`:
```javascript
this.canvas.width = 1024;  // Change width
this.canvas.height = 768;  // Change height
```

### Styling
Modify `style.css` to customize:
- Dialogue box appearance
- UI colors and fonts
- Canvas container styling

## API Reference

### Game Class
- `createRoom(id, name, backgroundPath)` - Create a new room
- `loadRoom(roomId)` - Load and switch to a room
- `start(initialRoomId)` - Start the game
- `showDialogue(dialogue)` - Display a dialogue
- `addToInventory(item)` - Add item to inventory
- `removeFromInventory(item)` - Remove item from inventory
- `setVariable(key, value)` - Set a game variable
- `getVariable(key, defaultValue)` - Get a game variable
- `markActionCompleted(actionId)` - Mark an action as done
- `isActionCompleted(actionId)` - Check if action was done
- `registerAudio(id, filePath)` - Register a single audio file
- `registerAudios(audioMap)` - Register multiple audio files
- `playBGM(audioId, options)` - Play background music with fade in/loop options
- `stopBGM(fadeOut)` - Stop background music with optional fade out
- `pauseBGM()` - Pause background music
- `resumeBGM()` - Resume background music
- `playSFX(audioId, options)` - Play a sound effect
- `setBGMVolume(volume)` - Set background music volume (0-1)
- `setSFXVolume(volume)` - Set sound effects volume (0-1)
- `setMasterVolume(volume)` - Set master volume for all audio (0-1)
- `muteAudio()` / `unmuteAudio()` - Mute/unmute all audio

### Room Class
- `addClickableObject(obj)` - Add interactive object
- `addCharacter(character)` - Add NPC character
- `getObjectAtPoint(x, y)` - Get object at coordinates

### Dialogue Classes
- `DialogueManager` - Manages dialogue display
- `Dialogue` - Represents a dialogue node
- `DialogueChoice` - Represents a choice option

## Tips

- Use descriptive object IDs for tracking interactions
- Load images before starting the game for smooth gameplay
- Use `isActionCompleted()` to prevent repeated interactions
- Organize assets by room for easier management
- Register all audio files at game start for consistent playback
- Use `fadeIn` and `fadeOut` options for smooth audio transitions
- Set room background music when creating rooms for automatic playback
- Consider file size when choosing audio formats (MP3 for music, WAV for SFX)
- Test audio on mobile devices for browser compatibility
- Preload frequently used audio files for mobile performance

## License

MIT License - Feel free to use and modify this engine for your projects.
