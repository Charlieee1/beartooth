import * as PIXI from 'pixi.js';
import * as RAPIER from '@dimforge/rapier2d';

// Create a Pixi Application
var app = new PIXI.Application();
window.app = app;

await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
});

// Create a Rapier physics world
let world = new RAPIER.World({ x: 0.0, y: -9.81 });
app.world = world;

const ptom = 100; // pixels to metres scale

// Create a dynamic RigidBody (a moving ball)
let ballDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(5, 5);
let ballBody = world.createRigidBody(ballDesc);
// Create a collider attached to the dynamic rigidBody
let ballColliderDesc = RAPIER.ColliderDesc.ball(.5);
let ballCollider = world.createCollider(ballColliderDesc, ballBody);

// Create a static RigidBody (the ground)
let groundDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(.75, 0);
let groundBody = world.createRigidBody(groundDesc);
let groundColliderDesc = RAPIER.ColliderDesc.cuboid(4, .5);
world.createCollider(groundColliderDesc, groundBody);

// Create a Pixi Graphics object to represent the ball
let ball = new PIXI.Graphics();
ball.circle(0, 0, .5 * ptom).fill(0xff0000);
app.stage.addChild(ball);

let ground = new PIXI.Graphics();
ground.rect(0, 0, 8 * ptom, 1 * ptom).fill(0x00ff00);
app.stage.addChild(ground);
let groundPos = groundBody.translation();
let size = groundColliderDesc.shape.halfExtents;
ground.x = ptom * (groundPos.x - size.x);
ground.y = app.screen.height - ptom * (groundPos.y + size.y);

// Game loop
setInterval(() => {
    // Get and print the rigid-body's position.
    // let position = ballBody.translation();
    // console.log("Rigid-body position: ", position.x, position.y);

    // Step the physics simulation forward
    world.step();

    // Update the position of the ball graphic to match the physics body
    let ballPos = ballBody.translation();
    ball.x = ptom * ballPos.x;
    ball.y = app.screen.height - ptom * ballPos.y;
}, 1000 / 60);

document.body.appendChild(app.canvas);

// Resize function
function resize() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

// Add event listener for window resize
window.addEventListener('resize', resize);
