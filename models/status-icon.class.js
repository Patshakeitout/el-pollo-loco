class StatusIcon extends DrawableObject {

    iconName;
    IMAGES = {
        healthPepe: 'assets/images/7_statusbars/3_icons/icon_health.png',
        healthEndBoss: 'assets/images/7_statusbars/3_icons/icon_health_endboss.png',
        coin: 'assets/images/7_statusbars/3_icons/icon_coin.png',
        bottle: 'assets/images/7_statusbars/3_icons/icon_salsa_bottle.png'
    }

    percentage = 100;

    constructor(icon, x, y, width, height) {
        super();
        this.iconName = icon;
        this.loadImage(this.IMAGES[icon]);
        this.x = x;
        this.y = y;
        this.width = width
        this.height = height;
        this.setPercentage(100);
    }


    setPercentage(percentage) {
        this.percentage = percentage;
        console.log(this.percentage);
    }

    draw(ctx) {
        // Draw the icon image
        super.draw(ctx);
        
        // Draw the percentage text centered with the icon
        ctx.font = 'bold 22px Boogaloo-Regular';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textX = this.x + this.width + 10;
        const textY = this.y + this.height / 2 + 5
        
        ctx.strokeText(this.percentage, textX, textY);
        ctx.fillText(this.percentage, textX, textY);
    }
}