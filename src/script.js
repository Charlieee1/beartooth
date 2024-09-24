import * as PIXI from 'pixi.js';
import * as RAPIER from '@dimforge/rapier2d';
import { EntityFactory } from './entityFactory';
import { World } from './world.js';

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
let world = new World(new RAPIER.World({ x: 0.0, y: -9.81 }));
app.world = world;

let entityFactory = new EntityFactory();

window.ptom = 30; // pixels to metres scale

// Set up non-player rigid-bodies
for (let y = 7; y <= 10; y++) {
    for (let x = 1 + (y % 2) / 2; x <= 9; x++) {
        world.addObject(entityFactory.createDynamicCircle({x: x + 3, y: y}, .5, 
            Math.round(Math.random()*0xffffff) ));
    }
}
world.addStaticObject(entityFactory.createFixedRectangle({x: 8, y: 0}, 8, 1, 0x000000));

// Create player
const player = world.addObject(entityFactory.createDynamicRectangle({x: 8, y: 5}, 1, 1.5, 0xffff00));
player.collider.setFriction(0);
player.collider.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Multiply);
player.controls = {
    left: 0,
    right: 0
};

// Event listeners for player controls
window.addEventListener("keydown", e => {
    if (e.key == "a" || e.key == "ArrowLeft") {
        player.controls.left = -1;
    } else if (e.key == "d" || e.key == "ArrowRight") {
        player.controls.right = 1;
    }
});

window.addEventListener("keyup", e => {
    if (e.key == "a" || e.key == "ArrowLeft") {
        player.controls.left = 0;
    } else if (e.key == "d" || e.key == "ArrowRight") {
        player.controls.right = 0;
    }
});

// Game loop
setInterval(() => {
    // Handle player inputs
    // TODO

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
