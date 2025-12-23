/**
 * Character class that extends MovableObject
 */
class Character extends MovableObject {
    speed = 5;
    y = 80;
    IMAGES_WALKING = [
        'assets/images/2_character_pepe/2_walk/W-21.png',
        'assets/images/2_character_pepe/2_walk/W-22.png',
        'assets/images/2_character_pepe/2_walk/W-23.png',
        'assets/images/2_character_pepe/2_walk/W-24.png',
        'assets/images/2_character_pepe/2_walk/W-25.png',
        'assets/images/2_character_pepe/2_walk/W-26.png'
    ];
    currentImage = 0;

    IMAGES_JUMPING = [
        'assets/images/2_character_pepe/3_jump/J-31.png',
        'assets/images/2_character_pepe/3_jump/J-32.png',
        'assets/images/2_character_pepe/3_jump/J-33.png',
        'assets/images/2_character_pepe/3_jump/J-34.png',
        'assets/images/2_character_pepe/3_jump/J-35.png',
        'assets/images/2_character_pepe/3_jump/J-36.png',
        'assets/images/2_character_pepe/3_jump/J-37.png',
        'assets/images/2_character_pepe/3_jump/J-38.png',
        'assets/images/2_character_pepe/3_jump/J-39.png',
    ];


    constructor() {
        super().loadImage('assets/images/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.applyGravity();
        this.animate();
    }


    animate() {
        IntervalHub.startInterval(() => {

            if (this.isAboveGround()) { 
                this.playAnimation(this.IMAGES_JUMPING); 
            }

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
            
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.speedY = 20;
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