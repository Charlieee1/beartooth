class World {
    world;
    objects = [];
    staticObjects = [];

    constructor(world) {
        this.world = world;
    }

    addObject(object) {
        this.objects.push(object);
        return object;
    }

    addStaticObject(object) {
        this.staticObjects.push(object);
        return object;
    }

    update() {
        this.objects.forEach((obj) => {
            obj.rendered.updatePosition();
        });
    }

    step() {
        this.world.step();
        this.update();
    }

    updateAll() {
        this.update();
        this.staticObjects.forEach((obj) => {
            obj.rendered.updatePosition();
        });
    }

    getWorld() {
        return [...this.world];
    }
}

export { World };
