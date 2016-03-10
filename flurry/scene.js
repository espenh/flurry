"use strict";

class FlurryScene {
    constructor(width, height, sceneChangedHandler) {
        this.width = width;
        this.height = height;
        this.sceneChangedHandler = sceneChangedHandler;

        this.flakes = [];
        this.flakesToRecycle = [];

        this.emitters = [];
        this.emitters.push(new SnowEmitter(new Vector(50, 50), 100, this.createSnowFlake.bind(this)));
        this.emitters.push(new SnowEmitter(new Vector(200, 200), 100, this.createSnowFlake.bind(this)));

        this.forces = [];
        this.forces.push(new RadialForce(new Vector(400, 350), 0.5));
        this.forces.push(new RadialForce(new Vector(50, 350), -0.5));
    }

    addForce() {
        let force = new RadialForce(this.getRandomPosition(), 0.5 * (Math.random() < 0.5 ? -1 : 1));
        this.forces.push(force);
        this.sceneChangedHandler(this);

        return force;
    }

    addEmitter() {
        let emitter = new SnowEmitter(this.getRandomPosition(), 100, this.createSnowFlake.bind(this));
        this.emitters.push(emitter);
        this.sceneChangedHandler(this);

        return emitter;
    }

    delete(object) {
        let emitterIndex = this.emitters.indexOf(object);
        if (emitterIndex >= 0) {
            this.emitters.splice(emitterIndex, 1);
            this.sceneChangedHandler(this);
            return;
        }
        
        let forceIndex = this.forces.indexOf(object);
        if (forceIndex >= 0) {
            this.forces.splice(forceIndex, 1);
            this.sceneChangedHandler(this);
        }
    }

    clear() {
        this.emitters = [];
        this.forces = [];
        this.sceneChangedHandler(this);
    }

    getRandomPosition() {
        let padding = 20;
        return new Vector(padding + Math.random() * (this.width - padding), padding + Math.random() * (this.height - padding));
    }

    createSnowFlake() {
        let flake = this.flakesToRecycle.pop() || new SnowFlake();
        this.flakes.push(flake);

        return flake;
    }

    isOutside(position) {
        let padding = 100;

        if (position.y < -padding || position.y > this.height + padding) {
            return true;
        }

        if (position.x < -padding || position.x > this.width + padding) {
            return true;
        }

        return false;
    }

    hitTestDraggableObjects(position) {
        let draggableObjects = this.emitters.concat(this.forces);

        for (let objectIndex = 0; objectIndex < draggableObjects.length; objectIndex++) {
            if (draggableObjects[objectIndex].hitTest(position)) {
                return draggableObjects[objectIndex];
            }
        }
    }

    update(timeDelta, timestamp) {
        this.emitters.forEach(emitter => {
            emitter.update(timeDelta, timestamp);
        });

        // Remove flakes that are outside the scene or inside a force.
        for (let flakeIndex = this.flakes.length - 1; flakeIndex >= 0; flakeIndex--) {
            let flakePosition = this.flakes[flakeIndex].position;

            if (this.isOutside(this.flakes[flakeIndex].position) || this.forces.some(force => {
                return force.hitTest(flakePosition);
            })) {
                let flake = this.flakes.splice(flakeIndex, 1)[0];
                this.flakesToRecycle.push(flake);
            }
        }
    }
}