class CollectableObject extends DrawableObject {
    collected = false;
    type;
    centerX;
    centerY;
    hasOffsetBox = false;
    offsetBox = { x: 0, y: 0, offsetX: 0, offsetY: 0, w: 0, h: 0 };

    IMAGE_COIN = [
        'assets/images/8_coin/coin_1.png',
        'assets/images/8_coin/coin_2.png'
    ];

    IMAGES_BOTTLE = [
        'assets/images/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'assets/images/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(type, x, y, keepY = false) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;

        if (type === 'coin') {
            let randomImg = Math.random() < 0.5 ? this.IMAGE_COIN[0] : this.IMAGE_COIN[1];
            this.loadImage(randomImg);
            this.width = 100;
            this.height = 100;
        } else if (type === 'bottle') {
            let randomImg = Math.random() < 0.5 ? this.IMAGES_BOTTLE[0] : this.IMAGES_BOTTLE[1];
            this.loadImage(randomImg);
            this.width = 50;
            this.height =  60;
            if (!keepY) this.y = 370;
        }
        
        this.updateOffsetBox();
    }

    /**
     * Update center coordinates for collision detection
     */
    updateOffsetBox() {
        this.centerX = this.x + (this.width / 2);
        this.centerY = this.y + (this.height / 2);
    }

    /**
     * Mark this collectable as collected
     */
    collect() {
        this.collected = true;
    }
}