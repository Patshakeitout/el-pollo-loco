  
const bgRepeat = Math.floor(Math.random() * 6) + 5;
const levelEndX =  bgRepeat * 720;
let enemies = [];
createEnemies(20);
createEndBoss();

const level1 = new Level(
    bgRepeat,
    levelEndX,  
    enemies,
    [new Cloud()]
);


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