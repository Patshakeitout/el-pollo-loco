class StatusIcon extends DrawableObject {

    iconName;
    amount;

    IMAGES = {
        healthPepe: 'assets/images/7_statusbars/3_icons/icon_health.png',
        healthEndBoss: 'assets/images/7_statusbars/3_icons/icon_health_endboss.png',
        coin: 'assets/images/7_statusbars/3_icons/icon_coin.png',
        bottle: 'assets/images/7_statusbars/3_icons/icon_salsa_bottle.png'
    }

    constructor(icon, x, y, width, height, initialAmount) {
        super();
        this.iconName = icon;
        this.loadImage(this.IMAGES[icon]);
        this.x = x;
        this.y = y;
        this.width = width
        this.height = height;
        this.amount = initialAmount;
    }

    setAmount(amount) {
        this.amount = amount;
    }

    draw(ctx) {
        // Draw the icon image
        super.draw(ctx);
        
        // Draw the percentage text centered with the icon
        ctx.font = 'bold 22px Boogaloo-Regular';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';        
        
        let textX, textY;
        if (this.iconName == 'bottle') {
            textX = this.x + this.width - 4;
            textY = this.y + this.height / 2 + 5;
        } else if (this.iconName == 'healthEndBoss') {
            textX = this.x + this.width + 11;   
            textY = this.y + this.height / 2 + 4;
        }
        else {
            textX = this.x + this.width + 8;
            textY = this.y + this.height / 2 + 5;
        }
        
        ctx.strokeText(this.amount, textX, textY);
        ctx.fillText(this.amount, textX, textY);
    }
}