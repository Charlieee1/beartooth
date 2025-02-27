// Global project constants
const settings = {
    // Pixels to metres scale (rendering world to physics world)
    ptom: 40,
    playerWidth: 1,
    playerHeight: 1.5,
    playerColour: 0xffff00,
    playerConstants: {
        speed: .2,
        maxSpeed: .3,
        slowDown: .5,
        jumpStrength: .7
    },
    gravity: -.07,
    rapierGravity: -50,
    partitionCellWidth: 30,
    partitionCellHeight: 20
};

export { settings };
