import lerp from 'lerp';

class Player {
    body;
    rigidBodyDesc;
    rigidBody;
    colliderDesc;
    collider;
    rendered;
    keydown;
    keyup;

    controls;
    playerConstants;

    constructor(position) {
        const playerEntity = app.entityFactory.createKinematicRectangle(
            position,
            app.settings.playerWidth,
            app.settings.playerHeight,
            app.settings.playerColour
        );
        this.body = playerEntity.body;
        this.body.lastYSurface = null;
        this.rigidBodyDesc = playerEntity.rigidBodyDesc;
        this.rigidBody = playerEntity.rigidBody;
        this.colliderDesc = playerEntity.colliderDesc;
        this.collider = playerEntity.collider;
        this.rendered = playerEntity.rendered;
        this.playerConstants = app.settings.playerConstants;
        // this.sensorDesc = RAPIER.ColliderDesc.cuboid(.5, 1)
        //     .setTranslation(0, -.75)
        //     .setDensity(0)
        //     .setSensor(true);
        // this.sensor = app.world.world.createCollider(this.sensorDesc, this.rigidBody);
        // this.sensor.handleCollision = event => {
        //     this.controls.canJump = true;
        // };

        this.controls = {
            left: 0,             // Is pressing left
            right: 0,            // Is pressing right
            jump: 0,             // Is trying to jump - greater than 0 means true, 0 means false
            canJump: 0,          // Can jump - greater than 0 means true, 0 means false
            pressingJump: false, // Is pressing a jump button
            isJumping: 0,        // Is currently jumping - greater than 0 means true, 0 means false
            slowDownDisabled: 0, // Is slowdown (two types) disabled
            down: false,         // Is pressing down
        };

        // Event listeners for player controls
        this.keydown = e => {
            let key = e.key.toLowerCase();
            if (key == "a" || key == "arrowleft") {
                this.controls.left = -1;
            } else if (key == "d" || key == "arrowright") {
                this.controls.right = 1;
            } else if ((key == "w" || key == "arrowup" || key == " " || key == "c") && !this.controls.pressingJump) {
                this.jump();
                this.controls.pressingJump = true;
            } else if (key == "x") {
                this.body.velocity.x *= 3;
                this.body.velocity.y *= 1.5;
            } else if (key == "s" || key == "arrowdown") {
                this.controls.down = true;
            }
        };
        this.keyup = e => {
            let key = e.key.toLowerCase();
            if (key == "a" || key == "arrowleft") {
                this.controls.left = 0;
            } else if (key == "d" || key == "arrowright") {
                this.controls.right = 0;
            } else if (key == "w" || key == "arrowup" || key == " " || key == "c") {
                this.controls.pressingJump = false;
            } else if (key == "s" || key == "arrowdown") {
                this.controls.down = false;
            }
        }
        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);
    }

    jump() {
        this.controls.jump = app.settings.playerConstants.inputBufferTime;
    }

    updatePosition() {
        this.rendered.updatePosition();
    }

    updateControls() {
        const playerConstants = app.settings.playerConstants;
        // Handle player moving left & right
        let sign = (this.controls.left + this.controls.right);
        let currSpeed = this.body.velocity;
        let newSpeed = currSpeed.x;
        let currSign = Math.sign(newSpeed);
        let xSpeed = newSpeed * currSign;
        if (sign != currSign) { // Normal slowdown
            newSpeed -= currSign * Math.min(playerConstants.slowDown,
                currSign * newSpeed);
        }
        if (this.controls.slowDownDisabled != 0) {
            if (sign == currSign && xSpeed > playerConstants.maxSpeed) { // Weaker slowdown
                newSpeed -= playerConstants.weakSlowDown * currSign;
                if (xSpeed - playerConstants.weakSlowDown < playerConstants.maxSpeed) {
                    newSpeed = playerConstants.maxSpeed * currSign;
                }
            } else { // Acceleration
                newSpeed += playerConstants.speed * sign;
                // Limit speed
                if (sign != 0) {
                    newSpeed = sign * Math.min(sign * newSpeed, playerConstants.maxSpeed);
                }
            }
        } else {
            this.controls.slowDownDisabled--;
        }

        // Handle player jump
        let jump = currSpeed.y;
        if (this.controls.jump != 0 && this.controls.canJump != 0) {
            jump = Math.max(jump, 0) + playerConstants.jumpStrength;
            this.controls.jump = 0;
            this.controls.canJump = 0;
            this.controls.isJumping = playerConstants.additionalJumpTime
                + playerConstants.additionalJumpBuffer;

            // Add temporary speedboost for jumping while holding an arrow key
            if (sign != 0) {
                newSpeed += playerConstants.jumpSpeedBoost * sign;
                this.controls.slowDownDisabled = 1
            }
        } else {
            if (this.controls.jump != 0)
                this.controls.jump -= 1;
            if (this.controls.canJump != 0)
                this.controls.canJump -= 1;
        }
        // Handle player holding jump
        if (this.controls.pressingJump && this.controls.isJumping != 0
            && this.controls.isJumping <= playerConstants.additionalJumpTime) {
            jump += playerConstants.additionalJumpStrength;
            this.controls.isJumping--;
        } else if (this.controls.pressingJump == false) {
            this.controls.isJumping = 0;
        } else if (this.controls.isJumping != 0) {
            this.controls.isJumping--;
        }

        this.body.velocity = { x: newSpeed, y: jump };
    }

    update() {
        if (this.lerp) {
            this.lerp.progress++;
            if (!this.setSize(
                Math.round(lerp(this.lerp.oldWidth, this.lerp.width, this.lerp.delta * this.lerp.progress)),
                Math.round(lerp(this.lerp.oldHeight, this.lerp.height, this.lerp.delta * this.lerp.progress))
            ))
                this.lerp.progress--; // This can lead to weird (and very fun!) behaviour
            else if (this.lerp.progress === this.lerp.frames)
                this.lerp = false;
        }
    }

    lerpSize(frames, width = -1, height = -1, preserveArea = true) {
        const oldWidth = this.body.width;
        const oldHeight = this.body.height;
        const prevArea = oldWidth * oldHeight;
        if (preserveArea) {
            if (height === -1)
                height = prevArea / width;
            else if (width === -1)
                width = prevArea / height;
        }
        this.lerp = {
            progress: 0,
            delta: 1 / frames,
            frames: frames,
            oldWidth: oldWidth,
            oldHeight: oldHeight,
            width: width,
            height: height
        }
    }

    setSize(width = -1, height = -1, preserveArea = true) {
        const oldX = this.body.x;
        const oldY = this.body.y;
        const oldWidth = this.body.width;
        const oldHeight = this.body.height;
        const prevArea = oldWidth * oldHeight;
        if (preserveArea) {
            if (height === -1)
                height = prevArea / width;
            else if (width === -1)
                width = prevArea / height;
        }

        this.body.y = oldY + .5 * (-oldHeight + height);
        this.body.width = width;
        this.body.height = height;

        if (app.world.customWorld.partitioning.getIntersectingObjects(this.body).length > 0) {
            this.body.y = oldY
            this.body.width = oldWidth;
            this.body.height = oldHeight;
            return false;
        }

        width *= .5;
        height *= .5;
        this.rigidBody.setNextKinematicTranslation(this.body);
        // this.colliderDesc.setTranslation(this.body.x, this.body.y);
        this.colliderDesc.shape.halfExtents.x = width;
        this.colliderDesc.shape.halfExtents.y = height;
        // this.collider.setTranslation(this.body);
        this.collider.setHalfExtents({ x: width, y: height });
        this.rendered.updatePosition();
        this.rendered.updateScale();
        return true;
    }
}

export { Player };
