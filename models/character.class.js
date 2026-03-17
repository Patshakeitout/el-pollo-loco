/**
 * Character class that extends MovableObject
 */
class Character extends MovableObject {
    speed = 5;
    currentImage = 0;
    hurtTime = 0;
    hurtDuration = 500; // Duration for movement lock
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

        this.lastMovedLeft = false; // Track if last movement was left
        this.lastDirection = null; // Track previous direction for smooth transitions
        this.lastActionTime = new Date().getTime(); // Track when Pepe last moved/acted
        this.idleThreshold = 10000; // 10 seconds before sleep animation
        this.hasOffsetBox = true;
        this.offsetBox = {
            x: 0,
            y: 0,
            offsetX: 30,
            offsetY: 60,
            w: this.width - 65,
            h: this.height - 70
        };

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity();
        this.animate();
    }


    animate() {
        IntervalHub.startInterval(() => {
            // Freeze camera if character is dead or movement locked
            if (!this.isDead() && !this.isMovementLocked()) {
                // Find the endBoss in the enemies array
                let endBoss = this.world.level.enemies.find(enemy => enemy instanceof EndBoss);

                // Check if endBoss is to the left of Pepe (pepe is being hunted from the left)
                let endBossIsToLeft = endBoss && endBoss.x < this.x;

                let targetCameraX;

                if (endBossIsToLeft) {
                    // Cinematic mode: position Pepe at the right edge of the canvas
                    targetCameraX = -this.x + (this.world.canvas.width - 150);
                } else {
                    // Normal mode: directional camera based on movement direction
                    if (this.world.keyboard.RIGHT) {
                        // Moving right: Pepe at le ft edge of frame with lead ahead
                        targetCameraX = -this.x - 110;
                        this.lastMovedLeft = false;
                    } else if (this.world.keyboard.LEFT) {
                        // Moving left: Pepe at right edge of frame (or idle camera if at x=0)
                        if (this.x > 0) {
                            targetCameraX = -this.x + (this.world.canvas.width);
                        } else {
                            targetCameraX = this.world.cameraX; // Camera stays still at left edge
                        }
                        this.lastMovedLeft = true;
                    } else {
                        // Idle: keep camera position stable (prevents jumping on flip)
                        targetCameraX = this.world.cameraX;
                    }
                }


                // Smooth camera transition with lerp + round to avoid visual artifacts
                // Always use smooth transition to prevent jumping
                let currentDirection = this.world.keyboard.RIGHT ? 'RIGHT' : (this.world.keyboard.LEFT ? 'LEFT' : 'IDLE');
                let lerpFactor = 0.04; // Consistent smooth transition for all directions

                this.lastDirection = currentDirection;
                this.world.cameraX = Math.round(this.world.cameraX + (targetCameraX - this.world.cameraX) * lerpFactor);

                // Constrain camera to valid boundaries
                let minCameraX = -(this.world.level.levelEndX - this.world.canvas.width);
                this.world.cameraX = Math.max(minCameraX, Math.min(0, this.world.cameraX));
            }

            // Calculate movement boundaries
            let minLeft = 0;
            let maxRight = this.world.level.levelEndX - this.width;

            // Freeze all user interactions if character is dead or movement locked
            if (!this.isDead() && !this.isMovementLocked()) {
                let isMoving = false;

                if (this.world.keyboard.RIGHT && this.x < maxRight) {
                    this.moveRight();
                    this.turnAround = false;
                    isMoving = true;
                    this.lastActionTime = new Date().getTime();
                }

                if (this.world.keyboard.LEFT && this.x > minLeft) {
                    this.moveLeft();
                    this.turnAround = true;
                    isMoving = true;
                    this.lastActionTime = new Date().getTime();
                }

                // Handle walk sound
                if (isMoving && !this.isAboveGround()) {
                    audioHub?.playWalkSound();
                } else {
                    audioHub?.stopWalkSound();
                }

                if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                    this.jump();
                    audioHub?.playJumpSound();
                    this.lastActionTime = new Date().getTime();
                }
            } else {
                audioHub?.stopWalkSound();
            }
        }, this.FT);


        IntervalHub.startInterval(() => {
            if (this.isDead()) {
                if (!this.deadAnimationStarted) {
                    this.playDeathAnimation(this.IMAGES_DEAD);
                    this.deadAnimationStarted = true;
                    audioHub?.playDeathSound();
                }
                if (this.deadAnimationFinished) {
                    this.isFallingDown();
                    // Show end overlay after Pepe sinks
                    if (this.world && typeof this.world.checkGameEnd === 'function') {
                        this.world.checkGameEnd();
                    }
                }
            } else if (this.isMovementLocked()) {
                // Show hurt animation during movement lock
                this.playAnimation(this.IMAGES_HURT);
                return;
            } else if (this.isAboveGround()) {
                this.playJumpAnimation();
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                // Check if Pepe has been idle for 10 seconds
                let timeSinceLastAction = new Date().getTime() - this.lastActionTime;
                if (timeSinceLastAction >= this.idleThreshold) {
                    this.playAnimation(this.IMAGES_LONG_IDLE);
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                }
            }

        }, 100); 

    }


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
        
        // Mark animation as finished after all frames have played
        setTimeout(() => {
            this.deadAnimationFinished = true;
        }, delay);
    }


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