import * as PIXI from 'pixi.js';
import * as RAPIER from '@dimforge/rapier2d';

class EntityFactory {
    constructor() {}

    createFixedRectangle(translation, width, height, colour) {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(translation.x, translation.y);
        let rigidBody = world.createRigidBody(rigidBodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2);
        let collider = world.createCollider(colliderDesc, rigidBody);
        let renderedRect = new PIXI.Graphics();
        renderedRect.rect(0, 0, width * ptom, height * ptom).fill(colour);
        renderedRect.x = ptom * (translation.x - width / 2);
        renderedRect.y = app.screen.height - ptom * (translation.y + height / 2);
        renderedRect.updatePosition = function() {
            renderedRect.x = ptom * (rigidBody.translation().x - width / 2);
            renderedRect.y = app.screen.height - ptom * (rigidBody.translation().y + height / 2);
        }
        app.stage.addChild(renderedRect);
        return {
            rigidBodyDesc: rigidBodyDesc,
            rigidBody: rigidBody,
            colliderDesc: colliderDesc,
            collider: collider,
            renderedRect: renderedRect
        };
    }

    createDynamicRectangle(translation, width, height, colour, rotationLocked = true) {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(translation.x, translation.y);
        if (rotationLocked) rigidBodyDesc.lockRotations();
        let rigidBody = world.createRigidBody(rigidBodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2);
        let collider = world.createCollider(colliderDesc, rigidBody);
        let renderedRect = new PIXI.Graphics();
        renderedRect.rect(0, 0, width * ptom, height * ptom).fill(colour);
        renderedRect.x = ptom * (translation.x - width / 2);
        renderedRect.y = app.screen.height - ptom * (translation.y + height / 2);
        renderedRect.updatePosition = function() {
            renderedRect.x = ptom * (rigidBody.translation().x - width / 2);
            renderedRect.y = app.screen.height - ptom * (rigidBody.translation().y + height / 2);
        }
        app.stage.addChild(renderedRect);
        return {
            rigidBodyDesc: rigidBodyDesc,
            rigidBody: rigidBody,
            colliderDesc: colliderDesc,
            collider: collider,
            renderedRect: renderedRect
        };
    }

    createDynamicCircle(translation, radius, colour) {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(translation.x, translation.y);
        let rigidBody = world.createRigidBody(rigidBodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.ball(radius);
        let collider = world.createCollider(colliderDesc, rigidBody);
        let renderedCircle = new PIXI.Graphics();
        renderedCircle.circle(0, 0, radius * ptom).fill(colour);
        renderedCircle.updatePosition = function() {
            renderedCircle.x = ptom * rigidBody.translation().x;
            renderedCircle.y = app.screen.height - ptom * rigidBody.translation().y;
        }
        app.stage.addChild(renderedCircle);
        return {
            rigidBodyDesc: rigidBodyDesc,
            rigidBody: rigidBody,
            colliderDesc: colliderDesc,
            collider: collider,
            renderedCircle: renderedCircle
        };
    }
}

export { EntityFactory };
