/**
 * Represents a background layer element in the game world.
 * @extends MovableObject
 */
 class Background extends MovableObject {
    /** @type {number} */
    width= 720;
    /** @type {number} */
    height= 480;

    /**
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position in the game world.
     * @param {number} y - Vertical position in the game world.
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
}