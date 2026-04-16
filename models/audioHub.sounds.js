/**
 * @fileoverview AudioHub sound-trigger methods. Extends the AudioHub prototype
 * with named playback methods organized by source (music, character, enemy, items).
 * Loaded after audioHub.class.js.
 */


// ==================== MUSIC ====================
/**
 * Internal helper: starts a looped music track if not already current.
 * @param {HTMLAudioElement} music
 */
 AudioHub.prototype.playLoopedMusic = function(music) {
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
};


/** Plays background music for gameplay. */
AudioHub.prototype.playBackgroundMusic = function() {
    this.playLoopedMusic(this.music.background);
};


/** Plays the menu loop (Desert Winds) and tracks it. */
AudioHub.prototype.playMenuMusic = function() {
    this.playLoopedMusic(this.music.menu);
};


/** Plays game start sound. */
AudioHub.prototype.playGameStartSound = function() {
    this.play(this.music.gameStart, this.sfxVolume);
};


/** Plays the 3-2-1 fight countdown sound. */
AudioHub.prototype.playCountdownSound = function() {
    this.play(this.music.countdown, Math.min(this.sfxVolume, 1));
};


/** Plays the game over sound. */
AudioHub.prototype.playLostSound = function() {
    if (this.isMuted || this.sfxMuted || !this.music.gameOver) return;
    this.playMusic(this.music.gameOver, this.sfxVolume);
};


/** Plays the game won sound. */
AudioHub.prototype.playWinSound = function() {
    if (this.isMuted || this.sfxMuted || !this.music.youWonMusic) return;
    this.playMusic(this.music.youWonMusic, this.sfxVolume);
};


/** Switches background music to battle music (a-calm-hellfire). */
AudioHub.prototype.switchToBattleMusic = function() {
    if (this.currentMusic === this.music.battle) return;
    if (this.isMuted || this.musicMuted) {
        this.currentMusic = this.music.battle;
        return;
    }
    this.playMusic(this.music.battle, this.musicVolume);
};


// ==================== CHARACTER SOUNDS ====================
/** Plays walking sound (loops while walking). */
AudioHub.prototype.playWalkSound = function() {
    if (!this.sounds.characterWalk.paused) return;
    this.playSfx(this.sounds.characterWalk, this.sfxVolume * 0.6);
};


/** Stops walking sound. */
AudioHub.prototype.stopWalkSound = function() {
    this.stop(this.sounds.characterWalk);
};


/** Plays jump sound. */
AudioHub.prototype.playJumpSound = function() {
    this.playSfx(this.sounds.characterJump, this.sfxVolume);
};


/** Plays hurt sound when character takes damage. */
AudioHub.prototype.playHurtSound = function() {
    this.playSfx(this.sounds.characterHurt, this.sfxVolume);
};


/** Plays death sound (extreme scream). */
AudioHub.prototype.playDeathSound = function() {
    this.stopAllSounds();
    this.playSfx(this.sounds.characterScream, this.sfxVolume);
};


/** Plays snoring sound during long idle (loops). Updates volume live. */
AudioHub.prototype.playSnoringSound = function() {
    const snore = this.sounds.characterSnoring;
    snore.volume = this.sfxVolume * 0.4;
    if (!snore.paused) return;
    this.playSfx(snore, this.sfxVolume * 0.4);
};


/** Stops snoring sound. */
AudioHub.prototype.stopSnoringSound = function() {
    this.stop(this.sounds.characterSnoring);
};


// ==================== ENEMY SOUNDS ====================
/** Plays chicken death sound. */
AudioHub.prototype.playChickenDeathSound = function() {
    this.playSfx(this.sounds.chickenDead, 0.8);
};


/** Plays chick death sound. */
AudioHub.prototype.playChickDeathSound = function() {
    this.playSfx(this.sounds.chickDead, 0.8);
};


/** Plays chicken cackle as a monster roar (lowered pitch). */
AudioHub.prototype.playEndbossCackleSound = function() {
    const sound = this.sounds.chickenDead;
    if (this.isMuted || this.sfxMuted || !sound) return;
    sound.volume = 1.0;
    sound.currentTime = 0;
    sound.playbackRate = 0.6;
    sound.play().catch(e => console.warn('AudioHub: Cackle play blocked:', e));
};


/** Plays endboss approach/alert sound and switches to battle music. */
AudioHub.prototype.playEndbossApproachSound = function() {
    this.playSfx(this.sounds.endbossApproach, this.sfxVolume);
    this.switchToBattleMusic();
};


/** Plays endboss death sound (chicken noise). */
AudioHub.prototype.playEndbossDeathSound = function() {
    this.playSfx(this.sounds.endbossDead, this.sfxVolume);
};


/** Plays endboss rolling sound (loud attack sound). */
AudioHub.prototype.playEndbossRollingSound = function() {
    this.playSfx(this.sounds.endbossRolling, this.sfxVolume * 2.0);
};


/** Stops endboss rolling sound. */
AudioHub.prototype.stopEndbossRollingSound = function() {
    this.stop(this.sounds.endbossRolling);
};


// ==================== COLLECTIBLE & THROWABLE SOUNDS ====================
/** Plays coin collection sound. */
AudioHub.prototype.playCoinSound = function() {
    this.playSfx(this.sounds.coinCollect, this.sfxVolume * 0.7);
};


/** Plays bottle collection sound. */
AudioHub.prototype.playBottleCollectSound = function() {
    this.playSfx(this.sounds.bottleCollect, this.sfxVolume * 0.7);
};


/** Plays bottle break/splash sound. */
AudioHub.prototype.playBottleBreakSound = function() {
    this.playSfx(this.sounds.bottleBreak, this.sfxVolume);
};
