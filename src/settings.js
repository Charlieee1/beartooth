// Global project constants
const settings = {
    playerWidth: 1,
    playerHeight: 1.5,
    playerColour: 0xffff00,
    playerConstants: {
        speed: .05,
        maxSpeed: .15,
        slowDown: .05,
        jumpStrength: .3,
        additionalJumpStrength: .03,
        additionalJumpTime: 8,
        additionalJumpBuffer: 2,
        inputBufferTime: 3,
        coyoteJumpTime: 5,
        maxFallSpeed: -.6
    },
    gravity: -.03,
    rapierGravity: -50,
    partitionCellWidth: 40,
    partitionCellHeight: 20,
    // Metres per window width
    mtow: 40,
    // Pixels to metres scale (rendering world to physics world)
    ptom: 40
};
settings.partitionCellWidth = settings.mtow;
settings.partitionCellHeight = settings.mtow * 1080 / 1920;
settings.ptom = window.innerWidth / settings.mtow;

export { settings };
