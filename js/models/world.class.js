class World {
    canvas;
    ctx;
    pepe = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    clouds = [new Cloud()];
    backgrounds = [new Background('../../assets/images/5_background/layers/air.png', 0, 0),
        new Background('../../assets/images/5_background/layers/3_third_layer/1.png', 0, -70),
        new Background('../../assets/images/5_background/layers/2_second_layer/1.png', 0, -28),
        new Background('../../assets/images/5_background/layers/1_first_layer/1.png', 0, 8)     
    ];


    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }


    addToMap(mo) { this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height); };


    addObjectsToMap(objArr) { objArr.forEach(o => { this.addToMap(o); }) };


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgrounds);
        this.addToMap(this.pepe);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);

        requestAnimationFrame(() => this.draw());
    }





}
