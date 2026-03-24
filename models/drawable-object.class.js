/**
 * Base class for all visible game objects. Provides image loading, sprite
 * caching, and canvas drawing routines. All renderable entities (characters,
 * enemies, collectables, backgrounds) extend this class.
 */
class DrawableObject {
    img;
    imgCache = {};
    currentImage = 0;
    x = 0;
    y = 158;
    width = 102;
    height = 280;


    /**
     * Creates a new Image element and sets its source to the given path.
     * @param {string} path - The image file path to load.
     */
     loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    /**
     * Draws the current image onto the canvas at the object's position and size.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
     */
     draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    /**
     * Preloads an array of image paths into the image cache for quick access.
     * @param {string[]} arr - Array of image file paths to preload.
     */
     loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }
    
}
