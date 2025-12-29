class MovableObject extends DrawableObject {
    FT = 1000 / 60;
    centerX;
    centerY;
    hasOffsetBox = false;
    offsetBox = {
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        w: 0,
        h: 0
    };

    speed = 0.15;
    turnedAround = false;
    speedY = 0;
    accelerationY = 1;
    energy = 100;
    lastHit = 0;


    drawCollisionBox(ctx, x, y, width, height, boxColor = 'blue') {
        if (!(this instanceof Cloud) && !(this instanceof Background)) {
            ctx.beginPath();
            ctx.lineWidth = '1.5';
            ctx.strokeStyle = boxColor;
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }


    drawCollisionCenter(ctx, x, y, width, height, boxColor = 'blue') {
        if (!(this instanceof Cloud) && !(this instanceof Background)) {
            this.centerX = x + (width / 2);
            this.centerY = y + (height / 2);
            const crossSize = 5;
            ctx.beginPath();
            ctx.strokeStyle = boxColor;
            ctx.lineWidth = '1.5';
            ctx.moveTo(this.centerX - crossSize, this.centerY);
            ctx.lineTo(this.centerX + crossSize, this.centerY);
            ctx.moveTo(this.centerX, this.centerY - crossSize);
            ctx.lineTo(this.centerX, this.centerY + crossSize);
            ctx.stroke();
        }
    }


    drawOffsetBox(ctx) {
        if (this.hasOffsetBox && !(this instanceof Cloud) && !(this instanceof Background)) {
            this.drawCollisionBox(ctx, this.offsetBox.x, this.offsetBox.y, this.offsetBox.w, this.offsetBox.h, 'black');
            this.drawCollisionCenter(ctx, this.offsetBox.x, this.offsetBox.y, this.offsetBox.w, this.offsetBox.h, 'black');
        }
    }


    updateOffsetBox() {
        if (this.hasOffsetBox) {
            this.offsetBox.x = this.x + this.offsetBox.offsetX;
            this.offsetBox.y = this.y + this.offsetBox.offsetY;
        }
    }


    isColliding(obj) {
        let dX = Math.abs(obj.centerX - this.centerX);
        let dY = Math.abs(obj.centerY - this.centerY);
        let deltaXSum, deltaYSum;

        if (this.hasOffsetBox) {
            deltaXSum = (obj.width / 2) + (this.offsetBox.w / 2);
            deltaYSum = (obj.height / 2) + (this.offsetBox.h / 2);
        } else {
            deltaXSum = (obj.width / 2) + (this.width / 2);
            deltaYSum = (obj.height / 2) + (this.height / 2);
        }

        return dX <= deltaXSum && dY <= deltaYSum;
    }


    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }  
    }

    
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }


    isDead() {
        return this.energy == 0;
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
