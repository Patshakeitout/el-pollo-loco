class MovableObject {
    FT = 1000 / 60;
    x = 20;
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


    moveLeft() { IntervalHub.startInterval(() => this.x -= this.speed, this.FT); }


    moveRight() { IntervalHub.startInterval(() => this.x += this.speed, this.FT); }
}
