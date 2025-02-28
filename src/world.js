import * as RAPIER from '@dimforge/rapier2d';

// Partitions a 2d world, infinite in all directions, into a grid of cells
class SpatialPartitioning {
    constructor(cellWidth, cellHeight) {
        // Dimensions of each cell
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;

        // Initialize grids for each of the 4 quadrants
        this.gridQuadrantI = []; // Quadrant I (top-right)
        this.gridQuadrantII = []; // Quadrant II (top-left)
        this.gridQuadrantIII = []; // Quadrant III (bottom-left)
        this.gridQuadrantIV = []; // Quadrant IV (bottom-right)
    }

    // Function to map an object's (x, y) coordinates to the corresponding quadrant
    getQuadrant(x, y) {
        if (x >= 0 && y >= 0) {
            return 1; // Quadrant I (top-right)
        } else if (x < 0 && y >= 0) {
            return 2; // Quadrant II (top-left)
        } else if (x < 0 && y < 0) {
            return 3; // Quadrant III (bottom-left)
        } else if (x >= 0 && y < 0) {
            return 4; // Quadrant IV (bottom-right)
        }
    }

    // Function to map a quadrant to a grid array
    getGrid(quadrant) {
        let grid;
        switch (quadrant) {
            case 1:
                grid = this.gridQuadrantI;
                break;
            case 2:
                grid = this.gridQuadrantII;
                break;
            case 3:
                grid = this.gridQuadrantIII;
                break;
            case 4:
                grid = this.gridQuadrantIV;
                break;
        }
        return grid;
    }

    // Function to map coordinates within a quadrant's grid
    getCellCoordinates(x, y, quadrant) {
        // Adjust the coordinates depending on the quadrant
        let adjustedX = x, adjustedY = y;

        if (quadrant === 2) { // Quadrant II
            adjustedX = -x;  // Invert x for Quadrant II
        } else if (quadrant === 3) { // Quadrant III
            adjustedX = -x;  // Invert x for Quadrant III
            adjustedY = -y;  // Invert y for Quadrant III
        } else if (quadrant === 4) { // Quadrant IV
            adjustedY = -y;  // Invert y for Quadrant IV
        }

        // Calculate the grid cell based on the adjusted coordinates
        const cellX = Math.floor(adjustedX / this.cellWidth);
        const cellY = Math.floor(adjustedY / this.cellHeight);
        return [cellX, cellY];
    }

    // Helper function to get the bounds of the object
    getObjectBounds(object) {
        const x1 = object.x - object.width / 2;
        const y1 = object.y - object.height / 2;
        const x2 = object.x + object.width / 2;
        const y2 = object.y + object.height / 2;
        return { x1, y1, x2, y2 };
    }

    // Add an object to the grid
    addObject(object) {
        const cells = this.getOccupiedCells(object);
        cells.forEach((cell) => {
            const quadrant = cell.quadrant;
            const grid = this.getGrid(quadrant);
            grid[cell.i][cell.j].push(object);
        });
    }

    // Retrieve objects in a specific grid cell
    getObjectsInCell(x, y) {
        const quadrant = this.getQuadrant(x, y);
        const [cellX, cellY] = this.getCellCoordinates(x, y, quadrant);

        const grid = this.getGrid(quadrant);

        // Return objects in the cell if it exists, otherwise return an empty array
        if (grid[cellX] && grid[cellX][cellY]) {
            return grid[cellX][cellY];
        }
        return [];
    }

    // Calculate the cells a bound overlaps with
    calculateCells(bounds) {
        let cells = [];
        if (bounds.x1 < 0 && bounds.x2 > 0) {
            cells.push(...this.calculateCells({
                x1: bounds.x1,
                x2: 0,
                y1: bounds.y1,
                y2: bounds.y2
            }));
            cells.push(...this.calculateCells({
                x1: 0,
                x2: bounds.x2,
                y1: bounds.y1,
                y2: bounds.y2
            }));
        } else if (bounds.y1 < 0 && bounds.y2 > 0) {
            cells.push(...this.calculateCells({
                x1: bounds.x1,
                x2: bounds.x2,
                y1: bounds.y1,
                y2: 0
            }));
            cells.push(...this.calculateCells({
                x1: bounds.x1,
                x2: bounds.x2,
                y1: 0,
                y2: bounds.y2
            }));
        } else {
            // Find the cells the object overlaps with, within one quadrant
            const quadrant = this.getQuadrant(bounds.x1, bounds.y1);
            const startIndices = this.getCellCoordinates(bounds.x1, bounds.y1, quadrant);
            const endIndices = this.getCellCoordinates(bounds.x2, bounds.y2, quadrant);
            const startX = Math.min(startIndices[0], endIndices[0]);
            const endX = Math.max(startIndices[0], endIndices[0]);
            const startY = Math.min(startIndices[1], endIndices[1]);
            const endY = Math.max(startIndices[1], endIndices[1]);
            const grid = this.getGrid(quadrant);

            // Ensure the grid is large enough to hold the object
            while (grid.length <= endX) {
                grid.push([]); // Add new rows (x-dimension)
            }
            for (let i = startX; i <= endX; i++) {
                while (grid[i].length <= endY) {
                    grid[i].push([]); // Add new columns (y-dimension)
                }
                for (let j = startY; j <= endY; j++) {
                    cells.push({
                        quadrant: quadrant,
                        i: i,
                        j: j
                    });
                }
            }
        }
        return cells;
    }

    // Recursive function to get all occupied cells by the object in its grid cells
    getOccupiedCells(object) {
        const bounds = this.getObjectBounds(object);
        const cells = [];

        cells.push(...this.calculateCells(bounds));

        return cells;
    }

    // Check if two objects intersect each other
    checkIntersect(obj1, obj2) {
        return Math.abs(obj1.x - obj2.x) < .5 * (obj1.width + obj2.width)
            && Math.abs(obj1.y - obj2.y) < .5 * (obj1.height + obj2.height);
    }

    // Check if two objects touch each other
    checkTouch(obj1, obj2) {
        return Math.abs(obj1.x - obj2.x) === .5 * (obj1.width + obj2.width)
            && Math.abs(obj1.y - obj2.y) === .5 * (obj1.height + obj2.height);
    }

    // Check if two objects intersect or touch each other
    checkIntersectOrTouch(obj1, obj2) {
        return Math.abs(obj1.x - obj2.x) <= .5 * (obj1.width + obj2.width)
            && Math.abs(obj1.y - obj2.y) <= .5 * (obj1.height + obj2.height);
    }

    // Find all objects in the partition that intersect a given object
    getIntersectingObjects(object) {
        const objects = new Set();
        // Make a slightly bigger object to get surrounding cells
        // if the object is on the edge of a cell
        const biggerObject = {
            x: object.x,
            y: object.y,
            width: object.width + .1,
            height: object.height + .1
        };

        // Loop through each cell the object occupies and borders
        this.getOccupiedCells(biggerObject).forEach((cell) => {
            // Loop through each object in each cell
            this.getGrid(cell.quadrant)[cell.i][cell.j].forEach((potentialObject) => {
                if (potentialObject in objects) return; // Early return
                if (this.checkIntersect(object, potentialObject)) {
                    objects.add(potentialObject);
                }
            });
        });

        return Array.from(objects);
    }
}

// Custom world with my own physics (not rapier) for controlling the player movement
class CustomWorld {
    objects = [];
    partitioning;
    player;
    // Temporary to test movement of player
    direction = 1;

    constructor(player) {
        this.partitioning = new SpatialPartitioning(app.settings.partitionCellWidth, app.settings.partitionCellHeight);
    }

    setPlayer(player) {
        this.player = player;
    }

    addObject(object) {
        this.objects.push(object);
        this.partitioning.addObject(object);
    }

    // Physics step and rendering update
    step() {
        // app.player.controls.canJump = false;
        this.player.velocity.y += app.settings.gravity;
        const prevX = this.player.x;
        const prevY = this.player.y;
        this.player.x += this.player.velocity.x;
        this.player.y += this.player.velocity.y;
        const ySign = Math.sign(this.player.velocity.y);
        const xSign = Math.sign(this.player.velocity.x);
        let intersectingObjects = this.partitioning.getIntersectingObjects(this.player);
        // What the x and y velocities will change to
        let newXVel = this.player.velocity.x;
        let newYVel = this.player.velocity.y;
        while (intersectingObjects.length > 0) {
            // Whether the player was moved back or not
            let playerMoved = false;
            while (intersectingObjects.length > 0) {
                // Handle intersection by moving back player required amount
                const interObj = intersectingObjects.pop();

                // Functions for handling y value and x value calculations
                function calcY(world) {
                    // The maximum (or minimum) y value the player can go to
                    const yLimit = interObj.y - .5 * ySign * (interObj.height + world.player.height);
                    if (ySign * world.player.y > ySign * yLimit && ySign * prevY <= ySign * yLimit) {
                        world.player.y = yLimit;
                        // If landing on top of a block, regain the player's jump
                        if (ySign === -1)
                            app.player.controls.canJump = app.settings.playerConstants.coyoteJumpTime;
                        playerMoved = true;
                        newYVel = 0;
                    }
                }
                function calcX(world) {
                    // The maximum (or minimum) x value the player can go to
                    const xLimit = interObj.x - .5 * xSign * (interObj.width + world.player.width);
                    if (xSign * world.player.x > xSign * xLimit && xSign * prevX <= xSign * xLimit) {
                        world.player.x = xLimit;
                        // Enable walljumping
                        //app.player.controls.canJump = true;
                        playerMoved = true;
                        newXVel = 0;
                    }
                }

                // Determining order of checking x & y
                let calc1 = calcX;
                let calc2 = calcY;
                if (Math.abs(this.player.velocity.y) <= Math.abs(this.player.velocity.x)) {
                    calc1 = calcY;
                    calc2 = calcX;
                }

                // Check in correct order, skipping the second check if possible
                calc1(this);
                if (this.partitioning.checkIntersect(interObj, this.player)) {
                    calc2(this);
                }
            }

            // Check again for intersections
            if (playerMoved)
                intersectingObjects = this.partitioning.getIntersectingObjects(this.player);
        }
        this.player.velocity = { x: newXVel, y: newYVel };
    }
}

class World {
    customWorld;
    rapierWorld;
    pixiWorld;
    dynamicObjects = [];
    staticObjects = [];
    player;

    constructor(rapierWorld, pixiWorld) {
        this.customWorld = new CustomWorld();
        this.rapierWorld = rapierWorld;
        this.pixiWorld = pixiWorld;
        // this.events = new RAPIER.EventQueue(true);
    }

    setPlayer(player) {
        this.customWorld.setPlayer(player.body);
        this.player = player;
        this.dynamicObjects.push(player);
    }

    addObject(object) {
        // object.collider.handleCollision = () => { };
        this.dynamicObjects.push(object);
        return object;
    }

    addStaticObject(object) {
        // object.collider.handleCollision = () => { };
        this.staticObjects.push(object);
        this.customWorld.addObject(object.body);
        return object;
    }

    // Update rendered position of graphics objects
    updatePosition() {
        this.dynamicObjects.forEach((obj) => {
            obj.rendered.updatePosition();
        });
    }

    // Update rendered scale of graphics objects
    updateScale() {
        this.dynamicObjects.forEach((obj) => {
            obj.rendered.updateScale();
        });
    }

    // Update rendered position of all objects
    updateAll() {
        this.updatePosition();
        this.updateScale();
        this.staticObjects.forEach((obj) => {
            obj.rendered.updatePosition();
            obj.rendered.updateScale();
        });
    }

    step() {
        this.player.updateControls();
        this.customWorld.step();
        this.player.rigidBody.setNextKinematicTranslation(this.player.body);
        this.rapierWorld.step();
        this.updatePosition();
    }

    getWorld() {
        return [...this.world];
    }
}

export { World };
