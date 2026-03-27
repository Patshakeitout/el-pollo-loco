/**
 * Represents a background cloud that drifts continuously to the right and wraps
 * back to the left edge when it exits the level. Extends {@link MovableObject}.
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


    /**
     * Moves the cloud rightward at a constant speed and resets its position
     * to the left when it scrolls past the level boundary.
     */
     animate() {
        IntervalHub.startInterval(() => {
            this.x += this.speed;

            if (this.x > 7650) {
                this.x = -550;
            }
        }, 1000 / 60);
    }
}