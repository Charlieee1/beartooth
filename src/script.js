// import * as PIXI from 'pixi.js';
import('@dimforge/rapier2d').then(RAPIER => {
    // Create a Pixi Application
    // var app = new PIXI.Application();
    // window.app = app;

    // await (async function() {
    //     await app.init({
    //         width: window.innerWidth,
    //         height: window.innerHeight,
    //         backgroundColor: 0x1099bb,
    //         resolution: window.devicePixelRatio || 1,
    //     });
    // })();

    // Create a Rapier physics world
    let world = new RAPIER.World({ gravity: { x: 0.0, y: -9.81 } });
    // app.world = world;

    // Create a dynamic RigidBody (a moving ball)
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(400, 300);
    let rigidBody = world.createRigidBody(rigidBodyDesc);
    // Create a collider attached to the dynamic rigidBody
    let colliderDesc = RAPIER.ColliderDesc.ball(50.0);
    let collider = world.createCollider(colliderDesc, rigidBody);
    /*
    // Create a static RigidBody (the ground)
    let groundDesc = RigidBody.desc.newStatic();
    let ground = world.createRigidBody(groundDesc);
    let groundColliderDesc = Collider.desc.cuboid(800.0, 50.0);
    world.createCollider(groundColliderDesc, ground.handle);
    */
    // Create a Pixi Graphics object to represent the ball
    // let ball = new PIXI.Graphics();
    // ball.fill(0xff0000).circle(400, 300, 50).closePath();
    // app.stage.addChild(ball);

    // Game loop
    setInterval(() => {
        // Get and print the rigid-body's position.
        let position = rigidBody.translation();
        console.log("Rigid-body position: ", position.x, position.y);

        // Step the physics simulation forward
        world.step();

        // Update the position of the ball graphic to match the physics body
        // let ballPos = rigidBody.translation();
        // ball.x = ballPos.x;
        // ball.y = ballPos.y;
    }, 1000 / 60);

    // document.body.appendChild(app.canvas);

    // Resize function
    // function resize() {
    //     app.renderer.resize(window.innerWidth, window.innerHeight);
    // }

    // // Add event listener for window resize
    // window.addEventListener('resize', resize);
});
