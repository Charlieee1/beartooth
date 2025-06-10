// Global project constants
const settings = {
    playerWidth: 1e3,
    playerHeight: 1.5e3,
    playerColour: 0xffff00,
    playerConstants: {
        speed: .08e3,
        maxSpeed: .15e3,
        slowDown: .05e3,
        weakSlowDown: .005e3,
        jumpStrength: .34e3,
        additionalJumpStrength: .03e3,
        additionalJumpTime: 8,
        additionalJumpBuffer: 2,
        jumpSpeedBoost: .01e3,
        inputBufferTime: 3,
        coyoteJumpTime: 8,
        maxFallSpeed: -.6e3,
        maxFastFallSpeed: -1.2e3,
        fastFallWidth: .8e3,
        fastFallHeight: 1.8e3,
        lerpFastFall1: 2,
        lerpFastFall2: 5,
        horizontalCornerClip: .35e3,
        horizontalClipThrough: .2e3,
        verticalClipThroughSpeedUp: .15e3,
        verticalClipThroughSpeedDown: .3e3,
        verticalClipThrough: .2e3,
    },
    gravity: -.03e3,
    rapierGravity: -50e3,
    partitionCellWidth: 40e3,
    partitionCellHeight: 20e3,
    // Metres per window width
    mtow: 40e3,
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
