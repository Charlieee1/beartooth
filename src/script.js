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
const player = world.addObject(entityFactory.createDynamicRectangle({x: physicsRight / 2, y: physicsTop / 2}, 1, 1.5, 0xffff00));
player.controls = {
    left: 0,
    right: 0,
    jump: false,
    speed: 6,
    maxSpeed: 10,
    slowDown: .5,
    jumpStrength: 20
};
app.player = player;

// Event listeners for player controls
window.addEventListener("keydown", e => {
    let key = e.key.toLowerCase();
    if (key == "a" || key == "arrowleft") {
        player.controls.left = -1;
    } else if (key == "d" || key == "arrowright") {
        player.controls.right = 1;
    } else if (key == "w" || key == "arrowup" || key == " ") {
        player.controls.jump = true;
    }
});

window.addEventListener("keyup", e => {
    let key = e.key.toLowerCase();
    if (key == "a" || key == "arrowleft") {
        player.controls.left = 0;
    } else if (key == "d" || key == "arrowright") {
        player.controls.right = 0;
    }
});

// Game loop
setInterval(() => {
    // Handle player moving left & right
    let sign = (player.controls.left + player.controls.right);
    let changeSpeed = sign;
    let currSpeed = player.rigidBody.linvel();
    let newSpeed = currSpeed.x;
    if (sign == 0) { // Slowdown
        sign = 1;
        if (newSpeed < 0) changeSpeed = player.controls.slowDown;
        else if (newSpeed > 0) changeSpeed = -player.controls.slowDown;
        if (Math.abs(newSpeed) <= player.controls.speed * player.controls.slowDown) {
            newSpeed = 0;
            changeSpeed = 0;
        }
    }
    newSpeed += player.controls.speed * changeSpeed;
    if (changeSpeed != 0) {
        newSpeed = sign * Math.min(sign * newSpeed, player.controls.maxSpeed);
    }
    
    // Handle player jump
    let jump = currSpeed.y;
    if (player.controls.jump) {
        jump = player.controls.jumpStrength;
        player.controls.jump = false;
    }

    player.rigidBody.setLinvel(new RAPIER.Vector2(newSpeed, jump));

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
