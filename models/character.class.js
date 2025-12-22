/**
 * Character class that extends MovableObject
 */
class Character extends MovableObject {
    speed = 5;
    IMAGES_WALKING = [
        '../../assets/images/2_character_pepe/2_walk/W-21.png',
        '../../assets/images/2_character_pepe/2_walk/W-22.png',
        '../../assets/images/2_character_pepe/2_walk/W-23.png',
        '../../assets/images/2_character_pepe/2_walk/W-24.png',
        '../../assets/images/2_character_pepe/2_walk/W-25.png',
        '../../assets/images/2_character_pepe/2_walk/W-26.png'
    ];
    currentImage = 0;


    constructor() {
        super().loadImage('../../assets/images/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);

        this.animate();
    }


    animate() {
        IntervalHub.startInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.x += this.speed;
                this.turnAround = false;
            }   
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.turnAround = true;
            }
            this.world.cameraX = -this.x + 50;
        }, this.FT);

        IntervalHub.startInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                let moduloIndex = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[moduloIndex];
                this.img = this.imgCache[path];
                this.currentImage++;
            }
        }, this.FT * 5.5);
    }


    jump() {
        console.log('Jumping');
    }
}