/**
 * Chicken class that extends MovableObject
 */
class Chicken extends MovableObject {
    width = 50;
    height = 60;

    IMAGES_WALKING = [
        'assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/images/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/images/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEAD = ['assets/images/3_enemies_chicken/chicken_normal/2_dead/dead.png'];
    currentImage = 0;

 
    constructor(size, levelEndX) {
        super().loadImage('assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 600 + Math.floor(Math.random () * levelEndX);
        this.speed = 0.2 + Math.random() * 1;
        this.width = size * this.width;
        this.height = size * this.height;
        this.y = 440 - this.height;

        this.animate();
    }


    animate() {
        IntervalHub.startInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
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




    jump() {
        console.log('Jumping');
    }
}