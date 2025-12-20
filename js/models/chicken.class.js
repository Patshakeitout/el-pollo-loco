/**
 * Chicken class that extends MovableObject
 */
class Chicken extends MovableObject {

    constructor() {
        super().loadImage('../../assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.x = 180 + Math.random() * 400;
        this.y = 374;
        this.width = 50;
        this.height = 60;

        }
    
    jump() {
        console.log('Jumping');
    }
}