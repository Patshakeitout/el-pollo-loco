/**
 * Character class that extends MovableObject
 */
class Character extends MovableObject {
    speed = 5;
    IMAGES_WALKING = [
        'assets/images/2_character_pepe/2_walk/W-21.png',
        'assets/images/2_character_pepe/2_walk/W-22.png',
        'assets/images/2_character_pepe/2_walk/W-23.png',
        'assets/images/2_character_pepe/2_walk/W-24.png',
        'assets/images/2_character_pepe/2_walk/W-25.png',
        'assets/images/2_character_pepe/2_walk/W-26.png'
    ];
    currentImage = 0;


    constructor() {
        super().loadImage('../../assets/images/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);

        this.animate();
    }


    animate() {
        IntervalHub.startInterval(() => {
            let maxCameraX = -(this.world.level.levelEndX - this.world.canvas.width);
            let targetCameraX = -this.x + 40;
            this.world.cameraX = Math.max(maxCameraX, targetCameraX);

            const minLeft = this.world.cameraX - this.world.canvas.width*2 + this.width;
            let maxRight = this.world.level.levelEndX - 40 - this.width;

            if (this.world.keyboard.RIGHT && this.x < maxRight) {
                this.x += this.speed;
                this.turnAround = false;
            }   
            if (this.world.keyboard.LEFT && this.x > minLeft) {
                this.x -= this.speed;
                this.turnAround = true;
            }
        }, this.FT);

        IntervalHub.startInterval(() => {

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, this.FT * 5.5);
    }


    jump() {
        console.log('Jumping');
    }
}