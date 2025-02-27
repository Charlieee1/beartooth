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
        // TODO: Physics
        this.player.y += this.direction * .1;
        if (this.player.y <= app.settings.playerHeight / 2 + .5) {
            this.direction = 1;
        } else if (this.player.y >= physicsTop - 2) {
            this.direction = -1;
        }
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

    // Update rendered position of all objects
    updateAll() {
        this.updatePosition();
        this.staticObjects.forEach((obj) => {
            obj.rendered.updatePosition();
        });
    }

    step() {
        this.player.updateControls();
        this.customWorld.step();
        this.player.rigidBody.setTranslation(this.player.body);
        this.rapierWorld.step();
        this.updatePosition();
    }

    getWorld() {
        return [...this.world];
    }
}

export { World };
