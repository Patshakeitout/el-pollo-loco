/**
 * Base class for all movable game objects with physics, collision, and animation.
 * @extends DrawableObject
 */
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
        h: 0,
    };

    speed = 0.15;
    turnedAround = false;
    speedY = 0;
    accelerationY = 1;
    energy = 100;
    lastHit = 0;
    groundY = 158;


    /**
     * Draws a collision box outline around the object (debug helper).
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {number} x - X position of the box.
     * @param {number} y - Y position of the box.
     * @param {number} width - Width of the box.
     * @param {number} height - Height of the box.
     * @param {string} [boxColor='blue'] - Stroke color for the box.
     */
     drawCollisionBox(ctx, x, y, width, height, boxColor = "blue") {
        if (!(this instanceof Cloud) && !(this instanceof Background)) {
        ctx.beginPath();
        ctx.lineWidth = "1.5";
        ctx.strokeStyle = boxColor;
        ctx.rect(x, y, width, height);
        ctx.stroke();
        }
    }


    /**
     * Draws a crosshair at the center of the collision area (debug helper).
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {number} x - X position of the area.
     * @param {number} y - Y position of the area.
     * @param {number} width - Width of the area.
     * @param {number} height - Height of the area.
     * @param {string} [boxColor='blue'] - Stroke color for the crosshair.
     */
     drawCollisionCenter(ctx, x, y, width, height, boxColor = "blue") {
        if (!(this instanceof Cloud) && !(this instanceof Background)) {
        this.centerX = x + width / 2;
        this.centerY = y + height / 2;
        const crossSize = 5;
        ctx.beginPath();
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = "1.5";
        ctx.moveTo(this.centerX - crossSize, this.centerY);
        ctx.lineTo(this.centerX + crossSize, this.centerY);
        ctx.moveTo(this.centerX, this.centerY - crossSize);
        ctx.lineTo(this.centerX, this.centerY + crossSize);
        ctx.stroke();
        }
    }


    /**
     * Draws the offset collision box and its center crosshair (debug helper).
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
     drawOffsetBox(ctx) {
        if (
        this.hasOffsetBox &&
        !(this instanceof Cloud) &&
        !(this instanceof Background)
        ) {
        this.drawCollisionBox(
            ctx,
            this.offsetBox.x,
            this.offsetBox.y,
            this.offsetBox.w,
            this.offsetBox.h,
            "black",
        );
        this.drawCollisionCenter(
            ctx,
            this.offsetBox.x,
            this.offsetBox.y,
            this.offsetBox.w,
            this.offsetBox.h,
            "black",
        );
        }
    }


    /**
     * Recalculates the offset box position and center coordinates based on current x/y.
     * Mirrors the box horizontally when `turnedAround` is true.
     */
     updateOffsetBox() {
        if (this.hasOffsetBox) {
        if (this.turnedAround) {
            this.offsetBox.x =
            this.x + this.width - this.offsetBox.w - this.offsetBox.offsetX;
        } else {
            this.offsetBox.x = this.x + this.offsetBox.offsetX;
        }
        this.offsetBox.y = this.y + this.offsetBox.offsetY;

        this.centerX = this.offsetBox.x + this.offsetBox.w / 2;
        this.centerY = this.offsetBox.y + this.offsetBox.h / 2;
        } else {
        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;
        }
    }


    /**
     * Checks if this object is colliding with another using center-distance comparison.
     * @param {MovableObject} obj - The other object to check collision against.
     * @returns {boolean} True if the objects overlap.
     */
     isColliding(obj) {
        this.updateOffsetBox();
        obj.updateOffsetBox();

        let dX = Math.abs(obj.centerX - this.centerX);
        let dY = Math.abs(obj.centerY - this.centerY);

        let thisW = this.hasOffsetBox ? this.offsetBox.w : this.width;
        let objW = obj.hasOffsetBox ? obj.offsetBox.w : obj.width;
        let thisH = this.hasOffsetBox ? this.offsetBox.h : this.height;
        let objH = obj.hasOffsetBox ? obj.offsetBox.h : obj.height;

        let deltaXSum = thisW / 2 + objW / 2;
        let deltaYSum = thisH / 2 + objH / 2;

        return dX <= deltaXSum && dY <= deltaYSum;
    }


    /**
     * Reduces energy by 15 and records the hit timestamp.
     */
     hit() {
        this.energy -= 15;
        this.energy = Math.floor(this.energy);
        if (this.energy < 0) {
        this.energy = 0;
        } else {
        this.lastHit = new Date().getTime();
        }
    }


    /**
     * Returns whether the object is currently in the hurt state.
     * The hurt window lasts 0.4 seconds after the last hit.
     * @returns {boolean} True if less than 400 ms have passed since the last hit.
     */
     isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.4;
    }


    /**
     * Returns whether the object has no energy remaining.
     * @returns {boolean} True if `energy` is 0.
     */
     isDead() {
        return this.energy == 0;
    }


    /**
     * Advances the sprite animation by one frame using a cyclic index.
     * @param {string[]} images - Ordered array of image cache keys for the animation.
     */
     playAnimation(images) {
        let moduloIndex = this.currentImage % images.length;
        let path = images[moduloIndex];
        this.img = this.imgCache[path];
        this.currentImage++;
    }


    /**
     * Moves the object left by `speed` pixels.
     */
     moveLeft() {
        this.x -= this.speed;
    }


    /**
     * Moves the object right by `speed` pixels.
     */
     moveRight() {
        this.x += this.speed;
    }


    /**
     * Starts a gravity loop that decrements `speedY` by `accelerationY` each tick
     * and applies vertical movement while the object is above ground or still rising.
     */
     applyGravity() {
        IntervalHub.startInterval(() => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.accelerationY;
        }
        }, this.FT * 2.5);
    }


    /**
     * Returns whether the object is currently above the ground level.
     * `ThrowableObject` instances are always considered airborne.
     * @returns {boolean} True if the object is above `groundY`.
     */
     isAboveGround() {
        if (this instanceof ThrowableObject) {
        return true;
        } else {
        return this.y < this.groundY;
        }
    }


    /**
     * Initiates a jump by setting the upward vertical velocity.
     * @param {number} [speed=20] - Initial upward velocity for the jump.
     */
     jump(speed = 20) {
        this.speedY = speed;
    }


    /**
     * Sets the energy of this object to the given value.
     * @param {number} energy - The new energy value.
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
        if (typeof audioHub !== "undefined") {
        audioHub.playChickenDeathSound();
        }

        if (this.world && this.world.pepe && this.world.pepe.isColliding(this)) {
        this.world.pepe.speedY = 15;
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
