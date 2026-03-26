/**
 * @fileoverview Level 1 configuration and procedural generation.
 * Builds a randomized desert level with enemies (Chickens, Chicks, EndBoss),
 * collectables (coins, bottle stacks), and clouds. The level width is
 * randomized each run via bgRepeat, producing varied gameplay layouts.
 */
let bgRepeat;
let levelEndX;
let enemies = [];
let collectables = [];
let level1;


/**
 * Initializes level 1 with random dimensions, enemies, and collectables.
 */
 function initLevel1() {
    bgRepeat = Math.floor(Math.random() * 6) + 5;
    levelEndX = bgRepeat * 720;
    enemies = [];
    collectables = [];

    createEnemies(20);
    createEndBoss();
    createCollectables();

    level1 = new Level(bgRepeat, levelEndX, enemies, createClouds(), collectables);
}


/**
 * Creates pairs of Chicken and Chick enemies with random sizes.
 * @param {number} number - Number of enemy pairs to create.
 */
 function createEnemies(number) {
    for (let i = 0; i < number; i++) {
        let chickenSize = 0.65 + Math.random() * 1.5;
        enemies.push(new Chicken(chickenSize, levelEndX));
        let chickSize = 1 + Math.random() * 2;
        enemies.push(new Chick(chickSize, levelEndX));
    }
}


/**
 * Creates the EndBoss and adds it near the end of the level.
 */
 function createEndBoss() {
    enemies.push(new EndBoss(levelEndX - 20));
}


/**
 * Creates all collectables (coins and bottle stacks) for the level.
 */
 function createCollectables() {
    let coinCount = 15 + Math.floor(Math.random() * 11);
    collectables.push(...createCoins(coinCount, levelEndX));
    collectables.push(...createBottleStacks(levelEndX));
}


/**
 * Creates coins scattered above ground throughout the world.
 * @param {number} count - Number of coins to create.
 * @param {number} levelEndX - The end X position of the level.
 * @returns {CollectableObject[]} Array of coin objects.
 */
 function createCoins(count, levelEndX) {
    let coins = [];
    for (let i = 0; i < count; i++) {
        let x = 500 + Math.random() * (levelEndX - 700);
        let y = 100 + Math.random() * 200;
        coins.push(new CollectableObject('coin', x, y));
    }
    return coins;
}


/**
 * Creates bottle stacks scattered throughout the world.
 * @param {number} levelEndX - The end X position of the level.
 * @returns {CollectableObject[]} Array of bottle objects.
 */
 function createBottleStacks(levelEndX) {
    let bottles = [];
    let numberOfStacks = 4 + Math.floor(Math.random() * 2);

    for (let stack = 0; stack < numberOfStacks; stack++) {
        let stackSize = Math.random() < 0.5 ? 5 : 10;
        let stackStartX = 400 + (stack * (levelEndX / numberOfStacks)) + Math.random() * 200;

        for (let i = 0; i < stackSize; i++) {
            let x = stackStartX + (i * 40);
            bottles.push(new CollectableObject('bottle', x, 350));
        }
    }
    return bottles;
}


/**
 * Creates clouds randomly distributed across the level.
 * @returns {Cloud[]} Array of cloud objects.
 */
 function createClouds() {
    let clouds = [];
    for (let i = 0; i < 25; i++) {
        let cloud = new Cloud();
        cloud.x = Math.random() * 7100 - 550;
        clouds.push(cloud);
    }
    return clouds;
}
