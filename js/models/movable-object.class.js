class MovableObject {
    x = 20;
    y = 158;
    img;
    height = 280;
    width = 102;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    moveRight() {
        console.log('Moving right');
    }
}
