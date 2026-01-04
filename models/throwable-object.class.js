class ThrowableObject extends MovableObject {
    speedY;
    speedX;

    IMAGES_BOTTLE_ROTATE = [
        'assets/images/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/images/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/images/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/images/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'assets/images/6_salsa_bottle/bottle_splash/1_bottle_splash.png',
        'assets/images/6_salsa_bottle/bottle_splash/2_bottle_splash.png',
        'assets/images/6_salsa_bottle/bottle_splash/3_bottle_splash.png',
        'assets/images/6_salsa_bottle/bottle_splash/4_bottle_splash.png',
        'assets/images/6_salsa_bottle/bottle_splash/5_bottle_splash.png',
        'assets/images/6_salsa_bottle/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y, speedX = 9) {
        super();
        this.loadImage('assets/images/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60; 
        this.speedX = speedX;
        this.throw();
    }

/**
 * Throw the bottle in the air.
 * This method is called when the player hits the space bar.
 * It makes the bottle move up and to the right, and starts an animation.
 * The animation is played every 100ms and the bottle moves 10 pixels to the right every 25ms.
 */
    throw() {
        this.speedY = 10;
        this.applyGravity();
        let splashTriggered = false;

        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE_ROTATE);
            if (this.isOnGround() && !splashTriggered) {
                splashTriggered = true;
                this.speedX = 0;
                this.speedY = 0;
                this.splash();
            }
        }, 100);

        IntervalHub.startInterval(() => {
            this.x += this.speedX;
        }, 25);       

    }

    splash() {
        IntervalHub.startInterval(() => this.playAnimation(this.IMAGES_SPLASH), 100);
    }

    
    isOnGround() { return this.y >= 360; }

}   