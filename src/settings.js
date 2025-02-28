// Global project constants
const settings = {
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
    partitionCellHeight: 20,
    // Metres per window width
    mtow: 30,
    // Pixels to metres scale (rendering world to physics world)
    ptom: 40
};
settings.ptom = window.innerWidth / settings.mtow;

export { settings };
