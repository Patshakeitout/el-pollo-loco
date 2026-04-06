/**
 * Represents the playable character (Pepe) in the game.
 * Handles movement, animation states, camera tracking, and input processing.
 * @extends MovableObject
 */
 class Character extends MovableObject {
    speed = 5;
    currentImage = 0;
    hurtTime = 0;
    hurtDuration = 500;
    deadAnimationPlayed = false;
    deadAnimationStarted = false;
    deadAnimationFinished = false;
    
    IMAGES_WALKING = [
        'assets/images/2_character_pepe/2_walk/W-21.png',
        'assets/images/2_character_pepe/2_walk/W-22.png',
        'assets/images/2_character_pepe/2_walk/W-23.png',
        'assets/images/2_character_pepe/2_walk/W-24.png',
        'assets/images/2_character_pepe/2_walk/W-25.png',
        'assets/images/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'assets/images/2_character_pepe/3_jump/J-31.png',
        'assets/images/2_character_pepe/3_jump/J-32.png',
        'assets/images/2_character_pepe/3_jump/J-33.png',
        'assets/images/2_character_pepe/3_jump/J-34.png',
        'assets/images/2_character_pepe/3_jump/J-35.png',
        'assets/images/2_character_pepe/3_jump/J-36.png',
        'assets/images/2_character_pepe/3_jump/J-37.png',
        'assets/images/2_character_pepe/3_jump/J-38.png',
        'assets/images/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [
        'assets/images/2_character_pepe/1_idle/idle/I-1.png',
        'assets/images/2_character_pepe/1_idle/idle/I-2.png',
        'assets/images/2_character_pepe/1_idle/idle/I-3.png',
        'assets/images/2_character_pepe/1_idle/idle/I-4.png',
        'assets/images/2_character_pepe/1_idle/idle/I-5.png',
        'assets/images/2_character_pepe/1_idle/idle/I-6.png',
        'assets/images/2_character_pepe/1_idle/idle/I-7.png',
        'assets/images/2_character_pepe/1_idle/idle/I-8.png',
        'assets/images/2_character_pepe/1_idle/idle/I-9.png',
        'assets/images/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'assets/images/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_HURT = [
        'assets/images/2_character_pepe/4_hurt/H-41.png',
        'assets/images/2_character_pepe/4_hurt/H-42.png',
        'assets/images/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'assets/images/2_character_pepe/5_dead/D-51.png',
        'assets/images/2_character_pepe/5_dead/D-52.png',
        'assets/images/2_character_pepe/5_dead/D-53.png',
        'assets/images/2_character_pepe/5_dead/D-54.png',
        'assets/images/2_character_pepe/5_dead/D-55.png',
        'assets/images/2_character_pepe/5_dead/D-56.png'
    ];


    constructor() {
        super().loadImage('assets/images/2_character_pepe/2_walk/W-21.png');
        this.initCharacterState();
        this.initOffsetBox();
        this.loadAllImages();
        this.applyGravity();
        this.animate();
    }


    /**
     * Initializes movement tracking and idle timeout properties.
     */
     initCharacterState() {
        this.lastMovedLeft = false;
        this.lastDirection = null;
        this.lastActionTime = new Date().getTime();
        this.idleThreshold = 10000;
    }


    isSleeping() {
        return new Date().getTime() - this.lastActionTime >= this.idleThreshold;
    }


    /**
     * Configures the collision offset box dimensions and position.
     */
     initOffsetBox() {
        this.hasOffsetBox = true;
        this.offsetBox = { x: 0, y: 0, offsetX: 30, offsetY: 60, w: this.width - 65, h: this.height - 70 };
    }


    /**
     * Preloads all animation sprite sets into the image cache.
     */
     loadAllImages() {
        [this.IMAGES_WALKING, this.IMAGES_JUMPING, this.IMAGES_IDLE,
         this.IMAGES_LONG_IDLE, this.IMAGES_HURT, this.IMAGES_DEAD
        ].forEach(images => this.loadImages(images));
    }


    /**
     * Starts the main game loops for movement/camera and animation state.
     */
     animate() {
        IntervalHub.startInterval(() => {
            if (!this.isDead()) this.updateCamera();
            if (!this.isDead()) this.handleMovementInput();
            else audioHub?.stopWalkSound();
        }, this.FT);

        IntervalHub.startInterval(() => this.updateAnimationState(), 100);
    }


    /**
     * Calculates the target camera position based on end boss proximity
     * and player movement direction, then applies smooth lerp transition.
     */
     updateCamera() {
        let endBoss = this.world.level.enemies.find(enemy => enemy instanceof EndBoss);
        let endBossIsClose = endBoss && !endBoss.isDead() &&
            Math.abs((endBoss.x + endBoss.width / 2) - (this.x + this.width / 2)) < EndBoss.secureAreaX + 200;
        let endBossIsToLeft = endBoss && endBoss.x < this.x;
        let targetCameraX = this.calcTargetCameraX(endBossIsClose, endBossIsToLeft);
        this.applySmoothCamera(targetCameraX);
    }


    /**
     * Determines the target camera X position based on boss proximity and input direction.
     * @param {boolean} endBossIsClose - Whether the end boss is within cinematic range.
     * @param {boolean} endBossIsToLeft - Whether the end boss is to the left of the character.
     * @returns {number} The target camera X position.
     */
     calcTargetCameraX(endBossIsClose, endBossIsToLeft) {
        if (endBossIsClose && endBossIsToLeft) return -this.x + (this.world.canvas.width - 150);
        if (endBossIsClose && !endBossIsToLeft) return -this.x + 150;
        return this.calcDirectionalCameraX();
    }


    /**
     * Calculates camera X based on keyboard input direction during normal gameplay.
     * @returns {number} The target camera X position.
     */
     calcDirectionalCameraX() {
        const canvasW = this.world.canvas.width;
        if (this.world.keyboard.RIGHT) {
            this.lastMovedLeft = false;
            return -this.x + canvasW * 0.3;
        } else if (this.world.keyboard.LEFT) {
            this.lastMovedLeft = true;
            return this.x > 0 ? -this.x + canvasW * 0.7 : this.world.cameraX;
        }
        return this.world.cameraX;
    }


    /**
     * Applies a smooth lerp transition to the camera and clamps it within level bounds.
     * @param {number} targetCameraX - The desired camera X position.
     */
     applySmoothCamera(targetCameraX) {
        let lerpFactor = 0.1;
        this.lastDirection = this.world.keyboard.RIGHT ? 'RIGHT' : (this.world.keyboard.LEFT ? 'LEFT' : 'IDLE');
        this.world.cameraX = Math.round(this.world.cameraX + (targetCameraX - this.world.cameraX) * lerpFactor);
        let minCameraX = -(this.world.level.levelEndX - this.world.canvas.width);
        this.world.cameraX = Math.max(minCameraX, Math.min(0, this.world.cameraX));
    }


    /**
     * Processes keyboard input for horizontal movement, jumping, and walk sounds.
     */
     handleMovementInput() {
        let isMoving = this.handleHorizontalMovement();
        isMoving && !this.isAboveGround() ? audioHub?.playWalkSound() : audioHub?.stopWalkSound();
        this.handleJumpInput();
    }


    /**
     * Handles left/right keyboard input and updates position and direction.
     * @returns {boolean} Whether the character is moving horizontally.
     */
     handleHorizontalMovement() {
        let isMoving = false;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX - this.width) {
            this.moveRight();
            this.turnAround = false;
            isMoving = true;
            this.lastActionTime = new Date().getTime();
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.turnAround = true;
            isMoving = true;
            this.lastActionTime = new Date().getTime();
        }
        return isMoving;
    }


    /**
     * Handles jump input and plays the jump sound.
     */
     handleJumpInput() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            if (!this.victoryMode) audioHub?.playJumpSound();
            this.lastActionTime = new Date().getTime();
        }
    }


    /**
     * Selects and plays the correct animation based on the character's current state
     * (dead, hurt, jumping, walking, idle, or long idle).
     */
     updateAnimationState() {
        if (this.isDead()) {
            audioHub?.stopSnoringSound();
            this.handleDeadState();
        } else if (this.isHurt()) {
            audioHub?.stopSnoringSound();
            this.playAnimation(this.IMAGES_HURT);
            this.lastActionTime = new Date().getTime();
        } else if (this.isAboveGround()) {
            this.playJumpAnimation();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isSleeping()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            if (!this.victoryMode) audioHub?.playSnoringSound();
        } else {
            this.playAnimation(this.IMAGES_IDLE);
            audioHub?.stopSnoringSound();
        }
    }


    /**
     * Handles the death sequence: triggers death animation, sound,
     * falling, and game-end check.
     */
     handleDeadState() {
        if (!this.deadAnimationStarted) {
            this.playDeathAnimation(this.IMAGES_DEAD);
            this.deadAnimationStarted = true;
            audioHub?.playDeathSound();
        }
        if (this.deadAnimationFinished) {
            this.isFallingDown();
            if (this.world && typeof this.world.checkGameEnd === 'function') this.world.checkGameEnd();
        }
    }


    /**
     * Selects and plays the appropriate jump animation frame
     * based on the current vertical speed (ascending vs descending).
     */
     playJumpAnimation() {
        if (this.speedY > 0) {
            if (this.speedY > 15) this.playAnimation(this.IMAGES_JUMPING.slice(1, 2));
            else if (this.speedY > 5) this.playAnimation(this.IMAGES_JUMPING.slice(2, 3));
            else this.playAnimation(this.IMAGES_JUMPING.slice(3, 4));
        } else {
            if (this.speedY < -15) this.playAnimation(this.IMAGES_JUMPING.slice(7, 8));
            else if (this.speedY < -5) this.playAnimation(this.IMAGES_JUMPING.slice(6, 7));
            else this.playAnimation(this.IMAGES_JUMPING.slice(4, 5));
        }
    }


    /**
     * Plays the death animation frame by frame with a 300ms delay between each.
     * Triggers a jump at frame 3 and sets {@link deadAnimationFinished} when done.
     * @param {string[]} images - Array of image paths for the death sequence.
     */
     playDeathAnimation(images) {
        let delay = 0;
        images.forEach((path, index) => {
            setTimeout(() => {
                this.img = this.imgCache[path];
                if (index === 3) {
                    this.jump();
                }
            }, delay);
            delay += 300;
        });
        
        setTimeout(() => {
            this.deadAnimationFinished = true;
        }, delay);
    }


    /**
     * Moves the character downward each frame to simulate falling off-screen after death.
     */
     isFallingDown() {
        this.y += 5;
    }


    /**
     * Check if movement is locked (500ms after being hit)
     * isHurt() still provides 1 second invincibility for collision detection
     */
     isMovementLocked() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < this.hurtDuration;
    }
}