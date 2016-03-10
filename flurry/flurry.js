"use strict";

/**
 * Things to try out:
 * - Quadtree. Divide scene in sections to improve performance when boundary checking. 
 */
class Flurry {
    constructor(canvas, objectClickHandler, sceneChangedHandler) {
        this.renderer = new FlurryRenderer(canvas);
        this.physics = new FlurryPhysics();

        this.scene = new FlurryScene(canvas.width, canvas.height, sceneChangedHandler);
        this.loop = new GameLoop(this.update.bind(this), this.render.bind(this));

        this.mouseEvents = new MouseHandler(canvas, this.scene, (object) => objectClickHandler(this.scene, object), () => sceneChangedHandler(this.scene));
    }

    update(timeDelta, timestamp) {
        this.scene.update(timeDelta, timestamp);
        this.physics.update(this.scene, timeDelta);
    }

    render(fps) {
        this.renderer.render(this.scene, fps);
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }
}