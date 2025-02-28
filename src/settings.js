// Global project constants
const settings = {
    playerWidth: 1,
    playerHeight: 1.5,
    playerColour: 0xffff00,
    playerConstants: {
        speed: .1,
        maxSpeed: .2,
        slowDown: .1,
        jumpStrength: .5,
        inputBufferTime: 3,
        coyoteJumpTime: 3
    },
    gravity: -.04,
    rapierGravity: -50,
    partitionCellWidth: 40,
    partitionCellHeight: 20,
    // Metres per window width
    mtow: 40,
    // Pixels to metres scale (rendering world to physics world)
    ptom: 40
};
settings.ptom = window.innerWidth / settings.mtow;

export { settings };
