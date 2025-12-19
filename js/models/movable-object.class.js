class MovableObject {
    x = 80;
    y = 100;
    img;
    height = 200;
    width = 80;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    moveRight() {
        console.log('Moving right');
    }
}
