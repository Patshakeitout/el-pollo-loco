class EndBoss extends MovableObject {
    width = 300;
    height = 310;
    y = 146;

    IMAGES_WALKING = [
        'assets/images/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/images/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    constructor(levelEndX) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = levelEndX - this.width;
        this.animate();
    }


    animate() {
        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, this.FT * 12);
    }
}