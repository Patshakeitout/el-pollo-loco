class MovableObject {
    FT = 1000 / 60;
    x = 20;
    y = 158;
    img;
    height = 280;
    width = 102;
    imgCache = {};


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


    moveRight() {
        console.log('Moving right');
    }


    moveLeft() {
        console.log('Moving left');
    }
}
