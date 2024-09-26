import * as RAPIER from '@dimforge/rapier2d';

class Player {
    rigidBodyDesc;
    rigidBody;
    colliderDesc;
    collider;
    rendered;
    sensorDesc;
    sensor;
    keydown;
    keyup;

    constructor(entityFactory, translation, width, height, colour) {
        let player = entityFactory.createDynamicRectangle(translation, width, height, colour);
        this.rigidBodyDesc = player.rigidBodyDesc;
        this.rigidBody = player.rigidBody;
        this.colliderDesc = player.colliderDesc;
        this.collider = player.collider;
        this.rendered = player.rendered;
        this.sensorDesc = RAPIER.ColliderDesc.cuboid(.5, 1)
            .setTranslation(0, -.75)
            .setDensity(0)
            .setSensor(true);
        this.sensor = app.world.world.createCollider(this.sensorDesc, this.rigidBody);
        this.sensor.handleCollision = event => {
            this.controls.canJump = true;
        };

        this.controls = {
            left: 0,
            right: 0,
            jump: false,
            canJump: false,
            speed: 6,
            maxSpeed: 10,
            slowDown: .5,
            jumpStrength: 20
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

        app.world.addObject(this);
    }

    updatePosition() {
        this.rendered.updatePosition();
    }

    updateControls() {
        // Handle player moving left & right
        let sign = (this.controls.left + this.controls.right);
        let changeSpeed = sign;
        let currSpeed = this.rigidBody.linvel();
        let newSpeed = currSpeed.x;
        if (sign == 0) { // Slowdown
            sign = 1;
            if (newSpeed < 0) changeSpeed = this.controls.slowDown;
            else if (newSpeed > 0) changeSpeed = -this.controls.slowDown;
            if (Math.abs(newSpeed) <= this.controls.speed * this.controls.slowDown) {
                newSpeed = 0;
                changeSpeed = 0;
            }
        }
        newSpeed += this.controls.speed * changeSpeed;
        if (changeSpeed != 0) {
            newSpeed = sign * Math.min(sign * newSpeed, this.controls.maxSpeed);
        }
        
        // Handle player jump
        let jump = currSpeed.y;
        if (this.controls.jump && this.controls.canJump) {
            jump = this.controls.jumpStrength;
        }
        this.controls.jump = false;
        this.controls.canJump = false;

        this.rigidBody.setLinvel(new RAPIER.Vector2(newSpeed, jump));
    }
}

export { Player };
