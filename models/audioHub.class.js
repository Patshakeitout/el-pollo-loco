/**
 * AudioHub - Manages all game audio including music and sound effects.
 * Singleton pattern ensures one centralized audio controller.
 */
 class AudioHub {
    
    static instance = null;

    constructor() {
        if (AudioHub.instance) {
            return AudioHub.instance;
        }

        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.isMuted = false;
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
        if (!AudioHub.instance) {
            AudioHub.instance = new AudioHub();
        }
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


    // ==================== MUSIC CONTROLS ====================
    /**
     * Plays background music for gameplay.
     */
     playBackgroundMusic() {
        const bgMusic = this.music.background;
        if (!bgMusic) return;

        // 1. Stop the Menu Music (or whatever was playing before)
        if (this.currentMusic && this.currentMusic !== bgMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        // 2. Set new Current
        this.currentMusic = bgMusic;

        // 3. Play if not muted
        if (this.isMuted) return;
        
        bgMusic.loop = true;
        this.play(bgMusic, this.musicVolume);
    }


    /**
       * Plays the menu loop (Desert Winds) and tracks it.
       */
    playMenuMusic() {
        const menuMusic = this.music.menu;
        if (!menuMusic) return;

        if (this.currentMusic && this.currentMusic !== menuMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        this.currentMusic = menuMusic;

        if (this.isMuted) return;

        menuMusic.loop = true;
        this.play(menuMusic, this.musicVolume);
    }


    /**
     * Plays game start sound.
     */
     playGameStartSound() {
        this.play(this.music.gameStart, this.sfxVolume);
    }


    /**
     * Plays the 3-2-1 fight countdown sound.
     */
     playCountdownSound() {
        this.play(this.music.countdown, this.sfxVolume * 2.0);
    }


    /**
     * Plays the game over sound.
     */
     playLostSound() {
        if (this.music.gameOver) {
            this.play(this.music.gameOver, 0.5);
        }
    }


    /**
     * Plays the game won sound.
     */
     playWinSound() {
        if (this.music.youWonMusic) {
            this.playMusic(this.music.youWonMusic, 0.5);
        }
    }


    /**
     * Generic music player with fade and tracking.
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
     * Stops current background music.
     */
     stopCurrentMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }


    // ==================== CHARACTER SOUNDS ====================
    /**
     * Plays walking sound (loops while walking).
     */
     playWalkSound() {
        if (!this.sounds.characterWalk.paused) return;
        this.play(this.sounds.characterWalk, this.sfxVolume * 0.6);
    }


    /**
     * Stops walking sound.
     */
     stopWalkSound() {
        this.stop(this.sounds.characterWalk);
    }


    /**
     * Plays jump sound.
     */
     playJumpSound() {
        this.play(this.sounds.characterJump, this.sfxVolume);
    }


    /**
     * Plays hurt sound when character takes damage.
     */
     playHurtSound() {
        this.play(this.sounds.characterHurt, this.sfxVolume);
    }


    /**
     * Plays death sound (extreme scream).
     */
     playDeathSound() {
        this.stopAllSounds();
        this.play(this.sounds.characterScream, this.sfxVolume);
    }


    /**
     * Plays snoring sound during long idle (loops).
     */
     playSnoringSound() {
        if (!this.sounds.characterSnoring.paused) return;
        this.play(this.sounds.characterSnoring, this.sfxVolume * 0.4);
    }


    /**
     * Stops snoring sound.
     */
     stopSnoringSound() {
        this.stop(this.sounds.characterSnoring);
    }


    // ==================== ENEMY SOUNDS ====================
    /**
     * Plays chicken death sound (randomizes between two variants).
     */
     playChickenDeathSound() {
        const sound = this.sounds.chickenDead;
        this.play(sound, 0.8);
    }


    /**
     * Plays chick death sound (randomizes between two variants).
     */
     playChickDeathSound() {
        const sound = this.sounds.chickDead;
        this.play(sound, 0.8);
    }

    /**
     * Plays chicken cackle as a monster roar (lowered pitch).
     */
     playEndbossCackleSound() {
        const sound = this.sounds.chickenDead;
        if (this.isMuted || !sound) return;

        sound.volume = 1.0;
        sound.currentTime = 0;
        sound.playbackRate = 0.6; // Lower pitch/frequency for monster effect
        sound.play().catch(e => console.warn('AudioHub: Cackle play blocked:', e));
    }


    /**
     * Plays endboss approach/alert sound and switches to battle music.
     */
     playEndbossApproachSound() {
        this.play(this.sounds.endbossApproach, this.sfxVolume);
        this.switchToBattleMusic();
    }


    /**
     * Plays endboss death sound (chicken noise).
     */
     playEndbossDeathSound() {
        this.play(this.sounds.endbossDead, this.sfxVolume);
    }


    /**
     * Plays endboss rolling sound (loud attack sound).
     */
     playEndbossRollingSound() {
        this.play(this.sounds.endbossRolling, this.sfxVolume * 2.0);
    }

    /**
     * Stops endboss rolling sound.
     */
     stopEndbossRollingSound() {
        this.stop(this.sounds.endbossRolling);
    }


    /**
     * Switches background music to battle music (a-calm-hellfire).
     */
     switchToBattleMusic() {
        if (this.currentMusic === this.music.battle) return;
        this.playMusic(this.music.battle, this.musicVolume);
    }


    // ==================== COLLECTIBLE SOUNDS ====================
    /**
     * Plays coin collection sound.
     */
     playCoinSound() {
        this.play(this.sounds.coinCollect, this.sfxVolume * 0.7);
    }


    /**
     * Plays bottle collection sound.
     */
     playBottleCollectSound() {
        this.play(this.sounds.bottleCollect, this.sfxVolume * 0.7);
    }


    // ==================== THROWABLE SOUNDS ====================
    /**
     * Plays bottle break/splash sound.
     */
     playBottleBreakSound() {
        this.play(this.sounds.bottleBreak, this.sfxVolume);
    }


    // ==================== CORE AUDIO METHODS ====================
    /**
     * Plays a sound effect from the beginning.
     * @param {HTMLAudioElement} sound - The sound to play
     * @param {number} volume - Volume level (0-1)
     */
     play(sound, volume = this.sfxVolume) {
        if (this.isMuted || !sound) return;

        sound.volume = volume;
        sound.currentTime = 0;
        sound.play().catch(e => console.warn('AudioHub: Sound play blocked:', e));
    }


    /**
     * Stops a sound and resets to beginning.
     * @param {HTMLAudioElement} sound - The sound to stop
     */
     stop(sound) {
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
    }


    /**
     * Stops all currently playing sounds (not music).
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
        if (this.isMuted) this.stopAll();
        return this.isMuted;
    }


    /**
     * Sets master volume for sound effects.
     * @param {number} volume - Volume level (0-1)
     */
     setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }


    /**
     * Sets master volume for music.
     * @param {number} volume - Volume level (0-1)
     */
     setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume;
        }
    }

}