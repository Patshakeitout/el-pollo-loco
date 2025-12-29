class ThrowableObject extends MovableObject {
    speedY;
    speedX;

    IMAGES_BOTTLE_ROTATE = [];

    constructor(x, y) {
        super().loadImage('assets/images/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.x = 100;
        this.y = 120;
        this.width = 50;
        this.height = 60;        
        this.throw(100, 160);
    }

    throw(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 8;
        this.speedX = 15;
        this.applyGravity();
        IntervalHub.startInterval(() => { 
            this.x += 8;
        }, 25);
    }

}   