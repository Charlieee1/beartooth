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
        let playerEntity = app.entityFactory.createKinematicRectangle(
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
            left: 0,       // Is pressing left
            right: 0,      // Is pressing right
            jump: false,   // Is trying to jump
            canJump: false // Can jump
        };

        // Event listeners for player controls
        this.keydown = e => {
            let key = e.key.toLowerCase();
            if (key == "a" || key == "arrowleft") {
                this.controls.left = -1;
            } else if (key == "d" || key == "arrowright") {
                this.controls.right = 1;
            } else if (key == "w" || key == "arrowup" || key == " ") {
                this.controls.jump = true;
            }
        };
        this.keyup = e => {
            let key = e.key.toLowerCase();
            if (key == "a" || key == "arrowleft") {
                this.controls.left = 0;
            } else if (key == "d" || key == "arrowright") {
                this.controls.right = 0;
            }
        }
        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);
    }

    updatePosition() {
        this.rendered.updatePosition();
    }

    updateControls() {
        // Handle player moving left & right
        let sign = (this.controls.left + this.controls.right);
        let changeSpeed = sign;
        let currSpeed = this.body.velocity;
        let newSpeed = currSpeed.x;
        if (sign == 0) { // Slowdown
            sign = 1;
            if (newSpeed < 0) changeSpeed = app.settings.playerConstants.slowDown;
            else if (newSpeed > 0) changeSpeed = -app.settings.playerConstants.slowDown;
            if (Math.abs(newSpeed) <= app.settings.playerConstants.speed * app.settings.playerConstants.slowDown) {
                newSpeed = 0;
                changeSpeed = 0;
            }
        }
        newSpeed += app.settings.playerConstants.speed * changeSpeed;
        if (changeSpeed != 0) {
            newSpeed = sign * Math.min(sign * newSpeed, app.settings.playerConstants.maxSpeed);
        }

        // Handle player jump
        let jump = currSpeed.y;
        if (this.controls.jump && this.controls.canJump) {
            jump = Math.max(jump, 0) + app.settings.playerConstants.jumpStrength;
        }
        this.controls.jump = false;
        this.controls.canJump = false;

        this.body.velocity = { x: newSpeed, y: jump };
    }
}

export { Player };
