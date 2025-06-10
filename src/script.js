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
    rapierWorld.integrationParameters["normalizedPredictionDistance"] = .1;

    // Create the entity factory
    const entityFactory = new EntityFactory();
    app.entityFactory = entityFactory;

    // Create a world
    const world = new World(rapierWorld, Papp);
    app.world = world;

    window.physicsTop = app.settings.mtow * 1080 / 1920;
    window.physicsRight = app.settings.mtow;

    // Create player
    const player = new Player({ x: 3 * physicsRight / 4 + 2e3, y: app.settings.playerHeight / 2 + .5e3 });
    app.player = player;
    world.setPlayer(player);

    // Set up non-player rigid-bodies
    for (let y = 1e3; y <= 4e3; y+=1e3) {
        for (let x = 1e3 + (y % 2e3) / 2; x <= 3 * physicsRight / 4 - 10e3; x+=1e3) {
            let ball = world.addObject(entityFactory.createDynamicCircle({ x: x, y: y }, .5e3,
                Math.round(Math.random() * 0xffffff)));
            ball.collider.setDensity(.05);
        }
    }
    const ground = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight / 2, y: 0 }, physicsRight, 1e3, 0x000000));
    const wall1 = world.addStaticObject(entityFactory.createFixedRectangle({ x: 0, y: physicsTop / 2 }, 1e3, physicsTop, 0x000000));
    const wall2 = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight, y: physicsTop / 2 }, 1e3, physicsTop, 0x000000));
    const wall3 = world.addStaticObject(entityFactory.createFixedRectangle({ x: 3 * physicsRight / 4, y: 1.5e3 }, 1e3, 2.5e3, 0x000000));
    const wall4 = world.addStaticObject(entityFactory.createFixedRectangle({ x: 3 * physicsRight / 4 - 8e3, y: 1.5e3 }, 1e3, 2.5e3, 0x000000));
    // const wall5 = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight / 4 + 4e3, y: 1.5e3 }, 1e3, 2.5e3, 0x000000));
    const roof = world.addStaticObject(entityFactory.createFixedRectangle({ x: physicsRight / 2, y: physicsTop }, physicsRight, 1e3, 0x000000));
    const blockData = [
        [7 * physicsRight / 8, 4e3],
        [3 * physicsRight / 4 - 4e3, 4e3],
        [3 * physicsRight / 4 - 8e3, 6.5e3],
        [3 * physicsRight / 4 - 3e3, 9e3],
        [3 * physicsRight / 4 - 12e3, 9.5e3],
        [3 * physicsRight / 4 - 16e3, 12.5e3],
        [3 * physicsRight / 4 - 17e3, 13.5e3],
        [7 * physicsRight / 8 + 2.5e3, 7e3],
        [physicsRight - .5e3, 10e3],
        [physicsRight - 4e3, 12e3],
        [physicsRight - 5.1e3, 12.2e3],
        [physicsRight - 6.2e3, 12.4e3],
        [physicsRight / 4 - .8e3, 15.5e3],
        [physicsRight / 4 - 1.8e3, 9.9e3],
        [physicsRight / 4 - 8e3, 17e3],
        [physicsRight / 4 - 7.8e3, 7e3],
    ];
    for (let i = 0; i <= 10; i++) {
        blockData.push([physicsRight / 4 - 4e3 - .01e3 * i, 9.9e3 + .3e3 * i]);
    }
    blockData.forEach((block) => {
        world.addStaticObject(entityFactory.createFixedRectangle({ x: block[0], y: block[1] }, 2e3, 2e3, 0x000000));
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
