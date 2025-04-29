// Global project constants
const settings = {
    playerWidth: 1,
    playerHeight: 1.5,
    playerColour: 0xffff00,
    playerConstants: {
        speed: .05,
        maxSpeed: .15,
        slowDown: .04,
        weakSlowDown: .005,
        jumpStrength: .3,
        additionalJumpStrength: .03,
        additionalJumpTime: 8,
        additionalJumpBuffer: 2,
        jumpSpeedBoost: .01,
        inputBufferTime: 3,
        coyoteJumpTime: 5,
        maxFallSpeed: -.6,
        horizontalCornerClip: .35,
        horizontalClipThrough: .2,
        verticalCornerClip: .25,
        verticalClipThrough: .25,
    },
    gravity: -.03,
    rapierGravity: -50,
    partitionCellWidth: 40,
    partitionCellHeight: 20,
    // Metres per window width
    mtow: 40,
    // Pixels to metres scale (rendering world to physics world)
    ptom: 40,
};
settings.partitionCellWidth = settings.mtow;
settings.partitionCellHeight = settings.mtow * 1080 / 1920;
if (window.innerWidth / window.innerHeight >= 1920 / 1080) {
    settings.ptom = window.innerWidth / settings.mtow;
} else {
    settings.ptom = window.innerHeight / (settings.mtow * 1080 / 1920);
}

export { settings };
