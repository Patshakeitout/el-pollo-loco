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


    updateOffsetBox_old() {
        if (this.hasOffsetBox) {
            this.offsetBox.x = this.x + this.offsetBox.offsetX;
            this.offsetBox.y = this.y + this.offsetBox.offsetY;
        }
    }


    updateOffsetBox2() {
        if (this.hasOffsetBox) {
            if (this.turnedAround) {
                // When mirrored, the offsetX is applied from the right side
                this.offsetBox.x = this.x + this.width - this.offsetBox.w - this.offsetBox.offsetX;
            } else {
                this.offsetBox.x = this.x + this.offsetBox.offsetX;
            }
            this.offsetBox.y = this.y + this.offsetBox.offsetY;
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


    isColliding2(obj) {
        // 1. Refresh positions to current X/Y immediately
        this.updateOffsetBox();
        obj.updateOffsetBox();

        // 2. Get the Hitbox dimensions (use full image if no offsetBox)
        let tX = this.hasOffsetBox ? this.offsetBox.x : this.x;
        let tY = this.hasOffsetBox ? this.offsetBox.y : this.y;
        let tW = this.hasOffsetBox ? this.offsetBox.w : this.width;
        let tH = this.hasOffsetBox ? this.offsetBox.h : this.height;

        let oX = obj.hasOffsetBox ? obj.offsetBox.x : obj.x;
        let oY = obj.hasOffsetBox ? obj.offsetBox.y : obj.y;
        let oW = obj.hasOffsetBox ? obj.offsetBox.w : obj.width;
        let oH = obj.hasOffsetBox ? obj.offsetBox.h : obj.height;

        // 3. Calculate Centers based on the HITBOXES, not the images
        let thisCX = tX + (tW / 2);
        let thisCY = tY + (tH / 2);
        let objCX = oX + (oW / 2);
        let objCY = oY + (oH / 2);

        // 4. Distance Logic
        let dX = Math.abs(thisCX - objCX);
        let dY = Math.abs(thisCY - objCY);

        // 5. Collision Limit
        let sumHalfWidths = (tW / 2) + (oW / 2);
        let sumHalfHeights = (tH / 2) + (oH / 2);

        return dX <= sumHalfWidths && dY <= sumHalfHeights;
    }


    isColliding_old(obj) {
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
        this.energy -= 1;
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
            return this.y < 158;
        }
    }


    jump() {
        this.speedY = 20;
    }


    /**
     * Set the energy of this object.
     * @param {number} energy - The new energy value.
     * @returns {number} The new energy value.
     */
    setEnergy(energy) {
        this.energy = energy;
    }

}
