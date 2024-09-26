import * as PIXI from 'pixi.js';
import * as RAPIER from '@dimforge/rapier2d';
import { EntityFactory } from './entityFactory';
import { World } from './world.js';
import { Player } from './player.js';

window.app = {};

// Create a Pixi Application
var Papp = new PIXI.Application();
app.renderedWorld = Papp;

await Papp.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
});

// Create a world
let world = new World(new RAPIER.World({ x: 0.0, y: -50 }));
app.world = world;

let entityFactory = new EntityFactory();

window.ptom = 40; // pixels to metres scale
window.physicsTop = window.innerHeight / ptom;
window.physicsRight = window.innerWidth / ptom;

// Set up non-player rigid-bodies
for (let y = 2; y <= physicsTop - 2; y++) {
    for (let x = 1 + (y % 2) / 2; x <= physicsRight / 2 - 2; x++) {
        let ball = world.addObject(entityFactory.createDynamicCircle({x: x, y: y}, .5, 
            Math.round(Math.random()*0xffffff) ));
        ball.collider.setDensity(.05);
    }
}
const ground = world.addStaticObject(entityFactory.createFixedRectangle({x: physicsRight / 2, y: 0}, physicsRight, 1, 0x000000));
const wall1 = world.addStaticObject(entityFactory.createFixedRectangle({x: 0, y: physicsTop / 2}, 1, physicsTop, 0x000000));
const wall2 = world.addStaticObject(entityFactory.createFixedRectangle({x: physicsRight, y: physicsTop / 2}, 1, physicsTop, 0x000000));
const roof = world.addStaticObject(entityFactory.createFixedRectangle({x: physicsRight / 2, y: physicsTop}, physicsRight, 1, 0x000000));

// Create player
const player = new Player(entityFactory, {x: physicsRight / 2, y: physicsTop / 2}, 1, 1.5, 0xffff00);
app.player = player;

// Game loop
setInterval(() => {
    player.updateControls();

    // Step the physics simulation forward
    world.step();
}, 1000 / 60);

document.body.appendChild(Papp.canvas);

// Resize function
function resize() {
    Papp.renderer.resize(window.innerWidth, window.innerHeight);
    world.updateAll();
}

// Add event listener for window resize
window.addEventListener('resize', resize);
