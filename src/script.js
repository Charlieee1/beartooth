import * as PIXI from 'pixi.js';
import * as RAPIER from '@dimforge/rapier2d';
import { EntityFactory } from './entityFactory.js';
import { World } from './world.js';
import { Player } from './player.js';
import { settings } from './settings.js';
import { Ticker } from './Ticker.js';

// Create an async main function
async function main() {
    const app = {}
    window.app = app;
    app.settings = settings;
    app.paused = false;

    // Create a Pixi Application
    const Papp = new PIXI.Application();
    app.Papp = Papp;
    await Papp.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
    });

    // Pixi canvas fix for chrome
    Papp.canvas.style.width = "100%";
    Papp.canvas.style.height = "100%";

    // Create a rapier world
    const rapierWorld = new RAPIER.World({ x: 0, y: app.settings.rapierGravity });

    // Create the entity factory
    const entityFactory = new EntityFactory();
    app.entityFactory = entityFactory;

    // Create a world
    const world = new World(rapierWorld, Papp);
    app.world = world;

    window.physicsTop = app.settings.mtow * 1080 / 1920;
    window.physicsRight = app.settings.mtow;

    // Create player
    const player = new Player({ x: 3 * physicsRight / 4 + 2, y: app.settings.playerHeight / 2 + .5 });
    app.player = player;
    world.setPlayer(player);

    // Set up non-player rigid-bodies
    for (let y = 1; y <= 4; y++) {
        for (let x = 1 + (y % 2) / 2; x <= 3 * physicsRight / 4 - 10; x++) {
            let ball = world.addObject(entityFactory.createDynamicCircle({ x: x, y: y }, .5,
                Math.round(Math.random() * 0xffffff)));
            ball.collider.setDensity(.05);
        }
    }
    const ground = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight / 2, y: 0 }, physicsRight, 1, 0x000000));
    const wall1 = world.addStaticObject(entityFactory.createFixedRectangle({ x: 0, y: physicsTop / 2 }, 1, physicsTop, 0x000000));
    const wall2 = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight, y: physicsTop / 2 }, 1, physicsTop, 0x000000));
    const wall3 = world.addStaticObject(entityFactory.createFixedRectangle({ x: 3 * physicsRight / 4, y: 1.5 }, 1, 2.5, 0x000000));
    const wall4 = world.addStaticObject(entityFactory.createFixedRectangle({ x: 3 * physicsRight / 4 - 8, y: 1.5 }, 1, 2.5, 0x000000));
    // const wall5 = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight / 4 + 4, y: 1.5 }, 1, 2.5, 0x000000));
    const roof = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight / 2, y: physicsTop }, physicsRight, 1, 0x000000));
    const blockData = [
        [7 * physicsRight / 8, 4],
        [3 * physicsRight / 4 - 4, 4],
        [3 * physicsRight / 4 - 8, 6.5],
        [3 * physicsRight / 4 - 3, 9],
        [3 * physicsRight / 4 - 12, 9.5],
        [3 * physicsRight / 4 - 16, 12.5],
        [3 * physicsRight / 4 - 17, 13.5],
        [7 * physicsRight / 8 + 2.5, 7],
        [physicsRight - .5, 10],
        [physicsRight - 4, 12],
        [physicsRight - 5.1, 12.2],
        [physicsRight - 6.2, 12.4],
        [physicsRight / 4 - .8, 15.5],
        [physicsRight / 4 - 1.8, 9.9],
    ];
    for (let i = 0; i <= 10; i++) {
        blockData.push([physicsRight / 4 - 4 - .01 * i, 9.9 + .3 * i]);
    }
    blockData.forEach((block) => {
        world.addStaticObject(entityFactory.createFixedRectangle({ x: block[0], y: block[1] }, 2, 2, 0x000000));
    });

    document.body.appendChild(Papp.canvas);

    // Game loops
    const ticker = new Ticker();

    window.addEventListener("keypress", e => {
        if (e.key == "p") {
            app.paused = true;
        }
    });

    const updatePhysics = () => {
        const startTime = Date.now();

        if (!app.paused) {
            world.step();
        }

        const endTime = Date.now();
        setTimeout(updatePhysics, 1000 / 60 - (endTime - startTime));
    };

    const updateRendered = () => {
        world.updatePosition();
    };

    setTimeout(updatePhysics, 0);
    ticker.add(updateRendered, -1);
    ticker.start();

    window.updatePhysics = updatePhysics;
    window.updateRendered = updateRendered;

    // Resize function
    function resize() {
        if (window.innerWidth / window.innerHeight >= 1920 / 1080) {
            Papp.renderer.resize(window.innerHeight * 1920 / 1080, window.innerHeight);
            app.settings.ptom = window.innerHeight / (app.settings.mtow * 1080 / 1920);
            Papp.canvas.style.width = `${100 * 1920 / 1080}vh`;
            Papp.canvas.style.height = `100vh`;
        } else {
            Papp.renderer.resize(window.innerWidth, window.innerWidth * 1080 / 1920);
            app.settings.ptom = window.innerWidth / app.settings.mtow;
            Papp.canvas.style.width = `100vw`;
            Papp.canvas.style.height = `${100 * 1080 / 1920}vw`;
        }
        world.updateAll();
    }
    resize();

    // Add event listener for window resize
    window.addEventListener('resize', resize);
}

// Invoke `main` function at the end
main();
