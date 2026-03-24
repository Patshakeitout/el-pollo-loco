class World {
    pepe = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    turnAround = false;
    statusIconPepe = new StatusIcon('healthPepe', 'status-health', 100);
    statusIconCoin = new StatusIcon('coin', 'status-coin', 0);
    statusIconBottle = new StatusIcon('bottle', 'status-bottle', 10);
    statusIconKill = new StatusIcon('kill', 'status-kill', 0);
    statusIconEndBoss = new StatusIcon('healthEndBoss', 'status-endboss', 100);
    thrownObjects = [];
    endBossRevealed = false;
    enemiesKilled = 0;
    supplyPilesSpawned = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.paused = false;

        this.draw();
        this.setWorld();
        this.run();
    }


    draw() {
        if (!this.paused) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.translate(this.cameraX, 0);

            this.addObjectsToMap(this.level.backgrounds);
            this.addObjectsToMap(this.level.enemies);
            this.addObjectsToMap(this.level.clouds);
            this.addObjectsToMap(this.level.collectables);
            if (this.pepe) this.addToMap(this.pepe);
            this.addObjectsToMap(this.thrownObjects);

            this.ctx.translate(-this.cameraX, 0);

            // Reveal endboss health icon when boss enters view
            this.checkEndBossReveal();

            //let self = this;
            requestAnimationFrame(() => this.draw());
        }
    }


    /**
     * Shows the endboss health icon once the boss enters the viewport.
     */
    checkEndBossReveal() {
        if (this.endBossRevealed) return;
        const endBoss = this.level.enemies.find(enemy => enemy instanceof EndBoss);
        if (endBoss && endBoss.x > -this.cameraX - 100 && endBoss.x < -this.cameraX + this.canvas.width + 100) {
            this.endBossRevealed = true;
            this.statusIconEndBoss.show();
        }
    }


    /**
     * Toggles the pause state of the game. If the game is unpaused,
     * the draw loop is restarted.
     */
    togglePause() {
        this.paused = !this.paused;
        if (!this.paused) {
            this.draw();
        }
    }


    addToMap(mo) {
        if (mo.turnAround) { this.ctx.save(); this.ctx.translate(mo.width, 0); this.ctx.scale(-1, 1); mo.x *= -1; }
        mo.draw(this.ctx);
        if (mo instanceof MovableObject) mo.updateOffsetBox();
        if (mo.turnAround) { this.ctx.restore(); mo.x *= -1; }
    }


    addObjectsToMap(objArr) { objArr.forEach(o => { this.addToMap(o); }) };


    setWorld() {
        this.pepe.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof EndBoss) {
                enemy.setWorld(this);
            }
        });
    }


    run() {
        IntervalHub.startInterval(() => {
            this.checkCollisions();
            this.checkCollectableCollisions();
        }, this.FT);

        IntervalHub.startInterval(() => {
            this.checkThrowObjects();
        }, 200);

        IntervalHub.startInterval(() => {
            // Remove Pepe if dead and has fallen below the canvas
            if (this.pepe && this.pepe.isDead() && this.pepe.y > this.canvas.height) {
                this.pepe = null;
            }
        }, this.FT);

    }


    /**
     * Check collisions between Pepe and collectables (coins and bottles)
     */
    checkCollectableCollisions() {
        if (!this.pepe || this.pepe.isDead()) return;

        this.level.collectables.forEach((collectable, index) => {
            if (collectable.collected) return;

            if (this.pepe.isColliding(collectable)) {
                collectable.collect();

                if (collectable.type === 'coin') {
                    this.statusIconCoin.setAmount(this.statusIconCoin.amount + 1);
                    audioHub?.playCoinSound();
                    // Each coin refills 2 health points
                    this.pepe.energy += 2;
                    this.statusIconPepe.setAmount(this.pepe.energy);
                } else if (collectable.type === 'bottle') {
                    this.statusIconBottle.setAmount(this.statusIconBottle.amount + 1);
                    audioHub?.playBottleCollectSound();
                }

                this.level.collectables.splice(index, 1);
            }
        });
    }


    checkThrowObjects() {
        if (!this.keyboard.ENTER || this.statusIconBottle.amount == 0) return;
        let dir = this.pepe.turnAround ? -9 : 9;
        let startX = dir > 0 ? this.pepe.x + this.pepe.width / 2 : this.pepe.x;
        let bottle = new ThrowableObject(startX, this.pepe.y + 100, dir);
        bottle.world = this;
        this.thrownObjects.push(bottle);
        this.statusIconBottle.setAmount(this.statusIconBottle.amount - 1);
    }


    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead()) return;

            if (this.pepe && this.pepe.isColliding(enemy)) {
                let pepeBottom = this.pepe.y + this.pepe.height;
                if (this.pepe.hasOffsetBox) {
                    pepeBottom = this.pepe.offsetBox.y + this.pepe.offsetBox.h;
                }
                let enemyCenterY = enemy.y + (enemy.height / 2);

                if (!this.pepe.isDead() && this.pepe.isAboveGround() && this.pepe.speedY < 0 && !(enemy instanceof EndBoss) && pepeBottom < enemyCenterY) {
                    enemy.energy = 0;
                    this.pepe.speedY = 15; // Bounce
                    this.trackKill();
                    audioHub?.playJumpSound();
                    if (enemy instanceof Chicken) {
                        audioHub?.playChickenDeathSound?.(); // Play chickenDead.mp3
                    } else if (enemy instanceof Chick) {
                        audioHub?.playChickDeathSound?.(); // Play chickDead.mp3
                    }
                    setTimeout(() => {
                        let enemyIndex = this.level.enemies.indexOf(enemy);
                        if (enemyIndex > -1) {
                            this.level.enemies.splice(enemyIndex, 1);
                        }
                    }, 1000);
                } else if (!this.pepe.isDead() && !this.pepe.isHurt()) {
                    this.pepe.hit();
                    this.pepe.isHurt();
                    audioHub?.playHurtSound();
                    this.statusIconPepe.setAmount(this.pepe.energy);
                }
            }

            if (this.thrownObjects.length > 0) {
                this.thrownObjects.forEach((bottle) => {
                    if (bottle.isColliding(enemy)) {
                        bottle.hasHitEnemy = true;
                        bottle.speedY = 0;
                        bottle.speedX = 0;
                        bottle.splash();
                        audioHub?.playBottleBreakSound();
                        if (enemy instanceof EndBoss) {
                            enemy.hit();
                            this.spawnBossMinions(enemy);
                            enemy.startRolling();
                            this.statusIconEndBoss.setAmount(enemy.energy);
                        } else {
                            enemy.energy = 0;
                            this.trackKill();
                            audioHub?.playChickenDeathSound();
                            // Remove enemy after delay
                            setTimeout(() => {
                                let enemyIndex = this.level.enemies.indexOf(enemy);
                                if (enemyIndex > -1) {
                                    this.level.enemies.splice(enemyIndex, 1);
                                }
                            }, 1000);
                        }


                    }
                });
            }

        });

    }


    /**
     * Checks for win/lose state and shows overlay accordingly.
     * Call this in your game loop or after relevant events.
     */
    checkGameEnd() {
        if (this.gameEnded) return;

        const endBoss = this.level.enemies.find(enemy => enemy instanceof EndBoss);
        const enemies = this.level.enemies.filter(enemy => !(enemy instanceof EndBoss));
        if (this.pepe && !this.pepe.isDead() && endBoss && endBoss.isDead()) {
            enemies.forEach((enemy) => {
                enemy.die();
            })

            audioHub?.playWinSound();
            showEndOverlay(true);
            this.startDisco();
            this.startVictoryJump();

            this.gameEnded = true;
        } else if (!this.pepe || (this.pepe && this.pepe.isDead())) {
            audioHub?.playLostSound();
            showEndOverlay(false);
            this.gameEnded = true;
        }
    }


    /**
     * Makes Pepe jump repeatedly after winning the game.
     */
    startVictoryJump() {
        this.pepe.victoryMode = true;
        IntervalHub.startInterval(() => {
            if (this.pepe && !this.pepe.isAboveGround()) {
                this.pepe.jump();
            }
        }, 600);
    }


    /**
     * Tracks enemy kills and spawns a supply pile of coins and bottles
     * in the sky near the EndBoss after 30 kills.
     */
    trackKill() {
        this.enemiesKilled++;
        this.statusIconKill.setAmount(this.enemiesKilled);
        let thresholds = [20, 40, 60, 80];
        if (thresholds[this.supplyPilesSpawned] && this.enemiesKilled >= thresholds[this.supplyPilesSpawned]) {
            this.supplyPilesSpawned++;
            this.spawnSupplyPile();
        }
    }


    /**
     * Spawns coins randomly across the level in the sky
     * and a pile of bottles near the EndBoss.
     */
    spawnSupplyPile() {
        let levelEnd = this.level.levelEndX;

        for (let i = 0; i < 15; i++) {
            let coinX = 300 + Math.random() * (levelEnd - 600);
            let coinY = 50 + Math.random() * 150;
            this.level.collectables.push(new CollectableObject('coin', coinX, coinY));
        }

        let pileX = 300 + Math.random() * (levelEnd - 800);
        for (let i = 0; i < 8; i++) {
            let bottleX = pileX + i * 45;
            this.level.collectables.push(new CollectableObject('bottle', bottleX, 350));
        }
    }


    /**
     * Spawns 3 fast, aggressive minions (chicks/chickens) at the EndBoss position
     * that jump toward Pepe to attack.
     */
    spawnBossMinions(endBoss) {
        if (endBoss.isDead()) return;
        let pepeX = this.pepe ? this.pepe.x : 0;
        let towardPepe = pepeX < endBoss.x;

        for (let i = 0; i < 3; i++) {
            let isChick = Math.random() < 0.5;
            let size = isChick ? 1.5 + Math.random() * 1.5 : 0.8 + Math.random() * 0.8;
            let minion = isChick
                ? new Chick(size, this.level.levelEndX)
                : new Chicken(size, this.level.levelEndX);

            minion.x = endBoss.x + endBoss.width / 2 + (i - 1) * 40;
            minion.y = minion.groundY;
            minion.speed = 3 + Math.random() * 2;
            minion.canJump = true;
            minion.turnAround = !towardPepe;

            // Make them jump immediately on spawn
            minion.jump(15 + Math.random() * 5);

            this.level.enemies.push(minion);
        }
    }


    startDisco() {
        const img = document.getElementById('end-screen-img');
        if (!img) return;
        let discoColors = ['#fff', '#ff0', '#0ff', '#f0f', '#0f0', '#f00', '#00f'];
        let i = 0;
        this.discoInterval = IntervalHub.startInterval(() => {
            img.style.filter = `drop-shadow(0 0 32px ${discoColors[i % discoColors.length]}) brightness(${1 + Math.random()})`;
            img.style.opacity = (i % 2 === 0) ? '1' : '0.5';
            i++;
        }, 120);
    }

}