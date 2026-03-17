class EndBoss extends MovableObject {

    static secureAreaX = 450;

    width = 250;
    height = 250;
    y = 220;
    speed = 3;
    isRolling = false;
    isWalking = false;
    rotationAngle = 0;
    turnedAround = false;
    rollingStartX = null;
    deadAnimationIndex = 0;

    IMAGES_ALERT = [
        'assets/images/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALK = [
        'assets/images/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/images/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/images/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/images/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK_B = [
        'assets/images/4_enemie_boss_chicken/3b_attack/B21.png',
        'assets/images/4_enemie_boss_chicken/3b_attack/B22.png',
        'assets/images/4_enemie_boss_chicken/3b_attack/B23.png',
        'assets/images/4_enemie_boss_chicken/3b_attack/B24.png',
        'assets/images/4_enemie_boss_chicken/3b_attack/angry-ball.png'
    ];

    IMAGES_HURT = [
        'assets/images/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/images/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/images/4_enemie_boss_chicken/4_hurt/G23.png'
    ]

    IMAGES_DEAD = [
        'assets/images/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/images/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/images/4_enemie_boss_chicken/5_dead/G26.png'
    ]

    constructor(levelEndX) {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ATTACK_B);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = levelEndX - this.width;

        this.animate();
        this.setEnergy(100);
    }


    setWorld(world) {
        this.world = world;
    }


    animate() {
        let lastDistance;
        let directionFlag = 1;
        let rollingDirection = 1; // Store direction when rolling starts
        const MIN_ROLLING_DISTANCE = 800; // Minimum distance to roll through
        let hasPlayedApproachSound = false;

        // INTERVAL 1: ANIMATION & STATE LOGIC (Slow)
        IntervalHub.startInterval(() => {
            if (!this.world || !this.world.pepe) return; // Safety check
            
            if (this.isDead()) {
                this.isRolling = false;
                this.playDeathAnimation();
                // Show win overlay if Pepe is alive
                if (this.world && this.world.pepe && !this.world.pepe.isDead() && typeof this.world.checkGameEnd === 'function') {
                    this.world.checkGameEnd();
                }
                return;
            }

            // 1. If we are rolling (Ball Mode), we stop playing standard animations.
            //    (But we DO NOT return if we are walking, because we need to update walking frames!)
            if (this.isRolling) return;

            // Calculate distance using centerX of both characters
            let endBossCenterX = this.x + this.width / 2;
            let pepeCenterX = this.world.pepe.x + this.world.pepe.width / 2;
            let distance = Math.abs(endBossCenterX - pepeCenterX);
            
            directionFlag = pepeCenterX < endBossCenterX ? 1 : -1;
            this.turnAround = directionFlag === -1;

            // ZONE 1: FAR AWAY
            if (distance > EndBoss.secureAreaX) {

                this.playAnimation(this.IMAGES_ALERT);
                this.isWalking = false;
                
                // Play approach sound when player first enters detection range
                if (!hasPlayedApproachSound && distance < EndBoss.secureAreaX + 200) {
                    audioHub?.playEndbossApproachSound();
                    hasPlayedApproachSound = true;
                }

                // ZONE 2: WALKING RANGE
            } else if (distance > EndBoss.secureAreaX - 100) {

                this.playAnimation(this.IMAGES_WALK);
                this.isWalking = true;

                // ZONE 3: ATTACK RANGE - Rolling triggers here
            } else {

                this.playAnimation(this.IMAGES_ATTACK_B);
                this.isWalking = false;

                // Check if we hit the "Ball" frame
                let frameIndex = this.currentImage % this.IMAGES_ATTACK_B.length;
                let path = this.IMAGES_ATTACK_B[frameIndex];

                if (path.includes('angry-ball.png')) {
                    // Play cackle sound BEFORE transforming to ball
                    audioHub?.playEndbossCackleSound();

                    this.isRolling = true;
                    this.rollingStartX = this.x; // Track starting position
                    rollingDirection = directionFlag; // Capture direction when roll starts
                    lastDistance = undefined; // Reset for the rolling check

                    // Delay roar sound to let cackle play first
                    setTimeout(() => {
                        if (this.isRolling) {
                            audioHub?.playEndbossRollingSound();
                        }
                    }, 200);
                }
            }

            if (this.isHurt()) { 
                this.playAnimation(this.IMAGES_HURT);
             }

        }, 300);


        IntervalHub.startInterval(() => {
            if (!this.world || !this.world.pepe) return; // Safety check
            
            if (this.isDead()) { 
                if (this.deadAnimationIndex >= this.IMAGES_DEAD.length) {
                    this.y += 2; // Fall down slowly
                }
                return;
            }

            // Calculate current distance using centerX positions
            let endBossCenterX = this.x + this.width / 2;
            let pepeCenterX = this.world.pepe.x + this.world.pepe.width / 2;
            let currentDistance = Math.abs(endBossCenterX - pepeCenterX);

            if (this.isRolling) {
                // Calculate distance rolled using center positions
                let rollingStartCenterX = this.rollingStartX + this.width / 2;
                let distanceRolled = Math.abs((this.x + this.width / 2) - rollingStartCenterX);

                // Stop rolling when minimum rolling distance is covered
                if (distanceRolled >= MIN_ROLLING_DISTANCE) {
                    this.isRolling = false;
                    this.rollingStartX = null;
                    window.endBossRollingDirection = undefined;
                    audioHub?.stopEndbossRollingSound();
                }

                // Fast Roll Speed - use rolling direction (towards Pepe when hit by bottle)
                this.speed = 5
                let currentRollingDir = window.endBossRollingDirection || rollingDirection;

                // Stop rolling if hitting world boundaries
                if (this.x <= 0 || this.x >= this.world.level.levelEndX - this.width) {
                    this.isRolling = false;
                    this.rollingStartX = null;
                    window.endBossRollingDirection = undefined;
                    audioHub?.stopEndbossRollingSound();
                } else {
                    if (currentRollingDir > 0) this.moveLeft();
                    else this.moveRight();
                }

            } else if (this.isWalking) {
                let currentDistance = Math.abs(this.x - this.world.pepe.x);
                // Update direction for walking
                directionFlag = this.world.pepe.x < this.x ? 1 : -1;
                // Slow Walk Speed
                this.speed = 0.5;
                if (directionFlag > 0) this.moveLeft();
                else this.moveRight();
            }

            lastDistance = currentDistance;

        }, this.FT);
    }

    playDeathAnimation() {
        if (this.deadAnimationIndex < this.IMAGES_DEAD.length) {
            if (this.deadAnimationIndex === 0) {
                audioHub?.playEndbossDeathSound();
            }
            let path = this.IMAGES_DEAD[this.deadAnimationIndex];
            this.img = this.imgCache[path];
            this.deadAnimationIndex++;
        }
    }


    /**
     * OVERRIDE the standard draw method.
     * This is crucial! We need to interrupt the standard drawing
     * to perform the rotation.
     */
    draw(ctx) {
        if (this.isRolling) {
            this.drawRotatingBall(ctx);
        } else {
            super.draw(ctx); // Use standard drawing for normal animations
        }
    }


    /**
     * Handles the rotation logic directly on the canvas
     */
    drawRotatingBall(ctx) {
        // Ensure we have the ball image loaded
        // We force the image to be the ball (last in array)
        let ballImage = this.IMAGES_ATTACK_B[4];

        if (!ballImage) return;

        ctx.save();

        // 1. Calculate Center of the Boss
        let centerX = this.x + this.width / 2;
        let centerY = this.y + this.height / 2;

        // 2. Translate Canvas to that center
        ctx.translate(centerX, centerY);

        // 3. Rotate Context
        // We subtract (-) to ro tate Counter-Clockwise (rolling left)
        this.rotationAngle -= 5;
        ctx.rotate((this.rotationAngle * Math.PI) / 180);

        // 4. Draw Image centered on the new origin (0,0)
        super.loadImage(ballImage);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }

     /**
     * Trigger rolling when hit by a bottle
     * Rolling direction is towards Pepe (not away)
     */
    startRolling() {
        if (this.isDead()) return;
        // Play attack animation to transition to ball
        this.playAnimation(this.IMAGES_ATTACK_B);

        this.isWalking = false;
        this.rollingStartX = this.x; // Track starting position
        // Set rolling direction TOWARDS Pepe when hit by bottle
        window.endBossRollingDirection = this.world.pepe.x < this.x ? 1 : -1;

        // Delay rolling to let animation play (400ms for attack animation)
        setTimeout(() => {
            // Play cackle sound BEFORE transforming to ball
            audioHub?.playEndbossCackleSound();

            this.isRolling = true;

            // Delay roar sound to let cackle play first
            setTimeout(() => {
                if (this.isRolling) {
                    audioHub?.playEndbossRollingSound();
                }
            }, 200);
        }, 800);
    }

}