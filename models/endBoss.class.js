class EndBoss extends MovableObject {
 
    static secureAreaX = 350;

    width = 250;
    height = 250;
    y = 220;
    speed = 3;
    isRolling = false;
    isWalking = false;
    rotationAngle = 0;
    turnedAround = false;

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
    }


    animate() {
        let lastDistance;
        let directionFlag = 1;

        // INTERVAL 1: ANIMATION & STATE LOGIC (Slow)
        IntervalHub.startInterval(() => {
            // 1. If we are rolling (Ball Mode), we stop playing standard animations.
            //    (But we DO NOT return if we are walking, because we need to update walking frames!)
            if (this.isRolling) return;
            
            let distance = Math.abs(this.x - world.pepe.x);
            directionFlag = world.pepe.x < this.x ? 1 : -1;
            this.turnAround = directionFlag === -1;

            // ZONE 1: FAR AWAY (Greater than 1.5x) 
            if (distance > EndBoss.secureAreaX) {

                this.playAnimation(this.IMAGES_ALERT);
                this.isWalking = false; // Stop walking if player runs away

                // ZONE 2: WALKING RANGE (Between 1.0x and 1.5x)
            } else if (distance > EndBoss.secureAreaX-100) {

                this.playAnimation(this.IMAGES_WALK);
                this.isWalking = true; // Enable movement in the fast loop

                // ZONE 3: ATTACK RANGE (Less than 1.0x)
            } else {

                this.playAnimation(this.IMAGES_ATTACK_B);
                this.isWalking = false; // Stop walking to transform

                // Check if we hit the "Ball" frame
                let frameIndex = this.currentImage % this.IMAGES_ATTACK_B.length;
                let path = this.IMAGES_ATTACK_B[frameIndex];

                if (path.includes('angry-ball.png')) {
                    this.isRolling = true;
                    lastDistance = undefined; // Reset for the rolling check
                }
            }

             if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }

        }, 200);


        IntervalHub.startInterval(() => {
            let currentDistance = Math.abs(this.x - world.pepe.x);

            if (this.isRolling) {
                // If distance is increasing, player is getting away ->  stop rolling
                if (lastDistance !== undefined && currentDistance > lastDistance) {
                    this.isRolling = false;
                }
                 
                // Fast Roll Speed
                 this.speed = 5
                if (directionFlag > 0) this.moveLeft();
                else this.moveRight();

            } else if (this.isWalking) {
                // Slow Walk Speed
                this.speed = 0.5; // Walking should be slower than rolling
                if (directionFlag > 0) this.moveLeft();
                else this.moveRight();
            }

            lastDistance = currentDistance;

        }, this.FT);
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

}