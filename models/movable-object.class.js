class MovableObject {
    FT = 1000 / 60;
    x = 10;
    y = 158;
    centerX;
    centerY
    img;
    height = 280;
    width = 102;
    imgCache = {};
    speed = 0.15;
    currentImage = 0;
    turnedAround = false;
    speedY = 0;
    accelerationY = 1;


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawCollisionBox(ctx) {
        if (!(this instanceof Cloud) && !(this instanceof Background)) {
            ctx.beginPath();
            ctx.lineWidth = '1';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }


    drawCenter(ctx) {
        if (!(this instanceof Cloud) && !(this instanceof Background)) {
            this.centerX = this.x + (this.width / 2);
            this.centerY = this.y + (this.height / 2);
            const crossSize = 5;
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = '1';
            ctx.moveTo(this.centerX - crossSize, this.centerY);
            ctx.lineTo(this.centerX + crossSize, this.centerY);
            ctx.moveTo(this.centerX, this.centerY - crossSize);
            ctx.lineTo(this.centerX, this.centerY + crossSize);
            ctx.stroke();
        }
    }


    isColliding(enemy) {
        let dX = Math.abs(enemy.centerX - this.centerX);
        let dY = Math.abs(enemy.centerY - this.centerY);
        let deltaXSum = (enemy.width / 2) + (this.width / 2);
        let deltaYSum = (enemy.height / 2) + (this.height / 2);

        return dX <= deltaXSum && dY <= deltaYSum;
    }


    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }


    playAnimation(images) {
        let moduloIndex = this.currentImage % images.length;
        let path = images[moduloIndex];
        this.img = this.imgCache[path];
        this.currentImage++;
    }


    moveLeft() {
        this.x -= this.speed;
    }


    moveRight() {
        this.x += this.speed;

        //IntervalHub.startInterval(() => this.x += this.speed, this.FT); 
    }


    applyGravity() {
        IntervalHub.startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.accelerationY;
            }
        }, this.FT * 2.5);
    }


    isAboveGround() {
        return this.y < 158;
    }


    jump() {
        this.speedY = 20;
    }
}
