/**
 * Chicken class that extends MovableObject
 */
class Chicken extends MovableObject {
    y = 374;
    width = 50;
    height = 60;

    IMAGES_WALKING = [
        'assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/images/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/images/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    currentImage = 0;


    constructor() {
        super().loadImage('../../assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 180 + Math.random() * 400;
        this.speed = 0.2 + Math.random() * 0.35;

        this.animate();
    }


    animate() {
        this.moveLeft();

        IntervalHub.startInterval(() => {
            let moduloIndex = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[moduloIndex];
            this.img = this.imgCache[path];
            this.currentImage++;
        }, this.FT * 10);
    }


    jump() {
        console.log('Jumping');
    }
}