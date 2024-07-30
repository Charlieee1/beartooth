import * as PIXI from 'pixi.js';
import { World, RigidBody, RigidBodyType, Collider, Ball } from '@dimforge/rapier2d';

// Create a Pixi Application
let app = new PIXI.Application();

(async () => {
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
    });
/*
    // Create a Rapier physics world
    let world = new World({ gravity: { x: 0.0, y: -9.81 } });

    // Create a dynamic RigidBody (a moving ball)
    let rigidBodyDesc = RigidBody.desc.newDynamic().setTranslation(400, 300);
    let rigidBody = world.createRigidBody(rigidBodyDesc);
    let colliderDesc = Collider.desc.ball(50.0);
    world.createCollider(colliderDesc, rigidBody.handle);

    // Create a static RigidBody (the ground)
    let groundDesc = RigidBody.desc.newStatic();
    let ground = world.createRigidBody(groundDesc);
    let groundColliderDesc = Collider.desc.cuboid(800.0, 50.0);
    world.createCollider(groundColliderDesc, ground.handle);

    // Create a Pixi Graphics object to represent the ball
    let ball = new PIXI.Graphics();
    ball.fill(0xff0000).circle(0, 0, 50).close();
    app.stage.addChild(ball);

    // Game loop
    app.ticker.add(() => {
        // Step the physics simulation forward
        world.step();

        // Update the position of the ball graphic to match the physics body
        let ballPos = rigidBody.translation();
        ball.x = ballPos.x;
        ball.y = ballPos.y;
    });
*/
    document.body.appendChild(app.canvas);
})();

// Resize function
function resize() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

// Add event listener for window resize
window.addEventListener('resize', resize);
