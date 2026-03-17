/**
 * Cloud class that extends MovableObject
 */
class Cloud extends MovableObject {
    y = 10;
    height = 250;
    width = 550;
    speed = 0.05;

    constructor() {
        super().loadImage('assets/images/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500 - 550;
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            this.x += this.speed;

            // Reset position when cloud exits to the right and wrap back to left
            if (this.x > 7650) {
                this.x = -550;
            }
        }, 1000 / 60);
    }



}