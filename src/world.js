import * as RAPIER from '@dimforge/rapier2d';

class World {
    world;
    objects = [];
    staticObjects = [];

    constructor(world) {
        this.world = world;
        this.events = new RAPIER.EventQueue(true);
    }

    addObject(object) {
        object.collider.handleCollision = ()=>{};
        this.objects.push(object);
        return object;
    }

    addStaticObject(object) {
        object.collider.handleCollision = ()=>{};
        this.staticObjects.push(object);
        return object;
    }

    updatePosition() {
        this.objects.forEach((obj) => {
            obj.rendered.updatePosition();
        });
    }

    updateAll() {
        this.updatePosition();
        this.staticObjects.forEach((obj) => {
            obj.rendered.updatePosition();
        });
    }

    step() {
        this.world.step();
        this.updatePosition();

        // Handle collision events
        this.events.drainCollisionEvents(function(handle1, handle2, started) {
            let entity1 = app.world.world.getColliderEntity(handle1);
            let entity2 = app.world.world.getColliderEntity(handle2);
            entity1.dispatchEvent({entity: entity2, started: started, type: "collision"});
            entity2.dispatchEvent({entity: entity1, started: started, type: "collision"});
        })
    }

    getWorld() {
        return [...this.world];
    }
}

export { World };
