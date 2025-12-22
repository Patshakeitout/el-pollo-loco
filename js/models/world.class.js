class World {
    canvas;
    ctx;
    keyboard;
    cameraX = 0;


    pepe = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken(), new Chick(), new Chick(), new Chick()];
    clouds = [new Cloud()];
    backgrounds = [new Background('../../assets/images/5_background/layers/air.png', 0, 0),
        new Background('../../assets/images/5_background/layers/3_third_layer/1.png', 0, -70),
        new Background('../../assets/images/5_background/layers/2_second_layer/1.png', 0, -28),
        new Background('../../assets/images/5_background/layers/1_first_layer/1.png', 0, 8)     
    ];
    turnAround = false;


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
