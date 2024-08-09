import * as PIXI from 'pixi.js';
import * as RAPIER from '@dimforge/rapier2d';
import { EntityFactory } from './entityFactory';

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
window.world = world;

let entityFactory = new EntityFactory();

window.ptom = 100; // pixels to metres scale

var balls = [];
for (let y = 3; y <= 10; y++) {
    for (let x = 1 + (y % 2) / 2; x <= 9; x++) {
        balls.push(entityFactory.createDynamicCircle({x: x + 3, y: y}, .5, 
            Math.round(Math.random()*0xffffff) ).renderedCircle);
    }
}
var ground = entityFactory.createFixedRectangle({x: 8, y: 0}, 8, 1, 0x000000);

// Game loop
setInterval(() => {
    // Step the physics simulation forward
    world.step();

    // Update the position of the ball graphic to match the physics body
    balls.forEach((ball) => ball.updatePosition());
}, 1000 / 60);

document.body.appendChild(app.canvas);

// Resize function
function resize() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

// Add event listener for window resize
window.addEventListener('resize', resize);
