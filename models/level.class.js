/**
 * Represents a game level with enemies, clouds, backgrounds, and collectables.
 */
class Level {
    enemies;
    clouds;
    backgrounds = [];
    collectables = [];
    bgRepeat;
    levelEndX;


    constructor(bgRepeat, levelEndX, enemies, clouds, collectables) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.collectables = collectables || [];
        this.bgRepeat = bgRepeat;
        this.createBackgrounds(this.bgRepeat);
        this.levelEndX = levelEndX;
    }


    /**
     * Generates parallax background layers based on the repeat count.
     * Alternates between two image sets for visual variety.
     */
     createBackgrounds() {
        let i = 0;
        while (i <= this.bgRepeat) {
            let x = i * 720;
            let imgNumber = (i % 2 === 0) ? 1 : 2;

            this.backgrounds.push(
                new Background('assets/images/5_background/layers/air.png', x, 0),
                new Background(`assets/images/5_background/layers/3_third_layer/${imgNumber}.png`, x, -70),
                new Background(`assets/images/5_background/layers/2_second_layer/${imgNumber}.png`, x, -28),
                new Background(`assets/images/5_background/layers/1_first_layer/${imgNumber}.png`, x, 8)
            );
            i++;
        }
    }

}