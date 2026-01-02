class World {
    pepe = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    turnAround = false; 
    statusIconPepe = new StatusIcon('healthPepe', 20, 9, 50, 50, 100);
    statusIconCoin = new StatusIcon('coin', 101, 12.5, 45, 45, 100);
    statusIconBottle = new StatusIcon('bottle', 166, 15, 55, 40, 100);
    statusIconEndBoss = new StatusIcon('healthEndBoss', 242, 17, 40, 40, 20);
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.draw();
        this.setWorld();
        this.run();
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.cameraX, 0);

        this.addObjectsToMap(this.level.backgrounds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.pepe);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.cameraX, 0);

        // --- Space for fixed objects in canvas ---
        this.addToMap(this.statusIconPepe);
        this.addToMap(this.statusIconCoin);
        this.addToMap(this.statusIconBottle);
        this.addToMap(this.statusIconEndBoss);

        this.ctx.translate(this.cameraX, 0);

        this.ctx.translate(-this.cameraX, 0);

        requestAnimationFrame(() => this.draw());
    }


    addToMap(mo) {

        if (mo.turnAround) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo instanceof MovableObject) {
            mo.drawCollisionBox(this.ctx, mo.x, mo.y, mo.width, mo.height);
            mo.drawCollisionCenter(this.ctx, mo.x, mo.y, mo.width, mo.height);
            mo.updateOffsetBox();
            mo.drawOffsetBox(this.ctx);
        }

        if (mo.turnAround) {
            this.flipImageBack(mo);
        }
    };


    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }


    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    } 


    addObjectsToMap(objArr) { objArr.forEach(o => { this.addToMap(o); }) };


    setWorld() {
        this.pepe.world = this;
    }


     run() {
        IntervalHub.startInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }


    checkThrowObjects() {
        if (this.keyboard.ENTER) {
            let bottle = new ThrowableObject(this.pepe.x + 100, this.pepe.y + 100);
             this.throwableObjects.push(bottle);
            console.log('Throwing bottle from:', this.pepe.x + 100, this.pepe.y + 100);
        }
    }


    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.pepe.isColliding(enemy)) {
                this.pepe.hit();
                this.pepe.isHurt();
                this.statusIconPepe.setPercentage(this.pepe.energy);
            }

            if (this.throwableObjects.length > 0 && enemy instanceof EndBoss) {
                console.log('Bottles in array:', this.throwableObjects.length);
                this.throwableObjects.forEach((bottle, index) => {
                    console.log(`Bottle ${index}: x=${bottle.x}, y=${bottle.y}`);
                    console.log(`Enemy: x=${enemy.x}, y=${enemy.y}`);
                    if (bottle.isColliding(enemy)) {
                        console.log('hit with bottle');
                        if (enemy instanceof EndBoss) {
                            enemy.hit();
                            this.statusIconEndBoss.setPercentage(enemy.energy);
                        }
                        this.throwableObjects.splice(index, 1);
                    }
                });
            }
            
        });

    }

}