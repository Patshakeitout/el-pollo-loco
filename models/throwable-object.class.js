class ThrowableObject extends MovableObject {
    speedY;
    speedX;

    IMAGES_BOTTLE_ROTATE = ['assets/images/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/images/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/images/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/images/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    constructor(x, y) {
        super().loadImage('assets/images/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATE);
        this.x = 100;
        this.y = 240 ;
        this.width = 50;
        this.height = 60;
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
        this.speedX = 9;

        this.applyGravity();

        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE_ROTATE);
        }, 100);

        IntervalHub.startInterval(() => {
            this.x += 10;
        }, 25);       

    }

}   