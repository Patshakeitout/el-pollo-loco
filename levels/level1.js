  
let bgRepeat;
let levelEndX;
let enemies = [];
let collectables = [];
let level1;


function initLevel1() {
    bgRepeat = Math.floor(Math.random() * 6) + 5;
    levelEndX = bgRepeat * 720;
    enemies = [];
    collectables = [];
    
    createEnemies(20);
    createEndBoss();
    createCollectables();

    level1 = new Level(
        bgRepeat,
        levelEndX,  
        enemies,
        [new Cloud()],
        collectables
    );
}


function createEnemies(number) {
    let size = 1;
     for (let i = 0; i < number; i++) {
        size = 0.65 + Math.random() * 1.8;
        enemies.push(new Chicken(size, levelEndX));
        size = 1 + Math.random() * 3;
         enemies.push(new Chick(size, levelEndX));
    }
    return enemies;
};


function createEndBoss() {
    enemies.push(new EndBoss(levelEndX-20));
};


function createCollectables() {
    let coinCount = 15 + Math.floor(Math.random() * 11);
    let coins = createCoins(coinCount, levelEndX);
    collectables.push(...coins);
    
    let bottles = createBottleStacks(levelEndX);
    collectables.push(...bottles);
};


/**
 * Create coins scattered above ground throughout the world
 * @param {number} count - Number of coins to create
 * @param {number} levelEndX - The end X position of the level
 * @returns {CollectableObject[]} Array of coin objects
 */
function createCoins(count, levelEndX) {
    let coins = [];
    for (let i = 0; i < count; i++) {
        let x = 500 + Math.random() * (levelEndX - 700);
        let y = 100 + Math.random() * 200; // Y position above ground - adapt
        coins.push(new CollectableObject('coin', x, y));
    }
    return coins;
}


/**
 * Create bottle stacks scattered throughout the world
 * @param {number} levelEndX - The end X position of the level
 * @returns {CollectableObject[]} Array of bottle objects
 */
function createBottleStacks(levelEndX) {
    let bottles = [];
    let numberOfStacks = 4 + Math.floor(Math.random() * 2);
    
    for (let stack = 0; stack < numberOfStacks; stack++) {
        let stackSize = Math.random() < 0.5 ? 5 : 10;
        let stackStartX = 400 + (stack * (levelEndX / numberOfStacks)) + Math.random() * 200;
        
        for (let i = 0; i < stackSize; i++) {
            let x = stackStartX + (i * 40); // Bottles spread horizontally - adapt
            bottles.push(new CollectableObject('bottle', x, 350));
        }
    }
    return bottles;
}