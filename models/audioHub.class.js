/**
 * AudioHub - Manages all game audio including music and sound effects.
 * Singleton pattern ensures one centralized audio controller.
 * Sound-trigger methods are defined in audioHub.sounds.js (prototype extension).
 */
class AudioHub {

    static instance = null;

    constructor() {
        if (AudioHub.instance) return AudioHub.instance;
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.isMuted = false;
        this.musicMuted = false;
        this.sfxMuted = false;
        this.musicVolume = 0.2;
        this.sfxVolume = 0.3;
        this.isLoaded = false;
        AudioHub.instance = this;
    }


    /**
     * Gets the singleton instance of AudioHub.
     * @returns {AudioHub}
     */
     static getInstance() {
        if (!AudioHub.instance) AudioHub.instance = new AudioHub();
        return AudioHub.instance;
    }


    /**
     * Loads audio configuration and initializes all sounds.
     * @returns {Promise<void>}
     */
     async loadConfig() {
        try {
            const response = await fetch('assets/audio/audioConfig.json');
            const config = await response.json();
            this.initializeSounds(config);
            this.isLoaded = true;
        } catch (error) {
            console.error('AudioHub: Failed to load audio config:', error);
        }
    }


    /**
     * Initializes Audio objects from config.
     * @param {Object} config - The audio configuration object
     */
     initializeSounds(config) {
        this.initializeMusic(config);
        this.initializeCharacterSounds(config);
        this.initializeEnemySounds(config);
        this.initializeItemSounds(config);
    }


    /**
     * Initializes all music tracks from config.
     * @param {Object} config - The audio configuration object
     */
     initializeMusic(config) {
        this.music.background = this.createAudio(config.game.backgroundMusic, true);
        this.music.menu = this.createAudio(config.game.menuMusic, true);
        this.music.battle = this.createAudio(config.game.battleMusic, true);
        this.music.gameStart = this.createAudio(config.game.gameStart, false);
        this.music.countdown = this.createAudio(config.game.countdown, false);
        this.music.gameOver = this.createAudio(config.game.gameOver, false);
        this.music.youWonMusic = this.createAudio(config.game.youWonMusic, false);
    }


    /**
     * Initializes all character sound effects from config.
     * @param {Object} config - The audio configuration object
     */
     initializeCharacterSounds(config) {
        this.sounds.characterWalk = this.createAudio(config.character.walk, true);
        this.sounds.characterJump = this.createAudio(config.character.jump, false);
        this.sounds.characterHurt = this.createAudio(config.character.hurt, false);
        this.sounds.characterDead = this.createAudio(config.character.dead, false);
        this.sounds.characterScream = this.createAudio(config.character.scream, false);
        this.sounds.characterSnoring = this.createAudio(config.character.snoring, true);
    }


    /**
     * Initializes all enemy sound effects from config.
     * @param {Object} config - The audio configuration object
     */
     initializeEnemySounds(config) {
        this.sounds.chickenDead = this.createAudio(config.chicken.dead, false);
        this.sounds.chickDead = this.createAudio(config.chick.dead, false);
        this.sounds.endbossApproach = this.createAudio(config.endboss.approach, false);
        this.sounds.endbossDead = this.createAudio(config.endboss.dead, false);
        this.sounds.endbossRolling = this.createAudio(config.endboss.rolling, false);
    }


    /**
     * Initializes collectible and throwable sound effects from config.
     * @param {Object} config - The audio configuration object
     */
     initializeItemSounds(config) {
        this.sounds.coinCollect = this.createAudio(config.collectibles.coin, false);
        this.sounds.bottleCollect = this.createAudio(config.collectibles.bottle, false);
        this.sounds.bottleBreak = this.createAudio(config.throwable.bottleBreak, false);
    }


    /**
     * Creates an Audio element with optional loop setting.
     * @param {string} src - Path to the audio file
     * @param {boolean} loop - Whether the audio should loop
     * @returns {HTMLAudioElement}
     */
     createAudio(src, loop = false) {
        const audio = new Audio(src);
        audio.loop = loop;
        audio.preload = 'auto';
        return audio;
    }


    // ==================== CORE AUDIO METHODS ====================
    /**
     * Generic music player with tracking. Stops previous track first.
     * @param {HTMLAudioElement} music - The music audio element
     * @param {number} volume - Target volume
     */
     playMusic(music, volume) {
        if (this.currentMusic && this.currentMusic !== music) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
        this.currentMusic = music;
        music.volume = volume;
        music.currentTime = 0;
        music.play();
    }


    /**
     * Stops the currently tracked music track.
     */
     stopCurrentMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }


    /**
     * Plays an audio element from its current position (used for both SFX and music).
     * @param {HTMLAudioElement} sound - The sound to play
     * @param {number} volume - Volume level (0-1)
     */
     play(sound, volume = this.sfxVolume) {
        if (!sound) return;
        sound.volume = volume;
        if (sound.paused) sound.play().catch(e => console.warn('AudioHub:', e));
    }


    /**
     * Plays a sound effect, respecting both global and SFX mute.
     * @param {HTMLAudioElement} sound - The sound to play
     * @param {number} volume - Volume level (0-1)
     */
     playSfx(sound, volume = this.sfxVolume) {
        if (this.isMuted || this.sfxMuted) return;
        this.play(sound, volume);
    }


    /**
     * Stops a sound and resets it to the beginning.
     * @param {HTMLAudioElement} sound - The sound to stop
     */
     stop(sound) {
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
    }


    /**
     * Stops all currently playing sound effects (not music).
     */
     stopAllSounds() {
        Object.values(this.sounds).forEach(sound => this.stop(sound));
    }


    /**
     * Stops everything including music.
     */
     stopAll() {
        this.stopAllSounds();
        this.stopCurrentMusic();
    }


    // ==================== VOLUME & MUTE CONTROLS ====================
    /**
     * Toggles mute state for all audio.
     * @returns {boolean} Current mute state
     */
     toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.musicMuted = true;
            this.sfxMuted = true;
            this.stopAll();
        } else {
            this.musicMuted = false;
            this.sfxMuted = false;
        }
        return this.isMuted;
    }


    /**
     * Toggles SFX mute state.
     * @returns {boolean} Current SFX mute state
     */
     toggleSfxMute() {
        this.sfxMuted = !this.sfxMuted;
        if (this.sfxMuted) this.stopAllSounds();
        return this.sfxMuted;
    }


    /**
     * Sets master volume for sound effects.
     * @param {number} volume - Volume level (0-1)
     */
     setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }


    /**
     * Sets master volume for music. Updates the live track if one is playing.
     * @param {number} volume - Volume level (0-1)
     */
     setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) this.currentMusic.volume = this.musicVolume;
    }


    /**
     * Syncs the current music track's muted state and volume with the hub's settings.
     */
     syncAudioState() {
        if (!this.currentMusic) return;
        this.currentMusic.muted = this.isMuted || this.musicMuted;
        this.currentMusic.volume = this.musicVolume;
    }


    /**
     * Resumes the currently tracked music if mute flags allow.
     */
     resumeMusic() {
        if (this.isMuted || this.musicMuted) return;
        if (!this.currentMusic) return;
        this.currentMusic.muted = false;
        this.currentMusic.volume = this.musicVolume;
        if (this.currentMusic.paused) this.currentMusic.play().catch(() => {});
    }
}
