/**
 * Character class that extends MovableObject
 */
class Character extends MovableObject {

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
            let moduloIndex = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[moduloIndex];
            this.img = this.imgCache[path];
            this.currentImage++;
        }, this.FT*10); 
    }


    jump() {
        console.log('Jumping');
    }
}