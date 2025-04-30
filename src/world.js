import { CustomWorld } from './customWorld';

class World {
    customWorld;
    rapierWorld;
    pixiWorld;
    dynamicObjects = [];
    staticObjects = [];
    player;

    constructor(rapierWorld, pixiWorld) {
        this.customWorld = new CustomWorld();
        this.rapierWorld = rapierWorld;
        this.pixiWorld = pixiWorld;
        // this.events = new RAPIER.EventQueue(true);
    }

    setPlayer(player) {
        this.customWorld.setPlayer(player);
        this.player = player;
        this.dynamicObjects.push(player);
    }

    addObject(object) {
        // object.collider.handleCollision = () => { };
        this.dynamicObjects.push(object);
        return object;
    }

    addStaticObject(object) {
        // object.collider.handleCollision = () => { };
        this.staticObjects.push(object);
        this.customWorld.addObject(object.body);
        return object;
    }

    // Update rendered position of graphics objects
    updatePosition() {
        this.dynamicObjects.forEach((obj) => {
            obj.rendered.updatePosition();
        });
    }

    // Update rendered scale of graphics objects
    updateScale() {
        this.dynamicObjects.forEach((obj) => {
            obj.rendered.updateScale();
        });
    }

    // Update rendered position of all objects
    updateAll() {
        this.updatePosition();
        this.updateScale();
        this.staticObjects.forEach((obj) => {
            obj.rendered.updatePosition();
            obj.rendered.updateScale();
        });
    }

    step() {
        this.player.updateControls();
        this.customWorld.step();
        this.player.rigidBody.setNextKinematicTranslation(this.player.body);
        this.rapierWorld.step();
    }

    getWorld() {
        return [...this.world];
    }
}

export { World };
