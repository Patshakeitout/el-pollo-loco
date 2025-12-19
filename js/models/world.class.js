class World {
    pepe = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.draw();
    }

    draw() {
        this.ctx.drawImage(this.pepe.img, this.pepe.x, this.pepe.y, this.pepe.width, this.pepe.height);
    } 

}
