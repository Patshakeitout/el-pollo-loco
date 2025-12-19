class World {
    canvas;
    ctx;
    pepe = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    clouds = [new Cloud()];
    backgrounds = [new Background('../..assets/images/background/layers/1_first_layer/1.png'), new Background()];
    // IMAGE_BACKGROUND = ['assets/images/background/background.png';]


    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }


    addtoMap(mo) { this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height); };


    addObjectsToMap(objArr) { objArr.forEach(o => { this.addToMap(o); }) };


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.addtoMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.backgrounds);

        requestAnimationFrame(() => this.draw());
    }


}
