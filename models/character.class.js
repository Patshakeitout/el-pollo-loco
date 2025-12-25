/**
 * Character class that extends MovableObject
 */
class Character extends MovableObject {
    speed = 5;
    currentImage = 0;

    IMAGES_WALKING = [
        'assets/images/2_character_pepe/2_walk/W-21.png',
        'assets/images/2_character_pepe/2_walk/W-22.png',
        'assets/images/2_character_pepe/2_walk/W-23.png',
        'assets/images/2_character_pepe/2_walk/W-24.png',
        'assets/images/2_character_pepe/2_walk/W-25.png',
        'assets/images/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'assets/images/2_character_pepe/3_jump/J-31.png',
        'assets/images/2_character_pepe/3_jump/J-32.png',
        'assets/images/2_character_pepe/3_jump/J-33.png',
        'assets/images/2_character_pepe/3_jump/J-34.png',
        'assets/images/2_character_pepe/3_jump/J-35.png',
        'assets/images/2_character_pepe/3_jump/J-36.png',
        'assets/images/2_character_pepe/3_jump/J-37.png',
        'assets/images/2_character_pepe/3_jump/J-38.png',
        'assets/images/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [
        'assets/images/2_character_pepe/1_idle/idle/I-1.png',
        'assets/images/2_character_pepe/1_idle/idle/I-2.png',
        'assets/images/2_character_pepe/1_idle/idle/I-3.png',
        'assets/images/2_character_pepe/1_idle/idle/I-4.png',
        'assets/images/2_character_pepe/1_idle/idle/I-5.png',
        'assets/images/2_character_pepe/1_idle/idle/I-6.png',
        'assets/images/2_character_pepe/1_idle/idle/I-7.png',
        'assets/images/2_character_pepe/1_idle/idle/I-8.png',
        'assets/images/2_character_pepe/1_idle/idle/I-9.png',
        'assets/images/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'assets/images/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/images/2_character_pepe/1_idle/long_idle/I-20.png'
    ];


    constructor() {
        super().loadImage('assets/images/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.applyGravity();
        this.animate();
    }


    animate_old() {
        // IntervalHub.startInterval(() => {
        //     if (this.isAboveGround()) {
        //         this.playAnimation(this.IMAGES_JUMPING);
        //     }
        // }, 150);

        // Inside character.class.js -> animate()

        IntervalHub.startInterval(() => {
            // 1. Is the character in the air?
            if (this.isAboveGround()) {

                // Jumping UP (Positive Speed)
                if (this.speedY > 0) {
                    // Check how fast we are going to decide which "rise" image to show
                    if (this.speedY > 15) {
                        this.playAnimation(this.IMAGES_JUMPING.slice(1, 2)); // J-32 Start Rise
                    } else if (this.speedY > 5) {
                        this.playAnimation(this.IMAGES_JUMPING.slice(2, 3)); // J-33 Mid Rise
                    } else {
                        this.playAnimation(this.IMAGES_JUMPING.slice(3, 4)); // J-34 End Rise
                    }
                }

                // Falling DOWN (Negative Speed)
                else if (this.speedY < -15) {
                    this.playAnimation(this.IMAGES_JUMPING.slice(7, 8)); // J-38 Fast Fall
                } else if (this.speedY < -5) {
                    this.playAnimation(this.IMAGES_JUMPING.slice(6, 7)); // J-37 Mid Fall
                } else if (this.speedY <= 0) {
                    // PEAK of the jump (Speed is near 0)
                    this.playAnimation(this.IMAGES_JUMPING.slice(4, 5)); // J-35 Peak
                }

            } else {
                // Character is on the ground
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, this.FT * 4); // Update cycle can be slightly slower for image swapping


        IntervalHub.startInterval(() => {
            let maxCameraX = -(this.world.level.levelEndX - this.world.canvas.width);
            let targetCameraX = -this.x + 40;
            this.world.cameraX = Math.max(maxCameraX, targetCameraX);

            const minLeft = this.world.cameraX - this.world.canvas.width * 2 + this.width;
            let maxRight = this.world.level.levelEndX - 40 - this.width;

            if (this.world.keyboard.RIGHT && this.x < maxRight) {
                this.x += this.speed;
                this.turnAround = false;
            }

            if (this.world.keyboard.LEFT && this.x > minLeft) {
                this.x -= this.speed;
                this.turnAround = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.speedY = 20;
            }

        }, this.FT);

        IntervalHub.startInterval(() => {

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, this.FT * 5.5);
    }


    animate() {
        IntervalHub.startInterval(() => {
            let maxCameraX = -(this.world.level.levelEndX - this.world.canvas.width);
            let targetCameraX = -this.x + 40;
            this.world.cameraX = Math.max(maxCameraX, targetCameraX);

            const minLeft = this.world.cameraX - this.world.canvas.width * 2 + this.width;
            let maxRight = this.world.level.levelEndX - 40 - this.width;

            if (this.world.keyboard.RIGHT && this.x < maxRight) {
                this.moveRight();
                this.turnAround = false;
                //this.walking_sound.play();
            }

            if (this.world.keyboard.LEFT && this.x > minLeft) {
                this.moveLeft();
                this.turnAround = true;
                //this.walking_sound.play();
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }
        }, this.FT);


        IntervalHub.startInterval(() => {

            if (this.isAboveGround()) {
                this.playJumpAnimation();
            }

            else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            }

            else {
                this.playAnimation(this.IMAGES_IDLE);
            }

        }, this.FT * 6.2);

    }


    playJumpAnimation() {
        if (this.speedY > 0) {
            if (this.speedY > 15) this.playAnimation(this.IMAGES_JUMPING.slice(1, 2));
            else if (this.speedY > 5) this.playAnimation(this.IMAGES_JUMPING.slice(2, 3));
            else this.playAnimation(this.IMAGES_JUMPING.slice(3, 4));
        } else {
            if (this.speedY < -15) this.playAnimation(this.IMAGES_JUMPING.slice(7, 8));
            else if (this.speedY < -5) this.playAnimation(this.IMAGES_JUMPING.slice(6, 7));
            else this.playAnimation(this.IMAGES_JUMPING.slice(4, 5));
        }
    }

}