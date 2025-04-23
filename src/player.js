import * as RAPIER from '@dimforge/rapier2d';

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
    constants;

    constructor(position) {
        const playerEntity = app.entityFactory.createKinematicRectangle(
            position,
            app.settings.playerWidth,
            app.settings.playerHeight,
            app.settings.playerColour
        );
        this.body = playerEntity.body;
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

        this.constants = app.settings.playerControls;
        this.controls = {
            left: 0,             // Is pressing left
            right: 0,            // Is pressing right
            jump: 0,             // Is trying to jump - greater than 0 means true, 0 means false
            canJump: 0,          // Can jump - greater than 0 means true, 0 means false
            pressingJump: false, // Is pressing a jump button
            isJumping: 0         // Is currently jumping - greater than 0 means true, 0 means false
        };

        // Event listeners for player controls
        this.keydown = e => {
            let key = e.key.toLowerCase();
            if (key == "a" || key == "arrowleft") {
                this.controls.left = -1;
            } else if (key == "d" || key == "arrowright") {
                this.controls.right = 1;
            } else if ((key == "w" || key == "arrowup" || key == " " || key == "c") && !this.controls.pressingJump) {
                this.controls.jump = app.settings.playerConstants.inputBufferTime;
                this.controls.pressingJump = true;
            } else if (key == "x") {
                this.body.velocity.x *= 3;
                this.body.velocity.y *= 1.5;
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
            }
        }
        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);
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
        let rounding = 2;
        if (sign != currSign) { // Normal slowdown
            newSpeed -= currSign * Math.min(playerConstants.slowDown,
                currSign * newSpeed);
        }
        if (sign == currSign && xSpeed > playerConstants.maxSpeed) { // Weaker slowdown
            newSpeed -= playerConstants.weakSlowDown * currSign;
            if (xSpeed - playerConstants.weakSlowDown < playerConstants.maxSpeed) {
                newSpeed = playerConstants.maxSpeed * currSign;
            }
            rounding = 3;
        } else { // Acceleration
            newSpeed += playerConstants.speed * sign;
            // Limit speed
            if (sign != 0) {
                newSpeed = sign * Math.min(sign * newSpeed, playerConstants.maxSpeed);
            }
        }
        newSpeed = Number(newSpeed.toFixed(rounding));

        // Handle player jump
        let jump = currSpeed.y;
        if (this.controls.jump != 0 && this.controls.canJump != 0) {
            jump = Math.max(jump, 0) + playerConstants.jumpStrength;
            this.controls.jump = 0;
            this.controls.canJump = 0;
            this.controls.isJumping = playerConstants.additionalJumpTime
                + playerConstants.additionalJumpBuffer;
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

        console.log(newSpeed);

        this.body.velocity = { x: newSpeed, y: jump };
    }
}

export { Player };
