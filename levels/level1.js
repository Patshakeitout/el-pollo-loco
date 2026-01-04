
const bgRepeat = 4;
const levelEndX = bgRepeat * 720;

const level1 = new Level(
    bgRepeat,
    levelEndX,  
    [new Chicken(), new Chicken(), new Chicken(), new  Chick(), new Chick(), new Chick(), new EndBoss(levelEndX-20)],
    [new Cloud()]
);
