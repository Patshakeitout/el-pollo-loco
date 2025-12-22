class World {
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    pepe = new Character();
    turnAround = false;
    enemies = [new Chicken(), new Chicken(), new Chicken(), new Chick(), new Chick(), new Chick()];
    clouds = [new Cloud()];
    backgrounds = [];
    bgRepeat = 4;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.createBackgrounds();

        this.draw();
        this.setWorld();
    }


    /**
     * Creates the background layers dynamically.
     */
    createBackgrounds() {
        let xOffset = -720;

        this.backgrounds.push(
            new Background('../../assets/images/5_background/layers/air.png', xOffset, 0),
            new Background('../../assets/images/5_background/layers/3_third_layer/2.png', xOffset, -70),
            new Background('../../assets/images/5_background/layers/2_second_layer/2.png', xOffset, -28),
            new Background('../../assets/images/5_background/layers/1_first_layer/2.png', xOffset, 8)
        );

        let i = 0;
        while (i <= this.bgRepeat) {
            let x = i * 719;
            let imgNumber = (i % 2 === 0) ? 1 : 2;

            this.backgrounds.push(
                new Background('../../assets/images/5_background/layers/air.png', x, 0),
                new Background(`../../assets/images/5_background/layers/3_third_layer/${imgNumber}.png`, x, -70),
                new Background(`../../assets/images/5_background/layers/2_second_layer/${imgNumber}.png`, x, -28),
                new Background(`../../assets/images/5_background/layers/1_first_layer/${imgNumber}.png`, x, 8)
            );
            i++;
        }
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
