import * as PIXI from 'pixi.js';
import * as RAPIER from '@dimforge/rapier2d';
import { EntityFactory } from './entityFactory.js';
import { World } from './world.js';
import { Player } from './player.js';
import { settings } from './settings.js';

// Create an async main function
async function main() {
    const app = {}
    window.app = app;
    app.settings = settings;

    // Create a Pixi Application
    const Papp = new PIXI.Application();
    app.Papp = Papp;
    await Papp.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
    });

    // Create a rapier world
    const rapierWorld = new RAPIER.World({ x: 0, y: app.settings.rapierGravity });

    // Create the entity factory
    const entityFactory = new EntityFactory();
    app.entityFactory = entityFactory;

    // Create a world
    const world = new World(rapierWorld, Papp);
    app.world = world;

    window.physicsTop = window.innerHeight / app.settings.ptom;
    window.physicsRight = window.innerWidth / app.settings.ptom;

    // Create player
    const player = new Player({ x: physicsRight / 2 + 2, y: app.settings.playerHeight / 2 + .5 });
    app.player = player;
    world.setPlayer(player);

    // Set up non-player rigid-bodies
    for (let y = 2; y <= physicsTop / 2 - 2; y++) {
        for (let x = 1 + (y % 2) / 2; x <= physicsRight / 2 - 2; x++) {
            let ball = world.addObject(entityFactory.createDynamicCircle({ x: x, y: y }, .5,
                Math.round(Math.random() * 0xffffff)));
            ball.collider.setDensity(.05);
        }
    }
    const ground = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight / 2, y: 0 }, physicsRight, 1, 0x000000));
    const wall1 = world.addStaticObject(entityFactory.createFixedRectangle({ x: 0, y: physicsTop / 2 }, 1, physicsTop, 0x000000));
    const wall2 = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight, y: physicsTop / 2 }, 1, physicsTop, 0x000000));
    const wall3 = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight / 2, y: physicsTop / 8 - 1 }, 1, physicsTop / 4, 0x000000));
    const roof = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight / 2, y: physicsTop }, physicsRight, 1, 0x000000));
    const block = world.addStaticObject(entityFactory.createFixedRectangle({ x: 3 * physicsRight / 4, y: physicsTop / 4 }, 2, 2, 0x000000));

    document.body.appendChild(Papp.canvas);

    // Game loop
    setInterval(() => {
        // Step the physics simulation forward
        world.step();
    }, 1000 / 60);

    // Resize function
    function resize() {
        Papp.renderer.resize(window.innerWidth, window.innerHeight);
        world.updateAll();
    }

    // Add event listener for window resize
    window.addEventListener('resize', resize);
}

// Invoke `main` function at the end
main();
