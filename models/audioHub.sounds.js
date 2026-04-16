/**
 * @fileoverview AudioHub sound-trigger methods. Extends the AudioHub prototype.
 * Trivial SFX/stop wrappers are generated from data tables; methods with custom
 * logic (music transitions, mute checks, special playback rates) are defined
 * explicitly. Loaded after audioHub.class.js.
 */


/**
 * Simple SFX wrappers: methodName -> [soundKey, volumeFactor, absolute?].
 * `factor` multiplies sfxVolume by default; if `absolute` is true, factor is the literal volume.
 */
const AUDIO_SFX_MAP = {
    playJumpSound:           ['characterJump',  1.0],
    playHurtSound:           ['characterHurt',  1.0],
    playChickenDeathSound:   ['chickenDead',    0.8, true],
    playChickDeathSound:     ['chickDead',      0.8, true],
    playEndbossDeathSound:   ['endbossDead',    1.0],
    playEndbossRollingSound: ['endbossRolling', 2.0],
    playCoinSound:           ['coinCollect',    0.7],
    playBottleCollectSound:  ['bottleCollect',  0.7],
    playBottleBreakSound:    ['bottleBreak',    1.0],
};


/** Simple stop wrappers: methodName -> soundKey. */
const AUDIO_STOP_MAP = {
    stopWalkSound:           'characterWalk',
    stopSnoringSound:        'characterSnoring',
    stopEndbossRollingSound: 'endbossRolling',
};


Object.entries(AUDIO_SFX_MAP).forEach(([method, [key, factor, absolute]]) => {
    AudioHub.prototype[method] = function() {
        this.playSfx(this.sounds[key], absolute ? factor : this.sfxVolume * factor);
    };
});


Object.entries(AUDIO_STOP_MAP).forEach(([method, key]) => {
    AudioHub.prototype[method] = function() { this.stop(this.sounds[key]); };
});


// ==================== METHODS WITH CUSTOM LOGIC ====================
Object.assign(AudioHub.prototype, {

    /**
     * Internal helper: starts a looped music track if not already current.
     * @param {HTMLAudioElement} music
     */
     playLoopedMusic(music) {
        if (!music) return;
        if (this.currentMusic && this.currentMusic !== music) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
        this.currentMusic = music;
        if (this.isMuted || this.musicMuted) return;
        music.loop = true;
        music.volume = this.musicVolume;
        music.muted = this.isMuted || this.musicMuted;
        if (music.paused) music.play().catch(event => console.warn(event));
    },


    /** Plays background music for gameplay. */
    playBackgroundMusic() { this.playLoopedMusic(this.music.background); },


    /** Plays the menu loop (Desert Winds) and tracks it. */
    playMenuMusic() { this.playLoopedMusic(this.music.menu); },


    /** Plays game start sound. */
    playGameStartSound() { this.play(this.music.gameStart, this.sfxVolume); },


    /** Plays the 3-2-1 fight countdown sound. */
    playCountdownSound() { this.play(this.music.countdown, Math.min(this.sfxVolume, 1)); },


    /** Plays the game over jingle, respecting SFX mute. */
     playLostSound() {
        if (this.isMuted || this.sfxMuted || !this.music.gameOver) return;
        this.playMusic(this.music.gameOver, this.sfxVolume);
    },


    /** Plays the win jingle, respecting SFX mute. */
     playWinSound() {
        if (this.isMuted || this.sfxMuted || !this.music.youWonMusic) return;
        this.playMusic(this.music.youWonMusic, this.sfxVolume);
    },


    /** Switches background music to battle music (a-calm-hellfire). */
     switchToBattleMusic() {
        if (this.currentMusic === this.music.battle) return;
        if (this.isMuted || this.musicMuted) {
            this.currentMusic = this.music.battle;
            return;
        }
        this.playMusic(this.music.battle, this.musicVolume);
    },


    /** Plays walking sound (loops while walking). */
     playWalkSound() {
        if (!this.sounds.characterWalk.paused) return;
        this.playSfx(this.sounds.characterWalk, this.sfxVolume * 0.6);
    },


    /** Plays death sound (stops everything else first). */
     playDeathSound() {
        this.stopAllSounds();
        this.playSfx(this.sounds.characterScream, this.sfxVolume);
    },


    /** Plays snoring sound during long idle (loops). Updates volume live. */
     playSnoringSound() {
        const snore = this.sounds.characterSnoring;
        snore.volume = this.sfxVolume * 0.4;
        if (!snore.paused) return;
        this.playSfx(snore, this.sfxVolume * 0.4);
    },


    /** Plays chicken cackle as a monster roar (lowered pitch). */
     playEndbossCackleSound() {
        const sound = this.sounds.chickenDead;
        if (this.isMuted || this.sfxMuted || !sound) return;
        sound.volume = 1.0;
        sound.currentTime = 0;
        sound.playbackRate = 0.6;
        sound.play().catch(e => console.warn('AudioHub: Cackle play blocked:', e));
    },


    /** Plays endboss approach/alert sound and switches to battle music. */
     playEndbossApproachSound() {
        this.playSfx(this.sounds.endbossApproach, this.sfxVolume);
        this.switchToBattleMusic();
    },
});
