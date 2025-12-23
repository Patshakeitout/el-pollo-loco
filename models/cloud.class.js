/**
 * Cloud class that extends MovableObject
 */
class Cloud extends MovableObject {
    y = 10;
    height = 250;
    width = 550;
    speed = 0.08;

    constructor() {
        super().loadImage('assets/images/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 200;
        this.animate();
    }

    animate() {
        this.moveRight();
    }

    

}