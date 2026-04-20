/**
 * Point & Click Game Engine
 * Main game controller and loop
 */

class Game {
    constructor(canvasId = 'game-canvas') {
                this.boopEncourageBox = document.getElementById('boop-encourage-box');
                this.boopPhrases = [
                    'You are loved!',
                    'You matter.',
                    'You can do this!',
                    'Take a deep breath.',
                    'You are enough.',
                    'You are not alone.',
                    'You are strong.',
                    'You are doing great!',
                    'You are worthy.',
                    'You\'re doing amazing!',
                    'You got this!',
                    'I am here with you.',
                    'Believe in yourself.',
                    'Keep breathing.',
                    'You are resilient.',
                    'You are brave.',
                    'You are making progress.',
                    'Keep going!'
                ];
                this.boopEncourageTimeout = null;
        // Setup canvas
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1024;
        this.canvas.height = 768;

        // Game state
        this.rooms = {};
        this.currentRoom = null;
        this.gameState = {
            completedActions: new Set(),
            variables: {},
            userSubmissions: [],
            publishedStories: []
        };
        this.userSubmissionsStorageKey = 'sanctuary_user_submissions_v1';
        this.publishedStoriesStorageKey = 'sanctuary_published_stories_v1';

        // Systems
        this.dialogueManager = new DialogueManager();
        this.audioManager = new AudioManager();
        this.minigameManager = new MinigameManager(this);
        this.dialogueManager.onButtonClick = () => this.playSFX('sfx_click');
        
        // UI
        this.roomTitleElement = document.getElementById('room-title');
        this.gameCabinetPopup = document.getElementById('game-cabinet-popup');
        this.gameCabinetList = document.getElementById('game-cabinet-list');
        this.gameCabinetImage = document.getElementById('game-cabinet-image');
        this.gameCabinetDescription = document.getElementById('game-cabinet-description');
        this.gameCabinetPlayBtn = document.getElementById('game-cabinet-play');
        this.gameCabinetCloseBtn = document.getElementById('game-cabinet-close');
        this.workshopPromptPopup = document.getElementById('workshop-prompt-popup');
        this.workshopPromptText = document.getElementById('workshop-prompt-text');
        this.workshopPromptAnswer = document.getElementById('workshop-prompt-answer');
        this.workshopPromptNextBtn = document.getElementById('workshop-prompt-next');
        this.workshopPromptCloseBtn = document.getElementById('workshop-prompt-close');
        this.workshopPromptOptions = [];
        this.toolboxPopup = document.getElementById('toolbox-popup');
        this.toolboxSolutionsPopup = document.getElementById('toolbox-solutions-popup');
        this.toolboxList = document.getElementById('toolbox-list');
        this.toolboxTitle = document.getElementById('toolbox-title');
        this.toolboxDescription = document.getElementById('toolbox-description');
        this.toolboxAlternatives = document.getElementById('toolbox-alternatives');
        this.toolboxCloseBtn = document.getElementById('toolbox-close');
        this.toolboxSolutionsCloseBtn = document.getElementById('toolbox-solutions-close');
        this.toolboxBackBtn = document.getElementById('toolbox-back');
        this.bedsidePopup = document.getElementById('bedside-popup');
        this.bedsideCloseBtn = document.getElementById('bedside-close');
        this.bedsidePrintBtn = document.getElementById('bedside-print');
        this.groundingPopup = document.getElementById('grounding-popup');
        this.groundingList = document.getElementById('grounding-list');
        this.groundingCloseBtn = document.getElementById('grounding-close');
        this.groundingInstructionsPopup = document.getElementById('grounding-instructions-popup');
        this.groundingInstructionText = document.getElementById('grounding-instruction-text');
        this.groundingInstructionsCounter = document.getElementById('grounding-instructions-counter');
        this.groundingInstructionsBackBtn = document.getElementById('grounding-instructions-back');
        this.groundingInstructionsCloseBtn = document.getElementById('grounding-instructions-close');
        this.groundingInstructionsPrevBtn = document.getElementById('grounding-instructions-prev');
        this.groundingInstructionsNextBtn = document.getElementById('grounding-instructions-next');
        this.bookshelfBooks = document.getElementById('bookshelf-books');
        this.bookshelfOverlay = document.getElementById('bookshelf-overlay');
        this.bookStoryPopup = document.getElementById('book-story-popup');
        this.bookStoryLeftPage = document.getElementById('book-story-left-page');
        this.bookStoryRightPage = document.getElementById('book-story-right-page');
        this.bookStoryBackBtn = document.getElementById('book-story-back');
        this.bookStoryCloseBtn = document.getElementById('book-story-close');
        this.bookStoryPrevBtn = document.getElementById('book-story-prev');
        this.bookStoryNextBtn = document.getElementById('book-story-next');
        this.bookStoryDeleteBtn = document.getElementById('book-story-delete');
        this.bookStoryPublishBtn = document.getElementById('book-story-publish');
        this.bookStoryCounter = document.getElementById('book-story-counter');
        this.writeStoryPopup = document.getElementById('write-story-popup');
        this.writeStoryInput = document.getElementById('write-story-input');
        this.writeStoryCloseBtn = document.getElementById('write-story-close');
        this.writeStorySubmitBtn = document.getElementById('write-story-submit');
        this.writeStoryCancelBtn = document.getElementById('write-story-cancel');
        this.boopBtn = document.getElementById('boop-btn');
        this.bgmToggleBtn = document.getElementById('bgm-toggle-btn');
            // Input
            this.mouseX = 0;
            this.mouseY = 0;
            this.isRunning = false;

            // Bind events
            this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));

            this.loadUserSubmissionsFromStorage();
            this.loadPublishedStoriesFromStorage();

            console.log('Game initialized');
        this.selectedCabinetGame = null;
        this.selectedToolboxCategory = null;
        this.toolboxCategories = [];
        this.currentStoryCategory = null;
        this.currentStoryIndex = 0;
        this.currentBookshelfStories = [];
        this.groundingTechniques = [];
        this.currentTechnique = null;
        this.currentInstructionIndex = 0;
        this.resourcesPopup = document.getElementById('resources-popup');
        this.resourcesList = document.getElementById('resources-list');
        this.resourcesCloseBtn = document.getElementById('resources-close');
        this.isBGMMuted = false;
        this.lastBGMVolume = 0.7;

        if (this.gameCabinetCloseBtn) {
            this.gameCabinetCloseBtn.addEventListener('click', () => this.hideGameCabinetPopup());
        }

        if (this.gameCabinetPopup) {
            this.gameCabinetPopup.addEventListener('click', (e) => {
                if (e.target === this.gameCabinetPopup) {
                    this.hideGameCabinetPopup();
                }
            });
        }

        if (this.workshopPromptCloseBtn) {
            this.workshopPromptCloseBtn.addEventListener('click', () => this.hideWorkshopPromptPopup());
        }

        if (this.workshopPromptNextBtn) {
            this.workshopPromptNextBtn.addEventListener('click', () => this.pickWorkshopPrompt());
        }

        if (this.workshopPromptPopup) {
            this.workshopPromptPopup.addEventListener('click', (e) => {
                if (e.target === this.workshopPromptPopup) {
                    this.hideWorkshopPromptPopup();
                }
            });
        }

        if (this.toolboxCloseBtn) {
            this.toolboxCloseBtn.addEventListener('click', () => this.hideToolboxPopup());
        }

        if (this.toolboxPopup) {
            this.toolboxPopup.addEventListener('click', (e) => {
                if (e.target === this.toolboxPopup) {
                    this.hideToolboxPopup();
                }
            });
        }

        if (this.toolboxSolutionsCloseBtn) {
            this.toolboxSolutionsCloseBtn.addEventListener('click', () => this.hideToolboxPopup());
        }

        if (this.toolboxBackBtn) {
            this.toolboxBackBtn.addEventListener('click', () => {
                this.hideToolboxSolutionsPopup();
                this.showToolboxCategoriesPopup();
            });
        }

        if (this.toolboxSolutionsPopup) {
            this.toolboxSolutionsPopup.addEventListener('click', (e) => {
                if (e.target === this.toolboxSolutionsPopup) {
                    this.hideToolboxPopup();
                }
            });
        }

        if (this.bedsideCloseBtn) {
            this.bedsideCloseBtn.addEventListener('click', () => this.hideBedsidePopup());
        }

        if (this.groundingCloseBtn) {
            this.groundingCloseBtn.addEventListener('click', () => this.hideGroundingPopup());
        }

        if (this.groundingPopup) {
            this.groundingPopup.addEventListener('click', (e) => {
                if (e.target === this.groundingPopup) {
                    this.hideGroundingPopup();
                }
            });
        }

        if (this.groundingInstructionsBackBtn) {
            this.groundingInstructionsBackBtn.addEventListener('click', () => this.showGroundingPopup(this.groundingTechniques));
        }

        if (this.groundingInstructionsCloseBtn) {
            this.groundingInstructionsCloseBtn.addEventListener('click', () => this.hideGroundingInstructionsPopup());
        }

        if (this.groundingInstructionsPopup) {
            this.groundingInstructionsPopup.addEventListener('click', (e) => {
                if (e.target === this.groundingInstructionsPopup) {
                    this.hideGroundingInstructionsPopup();
                }
            });
        }

        if (this.groundingInstructionsPrevBtn) {
            this.groundingInstructionsPrevBtn.addEventListener('click', () => this.previousGroundingInstruction());
        }

        if (this.groundingInstructionsNextBtn) {
            this.groundingInstructionsNextBtn.addEventListener('click', () => this.nextGroundingInstruction());
        }

        if (this.resourcesCloseBtn) {
            this.resourcesCloseBtn.addEventListener('click', () => this.hideResourcesPopup());
        }

        if (this.resourcesPopup) {
            this.resourcesPopup.addEventListener('click', (e) => {
                if (e.target === this.resourcesPopup) {
                    this.hideResourcesPopup();
                }
            });
        }

        if (this.bookStoryCloseBtn) {
            this.bookStoryCloseBtn.addEventListener('click', () => this.hideBookStoryPopup());
        }

        if (this.bookStoryBackBtn) {
            this.bookStoryBackBtn.addEventListener('click', () => this.showBookshelfPopup(this.currentBookshelfStories));
        }

        if (this.bookStoryPopup) {
            this.bookStoryPopup.addEventListener('click', (e) => {
                if (e.target === this.bookStoryPopup) {
                    this.hideBookStoryPopup();
                }
            });
        }

        if (this.bookshelfOverlay) {
            this.bookshelfOverlay.addEventListener('click', () => this.hideBookshelfPopup());
        }

        if (this.writeStoryCloseBtn) {
            this.writeStoryCloseBtn.addEventListener('click', () => this.hideWriteStoryPopup());
        }

        if (this.writeStoryCancelBtn) {
            this.writeStoryCancelBtn.addEventListener('click', () => this.hideWriteStoryPopup());
        }

        if (this.writeStorySubmitBtn) {
            this.writeStorySubmitBtn.addEventListener('click', () => this.submitStory());
        }

        if (this.writeStoryPopup) {
            this.writeStoryPopup.addEventListener('click', (e) => {
                if (e.target === this.writeStoryPopup) {
                    this.hideWriteStoryPopup();
                }
            });
        }

        if (this.bookStoryPrevBtn) {
            this.bookStoryPrevBtn.addEventListener('click', () => this.previousStory());
        }

        if (this.bookStoryNextBtn) {
            this.bookStoryNextBtn.addEventListener('click', () => this.nextStory());
        }

        if (this.bookStoryDeleteBtn) {
            this.bookStoryDeleteBtn.addEventListener('click', () => this.deleteCurrentStory());
        }

        if (this.bookStoryPublishBtn) {
            this.bookStoryPublishBtn.addEventListener('click', () => this.publishCurrentStory());
        }

        if (this.bedsidePopup) {
            this.bedsidePopup.addEventListener('click', (e) => {
                if (e.target === this.bedsidePopup) {
                    this.hideBedsidePopup();
                }
            });
        }

        if (this.bedsidePrintBtn) {
            this.bedsidePrintBtn.addEventListener('click', () => this.printBedsideSheet());
        }

        if (this.bgmToggleBtn) {
            this.bgmToggleBtn.addEventListener('click', () => this.toggleBGMMute());
            this.updateBGMToggleButton();
        }

        if (this.boopBtn) {
            this.boopBtn.addEventListener('click', () => {
                this.playSFX('sfx_boop');
                this.showBoopEncouragement();
            });
        }

        // Hide encouragement box if clicked
        if (this.boopEncourageBox) {
            this.boopEncourageBox.addEventListener('click', () => this.hideBoopEncouragement());
        }
        // ...existing code...
    }

    showBoopEncouragement() {
        if (!this.boopEncourageBox) return;
        // Always clear previous timeout and reset state
        if (this.boopEncourageTimeout) {
            clearTimeout(this.boopEncourageTimeout);
            this.boopEncourageTimeout = null;
        }
        this.boopEncourageBox.classList.remove('visible', 'hidden');
        // Pick a random phrase
        const phrase = this.boopPhrases[Math.floor(Math.random() * this.boopPhrases.length)];
        this.boopEncourageBox.innerHTML = `<div class="boop-encourage-text">${phrase}</div>`;
        // Force reflow to restart animation if needed
        void this.boopEncourageBox.offsetWidth;
        this.boopEncourageBox.classList.remove('hidden');
        this.boopEncourageBox.classList.add('visible');
        // Hide after 5 seconds (match CSS)
        this.boopEncourageTimeout = setTimeout(() => {
            this.hideBoopEncouragement();
        }, 5000);
    }

    hideBoopEncouragement() {
        if (!this.boopEncourageBox) return;
        this.boopEncourageBox.classList.remove('visible');
        this.boopEncourageBox.classList.add('hidden');
        if (this.boopEncourageTimeout) {
            clearTimeout(this.boopEncourageTimeout);
            this.boopEncourageTimeout = null;
        }
    }


    /**
     * Handle global keyboard shortcuts.
     */
    handleGlobalKeydown(event) {
        if (event.key !== 'Escape') {
            return;
        }

        const isVisible = (element) => element && !element.classList.contains('hidden');

        if (this.dialogueManager && this.dialogueManager.isActive()) {
            this.endDialogue();
            event.preventDefault();
            return;
        }

        if (isVisible(this.writeStoryPopup)) {
            this.hideWriteStoryPopup();
            event.preventDefault();
            return;
        }

        if (isVisible(this.bookStoryPopup)) {
            this.hideBookStoryPopup();
            event.preventDefault();
            return;
        }

        if (isVisible(this.bookshelfBooks)) {
            this.hideBookshelfPopup();
            event.preventDefault();
            return;
        }

        if (isVisible(this.groundingInstructionsPopup)) {
            this.hideGroundingInstructionsPopup();
            event.preventDefault();
            return;
        }

        if (isVisible(this.groundingPopup)) {
            this.hideGroundingPopup();
            event.preventDefault();
            return;
        }

        if (isVisible(this.resourcesPopup)) {
            this.hideResourcesPopup();
            event.preventDefault();
            return;
        }

        if (isVisible(this.bedsidePopup)) {
            this.hideBedsidePopup();
            event.preventDefault();
            return;
        }

        if (isVisible(this.toolboxSolutionsPopup) || isVisible(this.toolboxPopup)) {
            this.hideToolboxPopup();
            event.preventDefault();
            return;
        }

        if (isVisible(this.workshopPromptPopup)) {
            this.hideWorkshopPromptPopup();
            event.preventDefault();
            return;
        }

        if (isVisible(this.gameCabinetPopup)) {
            this.hideGameCabinetPopup();
            event.preventDefault();
            return;
        }

        const fountainPopup = document.getElementById('fountain-popup');
        if (isVisible(fountainPopup)) {
            this.hideFountainPopup();
            event.preventDefault();
        }
    }

    /**
     * Create and add a room
     */
    createRoom(id, name, backgroundPath) {
        const room = new Room(id, name, backgroundPath);
        this.rooms[id] = room;
        return room;
    }

    /**
     * Register an audio file with the audio manager
     */
    registerAudio(id, filePath) {
        this.audioManager.registerAudio(id, filePath);
    }

    /**
     * Register multiple audio files
     */
    registerAudios(audioMap) {
        for (let [id, filePath] of Object.entries(audioMap)) {
            this.audioManager.registerAudio(id, filePath);
        }
    }

    /**
     * Load a room (prepare it for display)
     */
    async loadRoom(roomId) {
        const room = this.rooms[roomId];
        if (!room) {
            console.error(`Room ${roomId} not found`);
            return;
        }

        const isRoomTransition = this.currentRoom && this.currentRoom.id !== roomId;

        if (!room.loaded) {
            await room.loadBackground();
            
            // Load images for all objects and characters
            const promises = [];
            for (let obj of room.clickableObjects) {
                if (obj.imagePath && !obj.image) {
                    promises.push(obj.loadImage(obj.imagePath));
                }
            }
            for (let char of room.characters) {
                if (char.imagePath && !char.image) {
                    promises.push(char.loadImage(char.imagePath));
                }
            }
            
            if (promises.length > 0) {
                await Promise.all(promises);
            }
        }

        this.currentRoom = room;
        room.visited = true;

        if (isRoomTransition) {
            this.playSFX('sfx_door');
        }
        
        // Play background music if set
        if (room.backgroundMusicPlaylist && room.backgroundMusicPlaylist.length > 0) {
            this.audioManager.playBGMPlaylist(room.backgroundMusicPlaylist, room.musicOptions);
        } else if (room.backgroundMusicId) {
            this.audioManager.playBGM(room.backgroundMusicId, room.musicOptions);
        }
        
        // Update UI
        this.updateRoomUI();
        
        console.log(`Loaded room: ${room.name}`);
    }

    /**
     * Start the game
     */
    start(initialRoomId) {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.loadRoom(initialRoomId).then(() => {
            this.gameLoop();
        });
    }

    /**
     * Main game loop
     */
    gameLoop = () => {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw current room
        if (this.currentRoom) {
            this.currentRoom.draw(this.ctx, this.canvas.width, this.canvas.height);
            this.updateMouseHoverState();
        }

        // Continue loop
        if (this.isRunning) {
            requestAnimationFrame(this.gameLoop);
        }
    };

    /**
     * Handle canvas click
     */
    handleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Don't process clicks if dialogue is active
        if (this.dialogueManager.isActive()) {
            return;
        }

        // Don't process room clicks while cabinet popup is open
        if (this.isGameCabinetPopupVisible()) {
            return;
        }

        // Don't process room clicks while workshop prompt popup is open
        if (this.isWorkshopPromptPopupVisible()) {
            return;
        }

        // Don't process room clicks while toolbox popup is open
        if (this.isToolboxPopupVisible()) {
            return;
        }

        // Don't process room clicks while bedside popup is open
        if (this.isBedsidePopupVisible()) {
            return;
        }

        // Check if clicked on an object
        if (this.currentRoom) {
            const clickedObject = this.currentRoom.getObjectAtPoint(x, y);
            if (clickedObject) {
                clickedObject.click();
            }
        }
    }

    /**
     * Handle mouse move
     */
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = event.clientX - rect.left;
        this.mouseY = event.clientY - rect.top;
    }

    /**
     * Update mouse hover state for objects
     */
    updateMouseHoverState() {
        if (this.currentRoom) {
            for (let obj of this.currentRoom.clickableObjects) {
                obj.hovered = obj.isPointInside(this.mouseX, this.mouseY);
            }
        }
    }

    /**
     * Update room UI elements
     */
    updateRoomUI() {
        // Clear room title
        this.roomTitleElement.textContent = '';
    }



    /**
     * Show dialogue
     */
    showDialogue(dialogue) {
        this.dialogueManager.displayDialogue(dialogue);
    }

    /**
     * Play a registered minigame
     */
    playMinigame(minigameId, context = {}) {
        this.minigameManager.play(minigameId, context);
    }

    /**
     * End current dialogue
     */
    endDialogue() {
        this.dialogueManager.endDialogue();
    }

    /**
     * Set a game variable
     */
    setVariable(key, value) {
        this.gameState.variables[key] = value;
    }

    /**
     * Get a game variable
     */
    getVariable(key, defaultValue = null) {
        return this.gameState.variables[key] ?? defaultValue;
    }

    /**
     * Load saved writing submissions from local storage.
     */
    loadUserSubmissionsFromStorage() {
        try {
            const savedData = localStorage.getItem(this.userSubmissionsStorageKey);

            if (!savedData) {
                return;
            }

            const parsed = JSON.parse(savedData);
            if (Array.isArray(parsed)) {
                this.gameState.userSubmissions = parsed.filter((entry) => typeof entry === 'string' && entry.trim().length > 0);
            }
        } catch (error) {
            console.warn('Could not load saved submissions:', error);
        }
    }

    /**
     * Save writing submissions to local storage.
     */
    saveUserSubmissionsToStorage() {
        try {
            localStorage.setItem(this.userSubmissionsStorageKey, JSON.stringify(this.gameState.userSubmissions));
        } catch (error) {
            console.warn('Could not save submissions:', error);
        }
    }

    /**
     * Load published stories from local storage.
     */
    loadPublishedStoriesFromStorage() {
        try {
            const savedData = localStorage.getItem(this.publishedStoriesStorageKey);

            if (!savedData) {
                return;
            }

            const parsed = JSON.parse(savedData);
            if (Array.isArray(parsed)) {
                this.gameState.publishedStories = parsed.filter((entry) => typeof entry === 'string' && entry.trim().length > 0);
            }
        } catch (error) {
            console.warn('Could not load published stories:', error);
        }
    }

    /**
     * Save published stories to local storage.
     */
    savePublishedStoriesToStorage() {
        try {
            localStorage.setItem(this.publishedStoriesStorageKey, JSON.stringify(this.gameState.publishedStories));
        } catch (error) {
            console.warn('Could not save published stories:', error);
        }
    }

    /**
     * Mark an action as completed
     */
    markActionCompleted(actionId) {
        this.gameState.completedActions.add(actionId);
    }

    /**
     * Check if action was completed
     */
    isActionCompleted(actionId) {
        return this.gameState.completedActions.has(actionId);
    }

    /**
     * Play background music by ID
     */
    playBGM(audioId, options = {}) {
        this.audioManager.playBGM(audioId, options);
    }

    /**
     * Stop background music
     */
    stopBGM(fadeOut = 0) {
        this.audioManager.stopBGM(fadeOut);
    }

    /**
     * Play a sound effect
     */
    playSFX(audioId, options = {}) {
        this.audioManager.playSFX(audioId, options);
    }

    /**
     * Pause background music
     */
    pauseBGM() {
        this.audioManager.pauseBGM();
    }

    /**
     * Resume background music
     */
    resumeBGM() {
        this.audioManager.resumeBGM();
    }

    /**
     * Set background music volume (0-1)
     */
    setBGMVolume(volume) {
        this.audioManager.setBGMVolume(volume);
    }

    /**
     * Set sound effects volume (0-1)
     */
    setSFXVolume(volume) {
        this.audioManager.setSFXVolume(volume);
    }

    /**
     * Set master volume for all audio (0-1)
     */
    setMasterVolume(volume) {
        this.audioManager.setMasterVolume(volume);
    }

    /**
     * Mute all audio
     */
    muteAudio() {
        this.audioManager.mute();
    }

    /**
     * Unmute audio
     */
    unmuteAudio() {
        this.audioManager.unmute();
    }

    /**
     * Show fountain popup with random text
     */
    showFountainPopup(textOptions = []) {
        const popup = document.getElementById('fountain-popup');
        const textElement = document.getElementById('fountain-popup-text');
        const refreshBtn = document.getElementById('fountain-popup-refresh');
        const closeBtn = document.getElementById('fountain-popup-close');
        
        if (!popup || !textElement || textOptions.length === 0) {
            return;
        }

        // Pick and display a random message
        const pickRandom = () => {
            textElement.textContent = textOptions[Math.floor(Math.random() * textOptions.length)];

            // Restart fade-in animation for each newly generated message
            textElement.style.animation = 'none';
            void textElement.offsetWidth;
            textElement.style.animation = '';
        };
        pickRandom();

        // Wire refresh button
        if (refreshBtn) {
            refreshBtn.onclick = () => pickRandom();
        }

        // Wire close button
        if (closeBtn) {
            closeBtn.onclick = () => this.hideFountainPopup();
        }

        // Click backdrop to close
        popup.onclick = (e) => {
            if (e.target === popup) {
                this.hideFountainPopup();
            }
        };

        popup.classList.remove('hidden');
    }

    /**
     * Hide fountain popup
     */
    hideFountainPopup() {
        const popup = document.getElementById('fountain-popup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }

    /**
     * Show lounge game cabinet popup
     */
    showGameCabinetPopup(gameEntries = []) {
        if (!this.gameCabinetPopup || !this.gameCabinetList || !this.gameCabinetDescription || !this.gameCabinetImage || !this.gameCabinetPlayBtn) {
            return;
        }

        this.selectedCabinetGame = null;
        this.gameCabinetList.innerHTML = '';
        this.gameCabinetDescription.textContent = 'Pick a game from the list to view details.';
        this.gameCabinetImage.classList.add('hidden');
        this.gameCabinetImage.removeAttribute('src');
        this.gameCabinetPlayBtn.classList.add('hidden');
        this.gameCabinetPlayBtn.onclick = null;

        gameEntries.forEach((entry) => {
            const itemBtn = document.createElement('button');
            itemBtn.type = 'button';
            itemBtn.className = 'game-cabinet-item';
            itemBtn.textContent = entry.name;
            itemBtn.onclick = () => {
                this.selectedCabinetGame = entry;

                const buttons = this.gameCabinetList.querySelectorAll('.game-cabinet-item');
                buttons.forEach((btn) => btn.classList.remove('selected'));
                itemBtn.classList.add('selected');

                // Removed: this.gameCabinetTitle.textContent = entry.name;
                this.gameCabinetDescription.textContent = entry.description || 'No description available.';

                if (entry.screenshotPath) {
                    this.gameCabinetImage.src = entry.screenshotPath;
                    this.gameCabinetImage.classList.remove('hidden');
                } else {
                    this.gameCabinetImage.classList.add('hidden');
                    this.gameCabinetImage.removeAttribute('src');
                }

                if (entry.url) {
                    this.gameCabinetPlayBtn.classList.remove('hidden');
                    this.gameCabinetPlayBtn.onclick = () => {
                        window.open(entry.url, '_blank', 'noopener,noreferrer');
                    };
                } else {
                    this.gameCabinetPlayBtn.classList.add('hidden');
                    this.gameCabinetPlayBtn.onclick = null;
                }
            };
            this.gameCabinetList.appendChild(itemBtn);
        });

        this.gameCabinetPopup.classList.remove('hidden');
    }

    /**
     * Hide lounge game cabinet popup
     */
    hideGameCabinetPopup() {
        if (this.gameCabinetPopup) {
            this.gameCabinetPopup.classList.add('hidden');
        }
    }

    /**
     * Check if lounge game cabinet popup is open
     */
    isGameCabinetPopupVisible() {
        return this.gameCabinetPopup && !this.gameCabinetPopup.classList.contains('hidden');
    }

    /**
     * Show toolbox category popup
     */
    showToolboxPopup(categoryEntries = []) {
        this.toolboxCategories = Array.isArray(categoryEntries) ? categoryEntries : [];
        this.showToolboxCategoriesPopup();
    }

    /**
     * Show toolbox categories popup
     */
    showToolboxCategoriesPopup() {
        if (!this.toolboxPopup || !this.toolboxList) {
            return;
        }

        this.selectedToolboxCategory = null;
        this.toolboxList.innerHTML = '';
        this.hideToolboxSolutionsPopup();

        this.toolboxCategories.forEach((entry) => {
            const itemBtn = document.createElement('button');
            itemBtn.type = 'button';
            itemBtn.className = 'toolbox-item';
            itemBtn.textContent = entry.name;
            itemBtn.onclick = () => {
                this.selectedToolboxCategory = entry;
                this.hideToolboxCategoriesPopup();
                this.showToolboxSolutionsPopup(entry);
            };

            this.toolboxList.appendChild(itemBtn);
        });

        this.toolboxPopup.classList.remove('hidden');
    }

    /**
     * Hide toolbox categories popup
     */
    hideToolboxCategoriesPopup() {
        if (this.toolboxPopup) {
            this.toolboxPopup.classList.add('hidden');
        }
    }

    /**
     * Show toolbox solutions popup
     */
    showToolboxSolutionsPopup(entry) {
        if (!this.toolboxSolutionsPopup || !this.toolboxTitle || !this.toolboxDescription || !this.toolboxAlternatives) {
            return;
        }

        this.toolboxTitle.textContent = entry?.name || 'Category';
        this.toolboxDescription.textContent = 'Alternatives:';
        this.toolboxAlternatives.innerHTML = '';

        const alternatives = Array.isArray(entry?.alternatives) ? entry.alternatives : [];
        alternatives.forEach((alternative) => {
            const listItem = document.createElement('li');
            listItem.textContent = alternative;
            this.toolboxAlternatives.appendChild(listItem);
        });

        this.toolboxSolutionsPopup.classList.remove('hidden');
    }

    /**
     * Hide toolbox solutions popup
     */
    hideToolboxSolutionsPopup() {
        if (this.toolboxSolutionsPopup) {
            this.toolboxSolutionsPopup.classList.add('hidden');
        }
    }

    /**
     * Show bedside sheet popup
     */
    showBedsidePopup() {
        if (this.bedsidePopup) {
            this.bedsidePopup.classList.remove('hidden');
        }
    }

    /**
     * Hide bedside sheet popup
     */
    hideBedsidePopup() {
        if (this.bedsidePopup) {
            this.bedsidePopup.classList.add('hidden');
        }
    }

    /**
     * Print the bedside sheet
     */
    printBedsideSheet() {
        window.print();
    }

    /**
     * Show grounding techniques popup
     */
    showGroundingPopup(techniques = []) {
        if (!this.groundingPopup || !this.groundingList) {
            return;
        }

        this.hideGroundingInstructionsPopup();
        this.groundingTechniques = techniques;
        this.groundingList.innerHTML = '';

        techniques.forEach((technique) => {
            const techniqueBtn = document.createElement('button');
            techniqueBtn.type = 'button';
            techniqueBtn.className = 'grounding-technique-item';
            techniqueBtn.textContent = technique.name;
            techniqueBtn.onclick = () => {
                this.showGroundingInstructionsPopup(technique);
            };
            this.groundingList.appendChild(techniqueBtn);
        });

        this.groundingPopup.classList.remove('hidden');
    }

    /**
     * Hide grounding techniques popup
     */
    hideGroundingPopup() {
        if (this.groundingPopup) {
            this.groundingPopup.classList.add('hidden');
        }
    }

    /**
     * Show grounding instructions popup
     */
    showGroundingInstructionsPopup(technique) {
        if (!this.groundingInstructionsPopup || !this.groundingInstructionText || !this.groundingInstructionsCounter) {
            return;
        }

        this.hideGroundingPopup();
        this.currentTechnique = technique;
        this.currentInstructionIndex = 0;
        this.updateGroundingDisplay();
        this.groundingInstructionsPopup.classList.remove('hidden');
    }

    /**
     * Hide grounding instructions popup
     */
    hideGroundingInstructionsPopup() {
        if (this.groundingInstructionsPopup) {
            this.groundingInstructionsPopup.classList.add('hidden');
        }
    }

    /**
     * Update the displayed grounding instruction
     */
    updateGroundingDisplay() {
        if (!this.currentTechnique || !this.currentTechnique.instructions || this.currentTechnique.instructions.length === 0) {
            return;
        }

        const instruction = this.currentTechnique.instructions[this.currentInstructionIndex];

        // Restart fade-in animation
        this.groundingInstructionText.style.animation = 'none';
        void this.groundingInstructionText.offsetWidth; // Force reflow
        this.groundingInstructionText.style.animation = '';

        this.groundingInstructionText.textContent = instruction;
        this.groundingInstructionsCounter.textContent = `${this.currentInstructionIndex + 1}/${this.currentTechnique.instructions.length}`;

        // Update button states
        if (this.groundingInstructionsPrevBtn) {
            this.groundingInstructionsPrevBtn.disabled = this.currentInstructionIndex === 0;
        }
        if (this.groundingInstructionsNextBtn) {
            this.groundingInstructionsNextBtn.disabled = this.currentInstructionIndex === this.currentTechnique.instructions.length - 1;
        }
    }

    /**
     * Navigate to previous grounding instruction
     */
    previousGroundingInstruction() {
        if (this.currentInstructionIndex > 0) {
            this.currentInstructionIndex--;
            this.updateGroundingDisplay();
        }
    }

    /**
     * Navigate to next grounding instruction
     */
    nextGroundingInstruction() {
        if (this.currentTechnique && this.currentInstructionIndex < this.currentTechnique.instructions.length - 1) {
            this.currentInstructionIndex++;
            this.updateGroundingDisplay();
        }
    }

    /**
     * Show resources popup
     */
    showResourcesPopup(resources = []) {
        if (!this.resourcesPopup || !this.resourcesList) {
            return;
        }

        this.resourcesList.innerHTML = '';

        resources.forEach((resource) => {
            const resourceLink = document.createElement('a');
            resourceLink.href = resource.url;
            resourceLink.target = '_blank';
            resourceLink.rel = 'noopener,noreferrer';
            resourceLink.className = 'resource-item';
            resourceLink.innerHTML = `<strong>${resource.name}</strong><br><span class="resource-description">${resource.description}</span>`;
            this.resourcesList.appendChild(resourceLink);
        });

        this.resourcesPopup.classList.remove('hidden');
    }

    /**
     * Hide resources popup
     */
    hideResourcesPopup() {
        if (this.resourcesPopup) {
            this.resourcesPopup.classList.add('hidden');
        }
    }

    /**
     * Show bookshelf popup with books
     */
    showBookshelfPopup(stories = []) {
        if (!this.bookshelfBooks) {
            return;
        }

        this.hideBookStoryPopup();
        this.currentBookshelfStories = stories;
        this.bookshelfBooks.innerHTML = '';

        const imageMap = {
            'Stories': 'assets/ui/UI_stories.png',
            'Darling': 'assets/ui/UI_darling.png',
            'Submissions': 'assets/ui/UI_submissions.png'
        };

        stories.forEach((story) => {
            const bookImg = document.createElement('img');
            bookImg.className = 'bookshelf-book-item';
            bookImg.src = imageMap[story.category] || 'assets/ui/UI_stories.png'; // fallback
            bookImg.alt = story.category;
            bookImg.onclick = () => {
                this.playSFX('sfx_book');
                this.showBookStoryPopup(story);
            };
            this.bookshelfBooks.appendChild(bookImg);
        });

        this.bookshelfBooks.classList.remove('hidden');
        if (this.bookshelfOverlay) {
            this.bookshelfOverlay.classList.remove('hidden');
        }
    }

    /**
     * Hide bookshelf
     */
    hideBookshelfPopup() {
        if (this.bookshelfBooks) {
            this.bookshelfBooks.classList.add('hidden');
        }
        if (this.bookshelfOverlay) {
            this.bookshelfOverlay.classList.add('hidden');
        }
    }

    /**
     * Show book story reader popup
     */
    showBookStoryPopup(story) {
        if (!this.bookStoryPopup || !this.bookStoryLeftPage || !this.bookStoryRightPage || !this.bookStoryCounter) {
            return;
        }

        this.hideBookshelfPopup();
        this.currentStoryCategory = story;
        this.currentStoryIndex = 0;
        this.updateStoryDisplay();
        this.bookStoryPopup.classList.remove('hidden');
    }

    /**
     * Hide book story popup
     */
    hideBookStoryPopup() {
        if (this.bookStoryPopup) {
            this.bookStoryPopup.classList.add('hidden');
        }
    }

    /**
     * Update the displayed story
     */
    updateStoryDisplay() {
        if (!this.currentStoryCategory || !this.currentStoryCategory.stories || this.currentStoryCategory.stories.length === 0) {
            return;
        }

        const story = this.currentStoryCategory.stories[this.currentStoryIndex];
        
        // Split story text between left and right pages like a real book
        const paragraphs = story.split('\n\n').filter(p => p.trim().length > 0);
        let leftPageText = '';
        let rightPageText = '';
        
        // Try to fit paragraphs on left page first
        // Estimate: aim for about 60% of content on left page, adjust based on paragraph count
        const totalParagraphs = paragraphs.length;
        const leftPageParagraphs = Math.max(1, Math.floor(totalParagraphs * 0.6));
        
        if (totalParagraphs <= 2) {
            // Very short stories - put everything on left page
            leftPageText = story;
        } else {
            // Split by paragraphs
            const leftParagraphs = paragraphs.slice(0, leftPageParagraphs);
            const rightParagraphs = paragraphs.slice(leftPageParagraphs);
            
            leftPageText = leftParagraphs.join('\n\n');
            rightPageText = rightParagraphs.join('\n\n');
        }
        
        this.bookStoryLeftPage.textContent = leftPageText;
        this.bookStoryRightPage.textContent = rightPageText;
        
        this.bookStoryCounter.textContent = `${this.currentStoryIndex + 1}/${this.currentStoryCategory.stories.length}`;
        const canDeleteCurrentStory = Boolean(
            this.bookStoryDeleteBtn &&
            this.currentStoryCategory.isUserSubmissionCategory &&
            this.gameState.userSubmissions.length > 0
        );

        if (this.bookStoryDeleteBtn) {
            this.bookStoryDeleteBtn.classList.toggle('hidden', !canDeleteCurrentStory);
        }

        const canPublishCurrentStory = Boolean(
            this.bookStoryPublishBtn &&
            this.currentStoryCategory.isUserSubmissionCategory &&
            this.gameState.userSubmissions.length > 0
        );

        if (this.bookStoryPublishBtn) {
            this.bookStoryPublishBtn.classList.toggle('hidden', !canPublishCurrentStory);
        }

        // Update button states
        if (this.bookStoryPrevBtn) {
            this.bookStoryPrevBtn.disabled = this.currentStoryIndex === 0;
        }
        if (this.bookStoryNextBtn) {
            this.bookStoryNextBtn.disabled = this.currentStoryIndex === this.currentStoryCategory.stories.length - 1;
        }
    }

    deleteCurrentStory() {
        if (!this.currentStoryCategory || !this.currentStoryCategory.isUserSubmissionCategory) {
            return;
        }

        if (this.gameState.userSubmissions.length === 0) {
            return;
        }

        if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            return;
        }

        this.playSFX('sfx_click');
        this.gameState.userSubmissions.splice(this.currentStoryIndex, 1);
        this.saveUserSubmissionsToStorage();

        if (this.gameState.userSubmissions.length === 0) {
            this.currentStoryCategory.stories = ['No submissions yet. Share your story by visiting the writing desk!'];
            this.currentStoryCategory.isUserSubmissionCategory = false;
            this.currentStoryIndex = 0;
        } else {
            this.currentStoryCategory.stories = this.gameState.userSubmissions;
            this.currentStoryIndex = Math.min(this.currentStoryIndex, this.currentStoryCategory.stories.length - 1);
        }

        this.updateStoryDisplay();
    }

    publishCurrentStory() {
        if (!this.currentStoryCategory || !this.currentStoryCategory.isUserSubmissionCategory) {
            return;
        }

        if (this.gameState.userSubmissions.length === 0) {
            return;
        }

        if (!confirm('Are you sure you want to publish this story to the Stories section? Once published, it will be permanently visible to anyone who plays the game.')) {
            return;
        }

        this.playSFX('sfx_click');
        const storyToPublish = this.gameState.userSubmissions.splice(this.currentStoryIndex, 1)[0];
        this.gameState.publishedStories.push(storyToPublish);
        this.saveUserSubmissionsToStorage();
        this.savePublishedStoriesToStorage();

        if (this.gameState.userSubmissions.length === 0) {
            this.currentStoryCategory.stories = ['No submissions yet. Share your story by visiting the writing desk!'];
            this.currentStoryCategory.isUserSubmissionCategory = false;
            this.currentStoryIndex = 0;
        } else {
            this.currentStoryCategory.stories = this.gameState.userSubmissions;
            this.currentStoryIndex = Math.min(this.currentStoryIndex, this.currentStoryCategory.stories.length - 1);
        }

        this.updateStoryDisplay();
    }

    /**
     * Navigate to previous story
     */
    previousStory() {
        if (this.currentStoryIndex > 0) {
            this.playSFX('sfx_page');
            this.currentStoryIndex--;
            this.updateStoryDisplay();
        }
    }

    /**
     * Navigate to next story
     */
    nextStory() {
        if (
            this.currentStoryCategory &&
            this.currentStoryCategory.stories &&
            this.currentStoryIndex < this.currentStoryCategory.stories.length - 1
        ) {
            this.playSFX('sfx_page');
            this.currentStoryIndex++;
            this.updateStoryDisplay();
        }
    }

    /**
     * Show write story popup
     */
    showWriteStoryPopup() {
        if (this.writeStoryPopup && this.writeStoryInput) {
            this.writeStoryInput.value = '';
            this.writeStoryPopup.classList.remove('hidden');
            this.writeStoryInput.focus();
        }
    }

    /**
     * Hide write story popup
     */
    hideWriteStoryPopup() {
        if (this.writeStoryPopup) {
            this.writeStoryPopup.classList.add('hidden');
            if (this.writeStoryInput) {
                this.writeStoryInput.value = '';
            }
        }
    }

    /**
     * Submit a user-written story
     */
    submitStory() {
        if (!this.writeStoryInput || !this.writeStoryInput.value.trim()) {
            this.showDialogue(new Dialogue('empty_story', 'Please write something before submitting!', [
                new DialogueChoice('OK', 'empty_story_ok', () => {})
            ]));
            return;
        }

        const story = this.writeStoryInput.value.trim();
        this.gameState.userSubmissions.push(story);
        this.saveUserSubmissionsToStorage();
        this.hideWriteStoryPopup();

        this.showDialogue(new Dialogue('submission_success', 'Your story has been submitted! You can find it in the Submissions section of the bookshelf.', [
            new DialogueChoice('Thank You', 'submission_thanks', () => {})
        ]));
    }

    /**
     * Check if bedside popup is open
     */
    isBedsidePopupVisible() {
        return this.bedsidePopup && !this.bedsidePopup.classList.contains('hidden');
    }

    /**
     * Hide toolbox popup
     */
    hideToolboxPopup() {
        this.hideToolboxCategoriesPopup();
        this.hideToolboxSolutionsPopup();
    }

    /**
     * Check if toolbox popup is open
     */
    isToolboxPopupVisible() {
        const categoriesVisible = this.toolboxPopup && !this.toolboxPopup.classList.contains('hidden');
        const solutionsVisible = this.toolboxSolutionsPopup && !this.toolboxSolutionsPopup.classList.contains('hidden');
        return categoriesVisible || solutionsVisible;
    }

    /**
     * Show workshop writing prompt popup
     */
    showWorkshopPromptPopup(promptOptions = []) {
        if (!this.workshopPromptPopup || !this.workshopPromptText || !this.workshopPromptAnswer) {
            return;
        }

        this.workshopPromptOptions = Array.isArray(promptOptions) ? promptOptions : [];
        this.workshopPromptAnswer.value = '';
        this.pickWorkshopPrompt();
        this.workshopPromptPopup.classList.remove('hidden');
        this.workshopPromptAnswer.focus();
    }

    /**
     * Choose and render a random workshop prompt
     */
    pickWorkshopPrompt() {
        if (!this.workshopPromptText) {
            return;
        }

        if (!this.workshopPromptOptions.length) {
            this.workshopPromptText.textContent = 'Write about five things that bring you comfort today.';
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.workshopPromptOptions.length);
        this.workshopPromptText.textContent = this.workshopPromptOptions[randomIndex];
    }

    /**
     * Hide workshop prompt popup
     */
    hideWorkshopPromptPopup() {
        if (this.workshopPromptPopup) {
            this.workshopPromptPopup.classList.add('hidden');
        }
    }

    /**
     * Check if workshop prompt popup is open
     */
    isWorkshopPromptPopupVisible() {
        return this.workshopPromptPopup && !this.workshopPromptPopup.classList.contains('hidden');
    }

    /**
     * Toggle background music mute state without affecting SFX
     */
    toggleBGMMute() {
        if (!this.isBGMMuted) {
            this.lastBGMVolume = this.audioManager.bgmVolume > 0 ? this.audioManager.bgmVolume : this.lastBGMVolume;
            this.setBGMVolume(0);
            this.isBGMMuted = true;
        } else {
            this.setBGMVolume(this.lastBGMVolume || 0.7);
            this.isBGMMuted = false;
        }

        this.updateBGMToggleButton();
    }

    /**
     * Update external BGM toggle button text/state
     */
    updateBGMToggleButton() {
        if (!this.bgmToggleBtn) {
            return;
        }

        const label = this.isBGMMuted ? 'Unmute Music' : 'Mute Music';
        this.bgmToggleBtn.textContent = '';
        this.bgmToggleBtn.classList.toggle('is-muted', this.isBGMMuted);
        this.bgmToggleBtn.setAttribute('aria-pressed', this.isBGMMuted ? 'true' : 'false');
        this.bgmToggleBtn.setAttribute('aria-label', label);
        this.bgmToggleBtn.setAttribute('title', label);
    }

    /**
     * Stop the game
     */
    stop() {
        this.isRunning = false;
    }
}

// Initialize game when page loads
let game = null;

window.addEventListener('load', () => {
    game = new Game();
    const skipCutsceneBtn = document.getElementById('skip-cutscene-btn');
    const startScreen = document.getElementById('start-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    let hasStartedGame = false;

    const hideOpeningSkip = () => {
        if (skipCutsceneBtn) {
            skipCutsceneBtn.classList.add('hidden');
        }
    };

    const showOpeningSkip = () => {
        if (skipCutsceneBtn) {
            skipCutsceneBtn.classList.remove('hidden');
        }
    };
    
    // Register audio files
    game.registerAudios({
        'bgm_title': 'assets/audio/Silent-Passing.mp3',
        'bgm_opening': 'assets/audio/tba',
        'bgm_map1': 'assets/audio/Moment-of-Respite.mp3',
        'bgm_map2': 'assets/audio/Falling-Stars.mp3',
        'bgm_bedroom1': 'assets/audio/Whispers-on-a-Sleepless-Night.mp3',
        'bgm_bedroom2': 'assets/audio/Where-Wind-Whispers.mp3',
        'bgm_study1': 'assets/audio/I-Question-My-Fate.mp3',
        'bgm_study2': 'assets/audio/Star-Falling-Through-a-Dream.mp3',
        'bgm_lounge1': 'assets/audio/Dreams-Adrift-in-Coffee.mp3',
        'bgm_lounge2': 'assets/audio/De-Insomniis.mp3',
        'bgm_workshop1': 'assets/audio/Twisted-Path-to-You.mp3',
        'bgm_workshop2': 'assets/audio/Wrecked-and-Stranded.mp3',
        'bgm_garden1': 'assets/audio/Measured-by-My-Heart.mp3',
        'bgm_garden2': 'assets/audio/Depths-of-the-Dim-Forest.mp3',
        'sfx_click': 'assets/audio/sfx_click.mp3',
        'sfx_door': 'assets/audio/door-open.mp3',
        'sfx_boop': 'assets/audio/boop.wav',
        'sfx_book': 'assets/audio/sfx_book.mp3',
        'sfx_page': 'assets/audio/sfx_page.mp3'
    });
    
    // ===== CUTSCENE ROOM =====
    const cutsceneRoom = game.createRoom('cutscene', 'Opening', 'assets/ui/cutscene_background.png');
    cutsceneRoom.setBackgroundMusic('bgm_opening', { loop: false });

    // ===== MAP ROOM (FLOOR PLAN) =====
    const mapRoom = game.createRoom('map', 'Floor Plan', 'assets/rooms/full-map.png');
    mapRoom.setBackgroundMusicPlaylist(['bgm_map1', 'bgm_map2'], { fadeIn: 1000 });
    mapRoom.backgroundScale = 1; // scale floor plan smaller than container

    // Room 1 clickable area on map (Bedroom)
    const room1MapBtn = new ClickableObject('room1_map', 'Bedroom', 160, 225, 320, 235);
    room1MapBtn.scale = 0.65;
    room1MapBtn.onClick(() => {
        game.playSFX('sfx_click');
        const bedroomDialogue = new Dialogue('bedroom_intro', 
            [
                'This is the Master Bedroom, where you can go when you need a safe space.',
                'There are different techniques for grounding yourself, along with resources in British Columbia you can look into.',
                'Moreover, a copy of a safety plan can be found and printed so you can fill it out, which I highly recommend!',
                'Would you like to enter the Master Bedroom?'
            ],
            [
                new DialogueChoice('Enter Bedroom', 'enter_bedroom', () => {
                    game.loadRoom('room1');
                }),
                new DialogueChoice('Stay on Map', 'stay_map', () => {
                    // Do nothing, stay on map
                })
            ],
            'assets/placeholders/teddy-bear.png',
            'Darling',
            null,
            'assets/ui/dialogue_box1.png'
        );
        game.showDialogue(bedroomDialogue);
    });
    mapRoom.addClickableObject(room1MapBtn);

    // Room 2 clickable area on map (Study)
    const room2MapBtn = new ClickableObject('room2_map', 'Study', 550, 225, 310, 235);
    room2MapBtn.scale = 0.90;
    room2MapBtn.onClick(() => {
        game.playSFX('sfx_click');
        const studyDialogue = new Dialogue('study_intro', 
            [
                'This is the Study. Mind the mess, it\’s a little crowded.',
                'In the Study, you can read personal stories from people who have experienced crises. You can also write and submit your own.',
                'WARNING: Reading these stories can be a visceral experience so please only do so if you know you can handle it safely.',
                'Would you like to enter the Study?'
            ],
            [
                new DialogueChoice('Enter Study', 'enter_study', () => {
                    game.loadRoom('room2');
                }),
                new DialogueChoice('Stay on Map', 'stay_map', () => {
                    // Do nothing, stay on map
                })
            ],
            'assets/placeholders/teddy-bear.png',
            'Darling',
            null,
            'assets/ui/dialogue_box1.png'
        );
        game.showDialogue(studyDialogue);
    });
    mapRoom.addClickableObject(room2MapBtn);

    // Room 3 clickable area on map (Lounge)
    const room3MapBtn = new ClickableObject('room3_map', 'Lounge', 160, 540, 320, 215);
    room3MapBtn.scale = 0.75;
    room3MapBtn.onClick(() => {
        game.playSFX('sfx_click');
        const lounge2Dialogue = new Dialogue('lounge2_intro', 
            [
                'Here we have the Lounge, a place for games and distractions.',
                'I\'ve curated a list of fairly simple games you can play on your browser whenever you need a break or a distraction.',
                'Would you like to enter the Lounge?'
            ],
            [
                new DialogueChoice('Enter Lounge', 'enter_lounge2', () => {
                    game.loadRoom('room3');
                }),
                new DialogueChoice('Stay on Map', 'stay_map', () => {
                    // Do nothing, stay on map
                })
            ],
            'assets/placeholders/teddy-bear.png',
            'Darling',
            null,
            'assets/ui/dialogue_box1.png'
        );
        game.showDialogue(lounge2Dialogue);
    });
    mapRoom.addClickableObject(room3MapBtn);

    // Room 4 clickable area on map (Workshop)
    const room4MapBtn = new ClickableObject('room4_map', 'Workshop', 550, 540, 315, 215);
    room4MapBtn.scale = 0.75;
    room4MapBtn.onClick(() => {
        game.playSFX('sfx_click');
        const workshopDialogue = new Dialogue('workshop_intro', 
            [
                'This is the Workshop, where I give direction but you have to take action on your end.',
                'Here you can find multiple long lists of alternatives for various different emotions or states of mind.',
                'You might find them useful!',
                'Would you like to enter the Workshop?'
            ],
            [
                new DialogueChoice('Enter Workshop', 'enter_workshop', () => {
                    game.loadRoom('room4');
                }),
                new DialogueChoice('Stay on Map', 'stay_map', () => {
                    // Do nothing, stay on map
                })
            ],
            'assets/placeholders/teddy-bear.png',
            'Darling',
            null,
            'assets/ui/dialogue_box1.png'
        );
        game.showDialogue(workshopDialogue);
    });
    mapRoom.addClickableObject(room4MapBtn);

    // Room 5 clickable area on map (Garden)
    const room5MapBtn = new ClickableObject('room5_map', 'Garden', 245, 25, 550, 200);
    room5MapBtn.scale = 0.75;
    room5MapBtn.onClick(() => {
        game.playSFX('sfx_click');
        const gardenDialogue = new Dialogue('garden_intro', 
            [
                'This is the Garden of Hope. Here, it\’s all about positivity.',
                'You can find all sorts of positive affirmations for whenever you need to hear something kind and caring.',
                'Would you like to enter the Garden of Hope?'
            ],
            [
                new DialogueChoice('Enter Garden', 'enter_garden', () => {
                    game.loadRoom('room5');
                }),
                new DialogueChoice('Stay on Map', 'stay_map', () => {
                    // Do nothing, stay on map
                })
            ],
            'assets/placeholders/teddy-bear.png',
            'Darling',
            null,
            'assets/ui/dialogue_box1.png'
        );
        game.showDialogue(gardenDialogue);
    });
    mapRoom.addClickableObject(room5MapBtn);

    // Center map clickable area (Hope Box / treasure chest)
    const hopeBoxMapBtn = new ClickableObject('hope_box_map', 'Hope Box', 470, 465, 90, 65);
    hopeBoxMapBtn.scale = 0.75;
    hopeBoxMapBtn.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('hope_box');
    });
    mapRoom.addClickableObject(hopeBoxMapBtn);

    // ===== ROOM 1: BEDROOM =====
    const room1 = game.createRoom('room1', 'Bedroom', 'assets/rooms/room_bedroom.png');
    room1.setBackgroundMusicPlaylist(['bgm_bedroom1', 'bgm_bedroom2'], { fadeIn: 1000 });
    room1.backgroundScale = 1.0;

    // Clickable objects in room1
    const bed = new ClickableObject('bed', 'Bed', 600, 250, 450, 250);
    bed.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('bed');
    });
    room1.addClickableObject(bed);

    const bedside = new ClickableObject('bedside', 'Bedside', 900, 400, 150, 150);
    bedside.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('bedside');
    });
    room1.addClickableObject(bedside);

    const computer = new ClickableObject('computer', 'Computer', 1, 250, 100, 150);
    computer.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('computer');
    });
    room1.addClickableObject(computer);

    const exitBtn = new ClickableObject('exit_room1', 'Exit', 35, 135, 120, 35);
    exitBtn.onClick(() => {
        game.loadRoom('map');
    });
    room1.addClickableObject(exitBtn);

    // ===== ROOM 2: STUDY =====
    const room2 = game.createRoom('room2', 'Study', 'assets/rooms/room_study.png');
    room2.setBackgroundMusicPlaylist(['bgm_study1', 'bgm_study2'], { fadeIn: 1000 });
    room2.backgroundScale = 1.0;

    // Clickable objects in room2
    const write = new ClickableObject('write', 'Write', 350, 250, 280, 130);
    write.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('write');
    });
    room2.addClickableObject(write);

    const workbench = new ClickableObject('workbench', 'Workbench', 650, 380, 380, 250);
    workbench.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('workbench');
    });
    room2.addClickableObject(workbench);

    const bookshelf = new ClickableObject('bookshelf', 'Bookshelf', 750, 120, 270, 250);
    bookshelf.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('bookshelf');
    });
    room2.addClickableObject(bookshelf);

    const exitBtn2 = new ClickableObject('exit_room2', 'Exit', 35, 135, 120, 35);
    exitBtn2.onClick(() => {
        game.loadRoom('map');
    });
    room2.addClickableObject(exitBtn2);

    // ===== ROOM 3: LOUNGE =====
    const room3 = game.createRoom('room3', 'Lounge', 'assets/rooms/room_lounge.png');
    room3.setBackgroundMusicPlaylist(['bgm_lounge1', 'bgm_lounge2'], { fadeIn: 1000 });
    room3.backgroundScale = 1.0;

    // Clickable objects in room3
    const arcade = new ClickableObject('arcade', 'Arcade', 890, 250, 190, 370);
    arcade.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('arcade');
    });
    room3.addClickableObject(arcade);

    const gameCabinet = new ClickableObject('lounge_game_cabinet', 'Game Cabinet', 5, 180, 180, 200);
    gameCabinet.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('lounge_game_cabinet');
    });
    room3.addClickableObject(gameCabinet);

    const book = new ClickableObject('book', 'Book', 550, 360, 70, 50);
    book.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('book');
    });
    room3.addClickableObject(book);

    const exitBtn3 = new ClickableObject('exit_room3', 'Exit', 35, 135, 120, 35);
    exitBtn3.onClick(() => {
        game.loadRoom('map');
    });
    room3.addClickableObject(exitBtn3);

    // ===== ROOM 4: WORKSHOP =====
    const room4 = game.createRoom('room4', 'Workshop', 'assets/rooms/room_workshop.png');
    room4.setBackgroundMusicPlaylist(['bgm_workshop1', 'bgm_workshop2'], { fadeIn: 1000 });
    room4.backgroundScale = 1.0;

    // Clickable objects in room4
    const toolbox = new ClickableObject('toolbox', 'Toolbox', 400, 395, 150, 90);
    toolbox.onClick(() => {
        game.playSFX('sfx_click');
        game.playMinigame('toolbox');
    });
    room4.addClickableObject(toolbox);

    const exitBtn4 = new ClickableObject('exit_room4', 'Exit', 35, 135, 120, 35);
    exitBtn4.onClick(() => {
        game.loadRoom('map');
    });
    room4.addClickableObject(exitBtn4);

    // ===== ROOM 5: GARDEN =====
    const room5 = game.createRoom('room5', 'Garden', 'assets/rooms/room_garden.png');
    room5.setBackgroundMusicPlaylist(['bgm_garden1', 'bgm_garden2'], { fadeIn: 1000 });
    room5.backgroundScale = 1.0;

    // Clickable objects in room5
    const fountain = new ClickableObject('fountain', 'Fountain', 310, 185, 400, 350);
    fountain.onClick(() => {
        game.playSFX('sfx_click');
        
        // Random fountain messages
        const fountainMessages = [
            'This pain is temporary\; I will find peace.',
            'I am not my thoughts\; I am so much more.',
            'Every step I take is a step toward healing.',
            'I have survived every tough time before this one.',
            'My feelings do not define my worth.',
            'I deserve compassion from myself and others.',
            'There is a good place within me that still believes in hope.',
            'My struggles make me stronger and more empathetic.',
            'I am worthy of love and understanding.',
            'I am learning to be gentle with myself.',
            'It\’s okay to take life one moment at a time.',
            'I deserve happiness, even in difficult situations.',
            'I am proud of the steps I\’m taking toward healing.',
            'I am not a burden\; I am a wonderful person.',
            'My past does not define my future.',
            'Positive change is always possible for me.',
            'I have the power to rewrite my story.',
            'I am stronger than I feel right now.',
            'I am worthy of a life filled with good things.',
            'My future holds brighter days.',
            'I am capable of finding joy again.',
            'I release the pressure to be perfect.',
            'My pain is valid, but it will not last forever.',
            'I choose to focus on the progress I\’ve made.',
            'I honour my strength and perseverance.',
            'Every day, I am healing and growing.',
            'I will get through this moment, one breath at a time.',
            'I choose life, even when it feels hard.',
            'My safety plan helps me stay grounded.',
            'Crisis lines and community support are available to me.',
            'I am not alone in this struggle.',
            'My life experiences have made me resilient.',
            'I am proud of the courage it took to keep going.',
            'I am allowed to heal at my own pace.',
            'I am more than my past pain\; I am a survivor.',
            'I choose to release negative feelings and thoughts about myself.',
            'I do my very best and that\’s enough.',
            'I believe in my ability to get through this difficult period.',
            'My goals are achievable.',
            'I feel low now, but tomorrow is another day.',
            'Where there is life, there is hope.',
            'I experience depression but I can also experience joy.',
            'My life is a gift.',
            'I deserve love and happiness.',
            'This feeling will pass.',
            'I will wake up tomorrow and do the best I can.',
            'I am breathing. I am still here.',
            'I deserve kindness, especially from myself.',
            'There are people who care about me, even if I cant see them right now.',
            'I will keep my body safe until I can get help.',
            'I choose to stay because my life has value and purpose.',
            'I am important and my presence matters in this world.',
            'I am loved, even when I don\'t feel it.',
            'I am not alone in my struggles, and help is available.',
            'I forgive myself for my past mistakes and embrace my future.',
            'I am capable of positive change in my life.'
        ];
        
        game.showFountainPopup(fountainMessages);
    });
    room5.addClickableObject(fountain);

    const exitBtn5 = new ClickableObject('exit_room5', 'Exit', 35, 135, 120, 35);
    exitBtn5.onClick(() => {
        game.loadRoom('map');
    });
    room5.addClickableObject(exitBtn5);

    // ===== OPENING CUTSCENE DIALOGUE =====
    const openingDialogue = new Dialogue('opening_1', 
        [
            'Hello there!',
            'Welcome to Sanctuary. This is a place of comfort and safety, where you can explore and find solace.',
            'My name is Darling, by the way. I\'ll be your guide throughout this experience.',
            'Each room serves its own purpose. Click on the one you want to visit when you\’re ready.',
            'And never forget, you aren\’t alone, for I am here with you!'
        ],
        [
            new DialogueChoice('Explore', 'opening_c1', () => {
                // After cutscene ends, load the map
                hideOpeningSkip();
                game.loadRoom('map');
            })
        ],
        'assets/placeholders/teddy-bear.png', // Portrait for cutscene dialogue
        '???', // Default character name
        ['???', '???', 'Darling', 'Darling', 'Darling'], // Character names per segment
        'assets/ui/dialogue_box1.png' // Dialogue box background image
    );

    // Set callback to show opening dialogue after game starts
    game.dialogueManager.onDialogueEnd = null; // Clear any previous callbacks

    if (skipCutsceneBtn) {
        skipCutsceneBtn.addEventListener('click', () => {
            hideOpeningSkip();
            game.endDialogue();
            game.loadRoom('map');
        });
    }

    const beginGame = () => {
        if (hasStartedGame) {
            return;
        }

        hasStartedGame = true;
        game.stopBGM(300);

        showOpeningSkip();
        game.start('cutscene');
        game.showDialogue(openingDialogue);

        if (startScreen) {
            startScreen.classList.add('is-exiting');
            window.setTimeout(() => {
                startScreen.classList.add('hidden');
            }, 650);
        }

        console.log('Game started with opening cutscene!');
    };

    // Wait on the title screen, then start the existing cutscene flow.
    hideOpeningSkip();

    const tryPlayTitleMusic = () => {
        if (hasStartedGame) {
            return;
        }

        game.playBGM('bgm_title', { fadeIn: 900, loop: true });
    };

    // Some browsers block autoplay until first user interaction.
    tryPlayTitleMusic();
    window.addEventListener('pointerdown', tryPlayTitleMusic, { once: true });
    window.addEventListener('keydown', tryPlayTitleMusic, { once: true });

    if (startGameBtn) {
        startGameBtn.addEventListener('click', beginGame);
    } else {
        beginGame();
    }
});
