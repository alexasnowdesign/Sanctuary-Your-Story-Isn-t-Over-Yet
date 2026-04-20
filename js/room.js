/**
 * Room System
 * Manages individual rooms/locations with clickable areas
 */

class Room {
    constructor(id, name, backgroundImage) {
        this.id = id;
        this.name = name;
        this.backgroundImage = null; // Will be the image element when loaded
        this.backgroundPath = backgroundImage;
        this.backgroundScale = 1.0; // 1.0 = full size; <1 = smaller
        this.clickableObjects = [];
        this.characters = [];
        this.inventory = [];
        this.visited = false;
        this.loaded = false;
        this.backgroundMusicId = null; // Background music for this room
        this.musicOptions = {}; // Options for playing music (fadeIn, loop, etc)
    }

    /**
     * Load the room's background image
     */
    loadBackground() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.backgroundImage = img;
                this.loaded = true;
                resolve(img);
            };
            img.onerror = () => {
                // If image fails to load, create a placeholder
                console.warn(`Background image not found: ${this.backgroundPath}`);
                this.backgroundImage = null;
                this.loaded = true;
                resolve(null);
            };
            img.src = this.backgroundPath;
        });
    }

    /**
     * Add a clickable object to the room
     */
    addClickableObject(obj) {
        this.clickableObjects.push(obj);
    }

    /**
     * Add a character to the room
     */
    addCharacter(character) {
        this.characters.push(character);
    }

    /**
     * Set background music for this room
     */
    setBackgroundMusic(audioId, options = {}) {
        this.backgroundMusicId = audioId;
        this.backgroundMusicPlaylist = null;
        this.musicOptions = options;
    }

    setBackgroundMusicPlaylist(audioIds, options = {}) {
        this.backgroundMusicPlaylist = Array.isArray(audioIds) ? audioIds : [audioIds];
        this.backgroundMusicId = null;
        this.musicOptions = options;
    }

    /**
     * Get a clickable object at mouse coordinates
     */
    getObjectAtPoint(x, y) {
        for (let i = this.clickableObjects.length - 1; i >= 0; i--) {
            const obj = this.clickableObjects[i];
            if (obj.isPointInside(x, y)) {
                return obj;
            }
        }
        return null;
    }

    /**
     * Draw the room on canvas
     */
    draw(ctx, canvasWidth, canvasHeight) {
        // Draw background
        if (this.backgroundImage) {
            const img = this.backgroundImage;
            const imgRatio = img.width / img.height;
            const canvasRatio = canvasWidth / canvasHeight;

            let drawWidth, drawHeight, drawX, drawY;
            if (imgRatio > canvasRatio) {
                // Image is wider than canvas: fit height
                drawHeight = canvasHeight;
                drawWidth = drawHeight * imgRatio;
            } else {
                // Image is taller or same ratio: fit width
                drawWidth = canvasWidth;
                drawHeight = drawWidth / imgRatio;
            }

            // Apply room-specific scale
            drawWidth *= this.backgroundScale;
            drawHeight *= this.backgroundScale;

            drawX = (canvasWidth - drawWidth) / 2;
            drawY = (canvasHeight - drawHeight) / 2;

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        } else {
            // Fallback: draw solid color background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, canvasWidth / 2, canvasHeight / 2);
        }

        // Draw clickable objects
        for (let obj of this.clickableObjects) {
            obj.draw(ctx);
        }

        // Draw characters
        for (let character of this.characters) {
            if (character.draw) {
                character.draw(ctx);
            }
        }
    }
}

/**
 * Clickable Object - represents interactive elements in a room
 */
class ClickableObject {
    constructor(id, name, x, y, width, height) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = null;
        this.imagePath = null;
        this.canInteract = true;
        this.onClickCallback = null;
        this.hovered = false;
        this.scale = 1.0; // 1.0 = full size; <1 = smaller
    }

    /**
     * Load object's image
     */
    loadImage(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                this.imagePath = imagePath;
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Object image not found: ${imagePath}`);
                this.image = null;
                resolve(null);
            };
            img.src = imagePath;
        });
    }

    /**
     * Check if point is inside this object
     */
    isPointInside(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }

    /**
     * Set click callback
     */
    onClick(callback) {
        this.onClickCallback = callback;
    }

    /**
     * Handle click event
     */
    click() {
        if (this.canInteract && this.onClickCallback) {
            this.onClickCallback(this);
        }
    }

    /**
     * Draw the object
     */
    draw(ctx) {
        if (this.image) {
            const imgRatio = this.image.width / this.image.height;
            const objRatio = this.width / this.height;

            let drawWidth, drawHeight, drawX, drawY;
            if (imgRatio > objRatio) {
                // Image is wider: fit height
                drawHeight = this.height;
                drawWidth = drawHeight * imgRatio;
            } else {
                // Image is taller: fit width
                drawWidth = this.width;
                drawHeight = drawWidth / imgRatio;
            }

            // Apply scale
            drawWidth *= this.scale;
            drawHeight *= this.scale;

            drawX = this.x + (this.width - drawWidth) / 2;
            drawY = this.y + (this.height - drawHeight) / 2;

            ctx.drawImage(this.image, drawX, drawY, drawWidth, drawHeight);
            
            // Draw hover overlay for images
            if (this.hovered) {
                ctx.fillStyle = 'rgba(255, 215, 0, 0.25)'; // Gold overlay
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        } else {
            // Draw placeholder rectangle only when hovered
            if (this.hovered) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0)';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                
                // Draw border
                ctx.strokeStyle = 'rgba(255, 0, 0, 0)';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
    }
}

/**
 * Character - represents NPCs in a room
 */
class Character {
    constructor(id, name, x, y) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.image = null;
        this.imagePath = null;
        this.width = 100;
        this.height = 150;
    }

    /**
     * Load character image
     */
    loadImage(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                this.imagePath = imagePath;
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Character image not found: ${imagePath}`);
                this.image = null;
                resolve(null);
            };
            img.src = imagePath;
        });
    }

    /**
     * Draw the character
     */
    draw(ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Draw placeholder
            ctx.fillStyle = 'rgba(100, 150, 200, 0.5)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
