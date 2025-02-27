import * as PIXI from 'pixi.js';
import * as RAPIER from '@dimforge/rapier2d';

class EntityFactory {
    constructor() { }

    // For the player and static blocks
    createFixedRectangle(translation, width, height, colour) {
        const body = {
            x: translation.x,
            y: translation.y,
            width: width,
            height: height,
            velocity: { x: 0, y: 0 }
        };
        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(translation.x, translation.y);
        const rigidBody = app.world.rapierWorld.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2).setFriction(0);
        const collider = app.world.rapierWorld.createCollider(colliderDesc, rigidBody);
        const renderedRect = new PIXI.Graphics();
        renderedRect.rect(0, 0, width * app.settings.ptom, height * app.settings.ptom).fill(colour);
        renderedRect.x = app.settings.ptom * (translation.x - width / 2);
        renderedRect.y = app.Papp.screen.height - app.settings.ptom * (translation.y + height / 2);
        renderedRect.updatePosition = function () {
            renderedRect.x = app.settings.ptom * (rigidBody.translation().x - width / 2);
            renderedRect.y = app.Papp.screen.height - app.settings.ptom * (rigidBody.translation().y + height / 2);
        }
        app.Papp.stage.addChild(renderedRect);
        return {
            body: body,
            rigidBodyDesc: rigidBodyDesc,
            rigidBody: rigidBody,
            colliderDesc: colliderDesc,
            collider: collider,
            rendered: renderedRect
        };
    }

    // No use yet
    createDynamicRectangle(translation, width, height, colour, rotationLocked = true, ccdEnabled = true) {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(translation.x, translation.y);
        if (ccdEnabled) {
            rigidBodyDesc
                .setCcdEnabled(ccdEnabled)
                .setSoftCcdPrediction(1);
        }
        if (rotationLocked) rigidBodyDesc.lockRotations();
        let rigidBody = app.world.rapierWorld.createRigidBody(rigidBodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2).setFriction(0);
        let collider = app.world.rapierWorld.createCollider(colliderDesc, rigidBody);
        let renderedRect = new PIXI.Graphics();
        renderedRect.rect(0, 0, width * app.settings.ptom, height * app.settings.ptom).fill(colour);
        renderedRect.x = app.settings.ptom * (translation.x - width / 2);
        renderedRect.y = app.Papp.screen.height - app.settings.ptom * (translation.y + height / 2);
        renderedRect.updatePosition = function () {
            renderedRect.x = app.settings.ptom * (rigidBody.translation().x - width / 2);
            renderedRect.y = app.Papp.screen.height - app.settings.ptom * (rigidBody.translation().y + height / 2);
        }
        app.Papp.stage.addChild(renderedRect);
        return {
            rigidBodyDesc: rigidBodyDesc,
            rigidBody: rigidBody,
            colliderDesc: colliderDesc,
            collider: collider,
            rendered: renderedRect
        };
    }

    // For fun moving circles
    createDynamicCircle(translation, radius, colour, ccdEnabled = true) {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(translation.x, translation.y);
        if (ccdEnabled) {
            rigidBodyDesc
                .setCcdEnabled(ccdEnabled)
                .setSoftCcdPrediction(.5);
        }
        let rigidBody = app.world.rapierWorld.createRigidBody(rigidBodyDesc);
        let colliderDesc = RAPIER.ColliderDesc.ball(radius).setFriction(0);
        let collider = app.world.rapierWorld.createCollider(colliderDesc, rigidBody);
        let renderedCircle = new PIXI.Graphics();
        renderedCircle.circle(0, 0, radius * app.settings.ptom).fill(colour);
        renderedCircle.updatePosition = function () {
            renderedCircle.x = app.settings.ptom * rigidBody.translation().x;
            renderedCircle.y = app.Papp.screen.height - app.settings.ptom * rigidBody.translation().y;
        }
        app.Papp.stage.addChild(renderedCircle);
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
