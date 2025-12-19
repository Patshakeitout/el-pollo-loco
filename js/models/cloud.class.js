/**
 * Cloud class that extends MovableObject
 */
class Cloud extends MovableObject {
    y = 12;
    height = 250;

    constructor() {
        super().loadImage('../../assets/images/5_background/layers/4_clouds/1.png');  
        
        this.x = -100 + Math.random() * 800;
        this.width = 550;
    }

}