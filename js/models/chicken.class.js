/**
 * Chicken class that extends MovableObject
 */
class Chicken extends MovableObject {

    constructor() {
        super().loadImage('../../assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.x = 200 + Math.random() * 400;

        }
    
    jump() {
        console.log('Jumping');
    }
}