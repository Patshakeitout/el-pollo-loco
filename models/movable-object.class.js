class MovableObject {
    FT = 1000 / 60;
    x = 10;
    y = 158;
    img;
    height = 280;
    width = 102;
    imgCache = {};
    speed = 0.15;
    currentImage = 0;
    turnedAround = false;


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }


    playAnimation(images) {
        let moduloIndex = this.currentImage % images.length;
        let path = images[moduloIndex];
        this.img = this.imgCache[path];
        this.currentImage++;
    }


    moveLeft() { IntervalHub.startInterval(() => this.x -= this.speed, this.FT); }


    moveRight() { IntervalHub.startInterval(() => this.x += this.speed, this.FT); }
}
