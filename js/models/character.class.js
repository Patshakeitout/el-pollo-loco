/**
 * Character class that extends MovableObject
 */
class Character extends MovableObject {

    constructor() {
        super().loadImage('../../assets/images/2_character_pepe/2_walk/W-21.png');
    }
    
    jump() {
        console.log('Jumping');
    }
}