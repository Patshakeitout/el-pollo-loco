/**
 * The final boss enemy. Patrols near the level end, transitions between alert,
 * walking, and rolling-ball attack states based on proximity to the player.
 * Extends {@link MovableObject}.
 */
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


    /**
     * Reduces the EndBoss energy by 5 per hit.
     */
     hit() {
        this.energy -= 3.5;
        this.energy = Math.floor(this.energy);
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }


    /**
     * Stores a reference to the game world for accessing Pepe and level data.
     * @param {World} world - The game world instance.
     */
     setWorld(world) {
        this.world = world;
    }


    /**
     * Starts two intervals: one for animation state logic and one for movement.
     */
     animate() {
        this.directionFlag = 1;
        this.rollingDirection = 1;
        this.hasPlayedApproachSound = false;
        this.MIN_ROLLING_DISTANCE = 800;

        IntervalHub.startInterval(() => this.updateAnimationState(), 300);
        IntervalHub.startInterval(() => this.updateMovement(), this.FT);
    }


    /**
     * Handles animation state transitions (alert, walk, attack) based on distance to Pepe.
     */
     updateAnimationState() {
        if (!this.world || !this.world.pepe) return;
        if (this.isDead()) return this.handleDeath();
        if (this.isRolling) return;

        this.updateDirection();
        this.handleZoneByDistance(this.getDistanceToPepe());
        if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
    }


    /**
     * Stops rolling, plays death animation, and triggers game-end check.
     */
     handleDeath() {
        this.isRolling = false;
        this.playDeathAnimation();
        if (!this.world.pepe.isDead() && typeof this.world.checkGameEnd === 'function') {
            this.world.checkGameEnd();
        }
    }


    /**
     * Updates the facing direction based on Pepe's position.
     */
     updateDirection() {
        this.directionFlag = this.getPepeCenterX() < this.getCenterX() ? 1 : -1;
        this.turnAround = this.directionFlag === -1;
    }


    /**
     * Dispatches to the correct zone handler based on distance to Pepe.
     */
     handleZoneByDistance(distance) {
        if (distance > EndBoss.secureAreaX) this.handleAlertZone(distance);
        else if (distance > EndBoss.secureAreaX - 100) this.handleWalkZone();
        else this.handleAttackZone();
    }


    /**
     * Handles movement logic for rolling and walking states.
     */
     updateMovement() {
        if (!this.world || !this.world.pepe) return;

        if (this.isDead()) {
            if (this.deadAnimationIndex >= this.IMAGES_DEAD.length) this.y += 2;
            return;
        }

        if (this.isRolling) this.updateRolling();
        else if (this.isWalking) this.updateWalking();
    }


    /**
     * Alert zone: plays alert animation, triggers approach sound when close enough.
     */
     handleAlertZone(distance) {
        this.playAnimation(this.IMAGES_ALERT);
        this.isWalking = false;
        if (!this.hasPlayedApproachSound && distance < EndBoss.secureAreaX + 200) {
            audioHub?.playEndbossApproachSound();
            this.hasPlayedApproachSound = true;
        }
    }


    /**
     * Walk zone: plays walk animation and enables walking state.
     */
     handleWalkZone() {
        this.playAnimation(this.IMAGES_WALK);
        this.isWalking = true;
    }


    /**
     * Attack zone: plays attack animation and initiates rolling on the ball frame.
     */
     handleAttackZone() {
        this.playAnimation(this.IMAGES_ATTACK_B);
        this.isWalking = false;
        let frameIndex = this.currentImage % this.IMAGES_ATTACK_B.length;
        let path = this.IMAGES_ATTACK_B[frameIndex];

        if (path.includes('angry-ball.png')) {
            audioHub?.playEndbossCackleSound();
            this.isRolling = true;
            this.rollingStartX = this.x;
            this.rollingDirection = this.directionFlag;
            setTimeout(() => {
                if (this.isRolling) audioHub?.playEndbossRollingSound();
            }, 200);
        }
    }


    /**
     * Moves the boss in rolling state and stops when distance or boundary limits are reached.
     */
     updateRolling() {
        let distanceRolled = Math.abs(this.getCenterX() - (this.rollingStartX + this.width / 2));
        if (distanceRolled >= this.MIN_ROLLING_DISTANCE) return this.stopRollingState();

        this.speed = 5;
        let currentRollingDir = window.endBossRollingDirection || this.rollingDirection;

        if (this.x <= 0 || this.x >= this.world.level.levelEndX - this.width) {
            this.stopRollingState();
        } else {
            currentRollingDir > 0 ? this.moveLeft() : this.moveRight();
        }
    }


    /**
     * Moves the boss toward Pepe at walking speed.
     */
     updateWalking() {
        this.directionFlag = this.world.pepe.x < this.x ? 1 : -1;
        this.speed = 0.5;
        this.directionFlag > 0 ? this.moveLeft() : this.moveRight();
    }


    /**
     * Resets rolling state and stops the rolling sound.
     */
     stopRollingState() {
        this.isRolling = false;
        this.rollingStartX = null;
        window.endBossRollingDirection = undefined;
        audioHub?.stopEndbossRollingSound();
    }


    /**
     * @returns {number} The horizontal center of this boss.
     */
     getCenterX() {
        return this.x + this.width / 2;
    }


    /**
     * @returns {number} The horizontal center of Pepe.
     */
     getPepeCenterX() {
        return this.world.pepe.x + this.world.pepe.width / 2;
    }


    /**
     * @returns {number} The absolute distance between boss center and Pepe center.
     */
     getDistanceToPepe() {
        return Math.abs(this.getCenterX() - this.getPepeCenterX());
    }


    /**
     * Steps through the death animation frames one at a time, playing
     * the death sound on the first frame.
     */
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
            super.draw(ctx);
        }
    }


    /**
     * Handles the rotation logic directly on the canvas
     */
     drawRotatingBall(ctx) {
        let ballImage = this.IMAGES_ATTACK_B[4];
        if (!ballImage) return;
        ctx.save();
        
        let centerX = this.x + this.width / 2;
        let centerY = this.y + this.height / 2;
        ctx.translate(centerX, centerY);

        this.rotationAngle -= 5;
        ctx.rotate((this.rotationAngle * Math.PI) / 180);

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

        this.playAnimation(this.IMAGES_ATTACK_B);
        this.isWalking = false;
        this.rollingStartX = this.x; 
        window.endBossRollingDirection = this.world.pepe.x < this.x ? 1 : -1;
        
        setTimeout(() => {
            audioHub?.playEndbossCackleSound();
            this.isRolling = true;

            setTimeout(() => {
                if (this.isRolling) {
                    audioHub?.playEndbossRollingSound();
                }
            }, 200);
        }, 800);
    }

}