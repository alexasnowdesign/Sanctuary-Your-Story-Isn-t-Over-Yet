/**
 * Audio/Music Manager
 * Handles background music, sound effects, and audio playback
 */

class AudioManager {
    constructor() {
        this.bgm = new Audio(); // Background music
        this.currentBgmId = null;
        this.bgmVolume = 0.7;
        this.masterVolume = 1.0;
        
        this.sfx = []; // Sound effects pool
        this.sfxVolume = 0.8;
        
        this.audioMap = {}; // Map of audio IDs to file paths
        this.isPlaying = false;

        // Playlist state
        this.playlist = [];
        this.playlistIndex = 0;
        this._playlistEndHandler = null;
        
        // Setup background music
        this.bgm.loop = true;
        this.bgm.volume = this.bgmVolume * this.masterVolume;
    }

    /**
     * Register an audio file with an ID for easy reference
     * @param {string} id - Unique identifier for the audio
     * @param {string} filePath - Path to the audio file
     */
    registerAudio(id, filePath) {
        this.audioMap[id] = filePath;
    }

    /**
     * Play background music
     * @param {string} audioId - ID of the audio to play
     * @param {Object} options - Optional settings {fadeIn: duration, loop: boolean}
     */
    playBGM(audioId, options = {}) {
        const fadeIn = options.fadeIn || 0;
        const loop = options.loop !== false; // Default to true

        // Stop current music if different
        if (this.currentBgmId !== audioId) {
            this.stopBGM(options.fadeOut || 0);
        }

        const filePath = this.audioMap[audioId];
        if (!filePath) {
            console.warn(`Audio not registered: ${audioId}`);
            return;
        }

        if (this.bgm.src !== filePath) {
            this.bgm.src = filePath;
        }

        this.bgm.loop = loop;
        this.bgm.volume = 0;
        const playPromise = this.bgm.play();

        const onPlaySuccess = () => {
            this.currentBgmId = audioId;
            this.isPlaying = true;

            // Fade in if specified
            if (fadeIn > 0) {
                this.fadeBGMIn(fadeIn);
            } else {
                this.bgm.volume = this.bgmVolume * this.masterVolume;
            }

            console.log(`Playing BGM: ${audioId}`);
        };

        const onPlayError = (error) => {
            this.currentBgmId = null;
            this.isPlaying = false;
            console.error(`Failed to play BGM ${audioId}:`, error);
        };

        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(onPlaySuccess).catch(onPlayError);
        } else {
            onPlaySuccess();
        }
    }

    /**
     * Play a playlist of BGM tracks, cycling through them endlessly
     * @param {string[]} audioIds - Ordered array of audio IDs to alternate between
     * @param {Object} options - Optional settings {fadeIn: duration for first track}
     */
    playBGMPlaylist(audioIds, options = {}) {
        if (!Array.isArray(audioIds) || audioIds.length === 0) return;
        this.stopBGM();
        this.playlist = audioIds;
        this.playlistIndex = 0;
        this._playNextInPlaylist(options);
    }

    /**
     * Internal: play the current playlist track then queue the next
     */
    _playNextInPlaylist(options = {}) {
        if (this.playlist.length === 0) return;

        const audioId = this.playlist[this.playlistIndex];
        const fadeIn = this.playlistIndex === 0 ? (options.fadeIn || 0) : 0;

        const filePath = this.audioMap[audioId];
        if (!filePath) {
            console.warn(`Audio not registered: ${audioId}`);
            return;
        }

        this.bgm.src = filePath;
        this.bgm.loop = false;
        this.bgm.volume = 0;

        const playPromise = this.bgm.play();

        const onPlaySuccess = () => {
            this.currentBgmId = audioId;
            this.isPlaying = true;

            if (fadeIn > 0) {
                this.fadeBGMIn(fadeIn);
            } else {
                this.bgm.volume = this.bgmVolume * this.masterVolume;
            }

            // Queue the next track when this one ends
            this._playlistEndHandler = () => {
                this._playlistEndHandler = null;
                this.playlistIndex = (this.playlistIndex + 1) % this.playlist.length;
                this._playNextInPlaylist();
            };
            this.bgm.addEventListener('ended', this._playlistEndHandler, { once: true });

            console.log(`Playing BGM playlist [${this.playlistIndex}]: ${audioId}`);
        };

        const onPlayError = (error) => {
            this.currentBgmId = null;
            this.isPlaying = false;
            console.error(`Failed to play BGM playlist track ${audioId}:`, error);
        };

        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(onPlaySuccess).catch(onPlayError);
        } else {
            onPlaySuccess();
        }
    }

    /**
     * Stop background music
     * @param {number} fadeOut - Fade out duration in milliseconds (0 for immediate)
     */
    stopBGM(fadeOut = 0) {
        // Clear playlist state
        if (this._playlistEndHandler) {
            this.bgm.removeEventListener('ended', this._playlistEndHandler);
            this._playlistEndHandler = null;
        }
        this.playlist = [];
        this.playlistIndex = 0;

        if (fadeOut > 0) {
            this.fadeBGMOut(fadeOut);
        } else {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.isPlaying = false;
        }
        this.currentBgmId = null;
    }

    /**
     * Pause background music
     */
    pauseBGM() {
        this.bgm.pause();
        this.isPlaying = false;
    }

    /**
     * Resume background music
     */
    resumeBGM() {
        if (this.currentBgmId) {
            this.bgm.play().catch(error => {
                console.error('Failed to resume BGM:', error);
            });
            this.isPlaying = true;
        }
    }

    /**
     * Fade in background music
     * @param {number} duration - Duration in milliseconds
     */
    fadeBGMIn(duration) {
        const startVolume = this.bgm.volume;
        const targetVolume = this.bgmVolume * this.masterVolume;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            this.bgm.volume = startVolume + (targetVolume - startVolume) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * Fade out background music
     * @param {number} duration - Duration in milliseconds
     */
    fadeBGMOut(duration) {
        const startVolume = this.bgm.volume;
        const targetVolume = 0;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            this.bgm.volume = startVolume + (targetVolume - startVolume) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.bgm.pause();
                this.bgm.currentTime = 0;
                this.isPlaying = false;
            }
        };

        animate();
    }

    /**
     * Play a sound effect
     * @param {string} audioId - ID of the audio to play
     * @param {Object} options - Optional settings {volume: 0-1, loop: boolean}
     */
    playSFX(audioId, options = {}) {
        const filePath = this.audioMap[audioId];
        if (!filePath) {
            console.warn(`Audio not registered: ${audioId}`);
            return;
        }

        const volume = options.volume !== undefined ? options.volume : this.sfxVolume;
        const loop = options.loop || false;

        try {
            const sfxAudio = new Audio(filePath);
            sfxAudio.volume = volume * this.masterVolume;
            sfxAudio.loop = loop;
            sfxAudio.play().catch(error => {
                console.error(`Failed to play SFX ${audioId}:`, error);
            });

            // Clean up finished audio
            sfxAudio.addEventListener('ended', () => {
                const index = this.sfx.indexOf(sfxAudio);
                if (index > -1) {
                    this.sfx.splice(index, 1);
                }
            });

            this.sfx.push(sfxAudio);
            console.log(`Playing SFX: ${audioId}`);
        } catch (error) {
            console.error(`Error creating SFX for ${audioId}:`, error);
        }
    }

    /**
     * Stop all sound effects
     */
    stopAllSFX() {
        for (let audio of this.sfx) {
            audio.pause();
            audio.currentTime = 0;
        }
        this.sfx = [];
    }

    /**
     * Set background music volume
     * @param {number} volume - Volume level (0-1)
     */
    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        this.bgm.volume = this.bgmVolume * this.masterVolume;
    }

    /**
     * Set sound effects volume
     * @param {number} volume - Volume level (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        for (let audio of this.sfx) {
            audio.volume = this.sfxVolume * this.masterVolume;
        }
    }

    /**
     * Set master volume for all audio
     * @param {number} volume - Volume level (0-1)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.bgm.volume = this.bgmVolume * this.masterVolume;
        
        for (let audio of this.sfx) {
            audio.volume = this.sfxVolume * this.masterVolume;
        }
    }

    /**
     * Mute all audio
     */
    mute() {
        this.masterVolume = 0;
        this.bgm.volume = 0;
        for (let audio of this.sfx) {
            audio.volume = 0;
        }
    }

    /**
     * Unmute audio
     */
    unmute() {
        this.setMasterVolume(1.0);
    }

    /**
     * Check if background music is currently playing
     */
    isBGMPlaying() {
        return this.isPlaying && this.currentBgmId !== null;
    }

    /**
     * Get current background music ID
     */
    getCurrentBGM() {
        return this.currentBgmId;
    }

    /**
     * Preload an audio file for faster playback
     * @param {string} audioId - ID of the audio
     */
    preloadAudio(audioId) {
        const filePath = this.audioMap[audioId];
        if (!filePath) {
            console.warn(`Audio not registered: ${audioId}`);
            return;
        }

        const audio = new Audio();
        audio.src = filePath;
        audio.load();
    }

    /**
     * Preload multiple audio files
     * @param {string[]} audioIds - Array of audio IDs to preload
     */
    preloadAudios(audioIds) {
        for (let id of audioIds) {
            this.preloadAudio(id);
        }
    }
}
