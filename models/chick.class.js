/**
 * Chicken class that extends MovableObject
 */
class Chick extends MovableObject {
    width = 28;
    height = 30;
    turnAround = false;
    levelEndX;
    canJump;

    IMAGES_WALKING = [
        'assets/images/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/images/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/images/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEAD = ['assets/images/3_enemies_chicken/chicken_small/2_dead/dead.png'];
    currentImage = 0;


    constructor(size, levelEndX) {
        super();
        this.loadImage('assets/images/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD); // Preload dead image into cache

        this.x = 600 + Math.floor(Math.random() * levelEndX);
        this.speed = 0.12 + Math.random() * 1;
        this.width = size * this.width;
        this.height = size * this.height;
        this.groundY = 440 - this.height;
        this.y = this.groundY;
        this.canJump = Math.random() < 0.33; 
        this.levelEndX = levelEndX;
        
        this.applyGravity();
        this.animate();
    }


    animate() {
        IntervalHub.startInterval(() => {
            if (this.isDead()) return;

            if (this.x <= 0) this.turnAround = true;
            if (this.x >= this.levelEndX) this.turnAround = false;

            this.turnAround ? this.moveRight() : this.moveLeft();

            if (this.canJump && !this.isAboveGround()) {
                this.jump(5 + Math.random()*10);
            }
                

        }, this.FT);

        IntervalHub.startInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                let moduloIndex = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[moduloIndex];
                this.img = this.imgCache[path];
                this.currentImage++;
            }
        }, this.FT * 10);
    }

}