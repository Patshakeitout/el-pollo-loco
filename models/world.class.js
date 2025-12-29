class World {
    pepe = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    turnAround = false;
    statusIconPepe = new StatusIcon('healthPepe', 10, 0, 50, 50);
    statusIconEndBoss = new StatusIcon('healthEndBoss', 60, 0, 50, 50);

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.draw();
        this.setWorld();
        this.checkCollisions();
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.cameraX, 0);

        this.addObjectsToMap(this.level.backgrounds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.pepe);

        this.ctx.translate(-this.cameraX, 0);
        // --- Space for fixed objects in canvas ---
        this.addToMap(this.statusIconPepe);
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


    checkCollisions() {
        IntervalHub.startInterval(() => {
            this.level.enemies.forEach(enemy => {
                if (this.pepe.isColliding(enemy)) {
                    this.pepe.hit();
                    this.pepe.isHurt();
                    this.statusIconPepe.setPercentage(this.pepe.energy);
                    this.statusIconEndBoss.setPercentage(this.pepe.energy);
                }
            });
        }, 200);
    }

}