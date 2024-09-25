import * as PIXI from 'pixi.js';
import * as RAPIER from '@dimforge/rapier2d';

class EntityFactory {
    constructor() {}

    createFixedRectangle(translation, width, height, colour) {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(translation.x, translation.y);
        let rigidBody = app.world.world.createRigidBody(rigidBodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2).setFriction(0);
        let collider = app.world.world.createCollider(colliderDesc, rigidBody);
        let renderedRect = new PIXI.Graphics();
        renderedRect.rect(0, 0, width * ptom, height * ptom).fill(colour);
        renderedRect.x = ptom * (translation.x - width / 2);
        renderedRect.y = app.renderedWorld.screen.height - ptom * (translation.y + height / 2);
        renderedRect.updatePosition = function () {
            renderedRect.x = ptom * (rigidBody.translation().x - width / 2);
            renderedRect.y = app.renderedWorld.screen.height - ptom * (rigidBody.translation().y + height / 2);
        }
        app.renderedWorld.stage.addChild(renderedRect);
        return {
            rigidBodyDesc: rigidBodyDesc,
            rigidBody: rigidBody,
            colliderDesc: colliderDesc,
            collider: collider,
            rendered: renderedRect
        };
    }

    createDynamicRectangle(translation, width, height, colour, rotationLocked = true, ccdEnabled = true) {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(translation.x, translation.y);
        if (ccdEnabled) {
            rigidBodyDesc
            .setCcdEnabled(ccdEnabled)
            .setSoftCcdPrediction(1);
        }
        if (rotationLocked) rigidBodyDesc.lockRotations();
        let rigidBody = app.world.world.createRigidBody(rigidBodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2).setFriction(0);
        let collider = app.world.world.createCollider(colliderDesc, rigidBody);
        let renderedRect = new PIXI.Graphics();
        renderedRect.rect(0, 0, width * ptom, height * ptom).fill(colour);
        renderedRect.x = ptom * (translation.x - width / 2);
        renderedRect.y = app.renderedWorld.screen.height - ptom * (translation.y + height / 2);
        renderedRect.updatePosition = function () {
            renderedRect.x = ptom * (rigidBody.translation().x - width / 2);
            renderedRect.y = app.renderedWorld.screen.height - ptom * (rigidBody.translation().y + height / 2);
        }
        app.renderedWorld.stage.addChild(renderedRect);
        return {
            rigidBodyDesc: rigidBodyDesc,
            rigidBody: rigidBody,
            colliderDesc: colliderDesc,
            collider: collider,
            rendered: renderedRect
        };
    }

    createDynamicCircle(translation, radius, colour, ccdEnabled = true) {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(translation.x, translation.y);
        if (ccdEnabled) {
            rigidBodyDesc
            .setCcdEnabled(ccdEnabled)
            .setSoftCcdPrediction(.5);
        }
        let rigidBody = app.world.world.createRigidBody(rigidBodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.ball(radius).setFriction(0);
        let collider = app.world.world.createCollider(colliderDesc, rigidBody);
        let renderedCircle = new PIXI.Graphics();
        renderedCircle.circle(0, 0, radius * ptom).fill(colour);
        renderedCircle.updatePosition = function () {
            renderedCircle.x = ptom * rigidBody.translation().x;
            renderedCircle.y = app.renderedWorld.screen.height - ptom * rigidBody.translation().y;
        }
        app.renderedWorld.stage.addChild(renderedCircle);
        return {
            rigidBodyDesc: rigidBodyDesc,
            rigidBody: rigidBody,
            colliderDesc: colliderDesc,
            collider: collider,
            rendered: renderedCircle
        };
    }
}

export { EntityFactory };
