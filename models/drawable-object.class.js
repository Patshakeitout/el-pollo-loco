class DrawableObject {
    img;
    imgCache = {};
    currentImage = 0;
    x = 0;
    y = 158;
    width = 102;
    height = 280;


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }
    
}
