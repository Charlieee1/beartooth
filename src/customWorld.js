import { SpatialPartitioning } from './spatialPartitioning';

// Custom world with my own physics (not rapier) for controlling the player movement
export class CustomWorld {
    objects = [];
    partitioning;
    player;
    controls;
    playerConstants;

    constructor() {
        this.partitioning = new SpatialPartitioning(app.settings.partitionCellWidth, app.settings.partitionCellHeight);
    }

    setPlayer(player) {
        this.player = player.body;
        this.controls = player.controls;
        this.playerConstants = player.playerConstants;
    }

    addObject(object) {
        this.objects.push(object);
        this.partitioning.addObject(object);
    }

    // Three utility functions used in step()
    // Function for checking if corner clipping should be done
    // Built for horizontal, can be used for vertical
    checkCornerClip(playerX, playerY, interObjX, interObjY,
        totalWidth, totalHeight, control, horizontalCornerClip, horizontalClipThrough,
        xSign, ySign, xClipSign, prevX, prevY) {
        // Check for horizontal corner clipping
        // Ensure the player is trying to move in the correct direction
        if (!(control == Math.sign(interObjX - playerX))) {
            return false;
        }
        // Ensure the player is beyond the edge horizontally
        if (!(xSign * (prevX - interObjX) + totalWidth <= 0)) {
            return false;
        }
        // Ensure the player is close enough to the edge vertically (next 2 if statements)
        let cornerClipEnabled = true;
        // Check for corner clipping
        cornerClipEnabled = Math.abs(prevY - xClipSign * totalHeight - interObjY)
            <= horizontalCornerClip;
        if (cornerClipEnabled) {
            // Ensure the player is beyond the edge vertically if corner clipping
            cornerClipEnabled = ySign * (prevY - interObjY) + totalHeight <= horizontalCornerClip;
        }
        if (cornerClipEnabled) {
            return true;
        } else {
            // Check for corner clip through
            return Math.abs(playerY - xClipSign * totalHeight - interObjY)
                <= horizontalClipThrough;
        }
    }

    // Functions for handling y value and x value calculations
    calcY(interObj, totalWidth, totalHeight, sign, newVel, prevX, prevY) {
        let playerMoved = false;
        const xSign = sign.x;
        const ySign = sign.y;

        // Top edge to side edge & bottom edge to side edge
        const verticalClipThroughSpeed = ySign === 1 ? this.playerConstants.verticalClipThroughSpeedUp : this.playerConstants.verticalClipThroughSpeedDown;
        let yClipSign = Math.sign(this.player.x - interObj.x);
        if (yClipSign === 0)
            yClipSign = 1;
        // Ensure the player is travelling quickly enough to clip
        let cornerClipEnabled = Math.abs(this.player.velocity.y) >= verticalClipThroughSpeed;
        // Ensure the player is falling from a different surface for clipping down
        if (cornerClipEnabled) {
            cornerClipEnabled = this.player.lastYSurface != interObj.y + totalHeight || ySign === 1;
        }
        // Ensure the player is not moving towards the object horizontally
        if (cornerClipEnabled) {
            cornerClipEnabled = !(this.controls.left + this.controls.right == Math.sign(interObj.x - this.player.x));
        }
        if (cornerClipEnabled) {
            cornerClipEnabled = this.checkCornerClip(this.player.y, this.player.x, interObj.y, interObj.x,
                totalHeight, totalWidth, Math.sign(this.player.velocity.y),
                0, this.playerConstants.verticalClipThrough,
                ySign, xSign, yClipSign, prevY, prevX
            );
        }

        if (cornerClipEnabled) {
            this.player.x = interObj.x + yClipSign * totalWidth;
            playerMoved = true;
        } else {
            // The maximum (or minimum) y value the player can go to
            const yLimit = interObj.y - ySign * totalHeight;
            if (ySign * this.player.y > ySign * yLimit && (ySign * prevY <= ySign * yLimit)) {
                this.player.y = yLimit;
                // If landing on top of a block, regain the player's jump
                if (ySign === -1) {
                    this.controls.canJump = app.settings.playerConstants.coyoteJumpTime;
                    this.player.lastYSurface = yLimit;
                }
                playerMoved = true;
                newVel.y = 0;
            }
        }
        return playerMoved;
    }

    calcX(interObj, totalWidth, totalHeight, sign, newVel, prevX, prevY) {
        let playerMoved = false;
        const xSign = sign.x;
        const ySign = sign.y;

        // Top corner to top edge & bottom corner to bottom edge corner clipping
        // Side edge to top edge & side edge to bottom edge
        const xClipSign = Math.sign(this.player.y - interObj.y);
        const cornerClipEnabled = this.checkCornerClip(this.player.x, this.player.y, interObj.x, interObj.y,
            totalWidth, totalHeight, app.player.controls.left + app.player.controls.right,
            this.playerConstants.horizontalCornerClip, this.playerConstants.horizontalClipThrough,
            xSign, ySign, xClipSign, prevX, prevY
        );

        if (cornerClipEnabled) {
            this.player.y = interObj.y + xClipSign * totalHeight;
            playerMoved = true;
        } else {
            // The maximum (or minimum) x value the player can go to
            const xLimit = interObj.x - xSign * totalWidth;
            if (xSign * this.player.x > xSign * xLimit && xSign * prevX <= xSign * xLimit) {
                this.player.x = xLimit;
                // Enable walljumping
                //app.player.controls.canWallJump = -xSign;
                playerMoved = true;
                newVel.x = 0;
            }
        }
        return playerMoved;
    }

    // Physics step and rendering update
    step() {
        this.player.velocity.y += app.settings.gravity;
        if (!this.controls.down) {
            this.player.velocity.y = Math.max(this.player.velocity.y,
                app.settings.playerConstants.maxFallSpeed);
        } else {
            this.player.velocity.y = Math.max(this.player.velocity.y,
                app.settings.playerConstants.maxFastFallSpeed);
            console.log(this.player.velocity.y);
        }
        const prevX = this.player.x;
        const prevY = this.player.y;
        this.player.x += this.player.velocity.x;
        this.player.y += this.player.velocity.y;
        const ySign = Math.sign(this.player.velocity.y);
        const xSign = Math.sign(this.player.velocity.x);
        const sign = { x: xSign, y: ySign };
        let intersectingObjects = this.partitioning.getIntersectingObjects(this.player);
        // What the x and y velocities will change to
        let newVel = {
            x: this.player.velocity.x,
            y: this.player.velocity.y,
        };

        while (intersectingObjects.length > 0) {
            // Whether the player was moved back or not
            let playerMoved = false;
            while (intersectingObjects.length > 0) {
                // Handle intersection by moving back player required amount
                const interObj = intersectingObjects.pop();
                const totalWidth = .5 * (this.player.width + interObj.width);
                const totalHeight = .5 * (this.player.height + interObj.height);

                // Determining order of checking x & y
                let calc1 = this.calcX.bind(this);
                let calc2 = this.calcY.bind(this);
                if (Math.abs(this.player.velocity.y) <= Math.abs(this.player.velocity.x)) {
                    calc1 = this.calcY.bind(this);
                    calc2 = this.calcX.bind(this);
                }

                // Check in correct order, skipping the second check if possible
                playerMoved = calc1(interObj, totalWidth, totalHeight, sign, newVel, prevX, prevY);
                if (this.partitioning.checkIntersect(interObj, this.player)) {
                    playerMoved |= calc2(interObj, totalWidth, totalHeight, sign, newVel, prevX, prevY);
                }
            }

            // Check again for intersections
            if (playerMoved)
                intersectingObjects = this.partitioning.getIntersectingObjects(this.player);
        }
        this.player.velocity = newVel;

        // Rounding player x position to make precise alignment of player easier
        let oldX = this.player.x;
        this.player.x = Number(this.player.x.toFixed(3));
        if (this.partitioning.getIntersectingObjects(this.player).length > 0) {
            this.player.x = oldX;
        } else {
            // TODO: remove aligning to 1 decimal place
            // Usually blocks are aligned to the first decimal place
            // For smooth movement, it's best not to align the player so harshly
            oldX = this.player.x;
            if (this.player.velocity.x == 0) {
                this.player.x = Number(this.player.x.toFixed(1));
            }
            if (this.partitioning.getIntersectingObjects(this.player).length > 0) {
                this.player.x = oldX;
            }
        }
    }
}