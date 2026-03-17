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
    groundY = 158; // Default ground level (Pepe's ground)


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
            // 1. Position the Box
            if (this.turnedAround) {
                this.offsetBox.x = this.x + this.width - this.offsetBox.w - this.offsetBox.offsetX;
            } else {
                this.offsetBox.x = this.x + this.offsetBox.offsetX;
            }
            this.offsetBox.y = this.y + this.offsetBox.offsetY;

            // 2. Update your class properties based on the BOX
            this.centerX = this.offsetBox.x + (this.offsetBox.w / 2);
            this.centerY = this.offsetBox.y + (this.offsetBox.h / 2);
        } else {
            // Fallback for objects without an offset box
            this.centerX = this.x + (this.width / 2);
            this.centerY = this.y + (this.height / 2);
        }
    }


    isColliding(obj) {
        // Force both objects to recalculate their centers/offsets based on current X/Y
        this.updateOffsetBox();
        obj.updateOffsetBox();

        // Now use your properties safely
        let dX = Math.abs(obj.centerX - this.centerX);
        let dY = Math.abs(obj.centerY - this.centerY);

        // Get the correct widths to compare against
        let thisW = this.hasOffsetBox ? this.offsetBox.w : this.width;
        let objW = obj.hasOffsetBox ? obj.offsetBox.w : obj.width;
        let thisH = this.hasOffsetBox ? this.offsetBox.h : this.height;
        let objH = obj.hasOffsetBox ? obj.offsetBox.h : obj.height;

        let deltaXSum = (thisW / 2) + (objW / 2);
        let deltaYSum = (thisH / 2) + (objH / 2);

        return dX <= deltaXSum && dY <= deltaYSum;
    }


    hit() {
        this.energy -= 10;
        this.energy = Math.floor(this.energy);
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
        if (this instanceof ThrowableObject) { // ThrowableObjects fall always
            return true;
        } else {
            return this.y < this.groundY;
        }
    }


    jump(speed = 20) {
        this.speedY = speed;
    }


    /**
     * Set the energy of this object.
     * @param {number} energy - The new energy value.
     * @returns {number} The new energy value.
     */
    setEnergy(energy) {
        this.energy = energy;
    }


    /**
     * Sets the energy of this object to 0 and removes it from the world after a delay.
     * If audioHub is defined, it will play a chicken death sound.
     * If this.world is defined and this.world.pepe is colliding with this, it will bounce Pepe.
     * @see {MovableObject#setEnergy}
     * @see {MovableObject#isColliding}
     */
    die() {
        this.energy = 0;
        if (typeof audioHub !== 'undefined') {
            audioHub.playChickenDeathSound();
        }

        if (this.world && this.world.pepe && this.world.pepe.isColliding(this)) {
            this.world.pepe.speedY = 15; // Bounce
        }
        setTimeout(() => {
            if (this.world) {
                let enemyIndex = this.world.level.enemies.indexOf(this);
                if (enemyIndex > -1) {
                    this.world.level.enemies.splice(enemyIndex, 1);
                }
            }
        }, 1000);
    }

}
