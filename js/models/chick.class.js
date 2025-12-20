/**
 * Chicken class that extends MovableObject
 */
class Chick extends MovableObject {
    y = 400;
    width = 25;
    height = 30;

    constructor() {
        super().loadImage('../../assets/images/3_enemies_chicken/chicken_small/1_walk/1_w.png');

        this.x = 180 + Math.random() * 400;
        }
    
    jump() {
        console.log('Jumping');
    }
}