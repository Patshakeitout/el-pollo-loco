class World {
    pepe = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    turnAround = false;
    statusIconPepe = new StatusIcon('healthPepe', 20, 9, 50, 50, 100);
    statusIconCoin = new StatusIcon('coin', 101, 12.5, 45, 45, 0);
    statusIconBottle = new StatusIcon('bottle', 166, 15, 55, 40, 10);
    statusIconEndBoss = new StatusIcon('healthEndBoss', 242, 17, 40, 40, 100);
    thrownObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.draw();
        this.setWorld();
        this.run();
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.cameraX, 0);

        this.addObjectsToMap(this.level.backgrounds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.collectables);
        if (this.pepe) this.addToMap(this.pepe);
        this.addObjectsToMap(this.thrownObjects);

        this.ctx.translate(-this.cameraX, 0);

        // --- Space for fixed objects in canvas ---
        this.addToMap(this.statusIconPepe);
        this.addToMap(this.statusIconCoin);
        this.addToMap(this.statusIconBottle);
        this.addToMap(this.statusIconEndBoss);

        this.ctx.translate(this.cameraX, 0);

        this.ctx.translate(-this.cameraX, 0);

        requestAnimationFrame(() => this.draw());
    }


    addToMap(mo) {

        if (mo.turnAround) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo instanceof MovableObject) {
            //mo.drawCollisionBox(this.ctx, mo.x, mo.y, mo.width, mo.height);
            //mo.drawCollisionCenter(this.ctx, mo.x, mo.y, mo.width, mo.height);
            mo.updateOffsetBox();
            //mo.drawOffsetBox(this.ctx);
        }

        if (mo.turnAround) {
            this.flipImageBack(mo);
        }
    };


    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }


    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
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
                    this.statusIconCoin.amount += 1;
                    audioHub?.playCoinSound();
                    // Each coin refills 5 health points
                    if (this.pepe.energy < 100) {
                        this.pepe.energy = Math.min(100, this.pepe.energy + 2);
                        this.statusIconPepe.setAmount(this.pepe.energy);
                    }
                } else if (collectable.type === 'bottle') {
                    this.statusIconBottle.amount += 1;
                    audioHub?.playBottleCollectSound();
                }

                this.level.collectables.splice(index, 1);
            }
        });
    }


    checkThrowObjects() {
        if (this.keyboard.ENTER) {

            if (this.statusIconBottle.amount == 0) {

                return;
            }

            // Determine throw direction based on Pepe's facing direction
            let throwDirection = this.pepe.turnAround ? -9 : 9;
            let bottle;
            if (throwDirection == 9) {
                bottle = new ThrowableObject(this.pepe.x + this.pepe.width / 2, this.pepe.y + 100, throwDirection);
            } else {
                bottle = new ThrowableObject(this.pepe.x, this.pepe.y + 100, throwDirection);
            }
            bottle.world = this;
            this.thrownObjects.push(bottle);
            this.statusIconBottle.amount -= 1;

        }
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
                            enemy.startRolling();
                            this.statusIconEndBoss.setAmount(enemy.energy);
                        } else {
                            enemy.energy = 0;
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

            this.gameEnded = true;
        } else if (!this.pepe || (this.pepe && this.pepe.isDead())) {
            showEndOverlay(false);
            this.gameEnded = true;
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