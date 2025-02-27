// Global project constants
const settings = {
    // Pixels to metres scale (rendering world to physics world)
    ptom: 40,
    playerWidth: 1,
    playerHeight: 1.5,
    playerColour: 0xffff00,
    playerConstants: {
        speed: 6,
        maxSpeed: 10,
        slowDown: .5,
        jumpStrength: 2
    },
    gravity: -50,
    partitionCellWidth: 30,
    partitionCellHeight: 20
};

export { settings };
