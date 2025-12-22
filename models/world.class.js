class World {
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    pepe = new Character();
    turnAround = false;
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgrounds = level1.backgrounds;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.draw();
        this.setWorld();
    }


    addToMap(mo) {
        if (mo.turnAround) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.turnAround) {
            this.ctx.restore();
            mo.x = mo.x * -1;
        }
    };


    addObjectsToMap(objArr) { objArr.forEach(o => { this.addToMap(o); }) };


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.cameraX, 0);

        this.addObjectsToMap(this.backgrounds);
        this.addToMap(this.pepe);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);

        this.ctx.translate(-this.cameraX, 0);

        requestAnimationFrame(() => this.draw());
    }


    setWorld() {
        this.pepe.world = this;
    }



}
