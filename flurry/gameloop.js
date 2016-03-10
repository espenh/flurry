"use strict";

/**
 * A fairly basic game loop.
 * Inspired by: http://buildnewgames.com/gamephysics/ 
 */
class GameLoop {

    constructor(updateFunction, renderFunction) {
        this.updateFunction = updateFunction;
        this.renderFunction = renderFunction;

        this.frameRequest = null;
        this.lastFrameTimeMs = 0;
        this.timestep = 1000 / 60;
        this.maxFPS = 60;
        this.fps = 60;
        this.framesThisSecond = 0;
        this.lastFpsUpdate = 0;
        this.delta = 0;
    }

    start() {
        if (this.frameRequest) {
            this.stop();
        }

        this.lastFrameTimeMs = performance.now();
        this.frameRequest = window.requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        window.cancelAnimationFrame(this.frameRequest);
        this.frameRequest = null;
    }

    loop(timestamp) {
        this.frameRequest = window.requestAnimationFrame(this.loop.bind(this));
        
        // Throttle the frame rate.    
        if (timestamp < this.lastFrameTimeMs + (1000 / this.maxFPS)) {
            return;
        }

        this.delta += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        // Update fps every ~second.
        if (timestamp > this.lastFpsUpdate + 1000) {
            this.fps = 0.25 * this.framesThisSecond + 0.75 * this.fps;

            this.lastFpsUpdate = timestamp;
            this.framesThisSecond = 0;
        }

        this.framesThisSecond++;

        // Update physics etc.
        let numUpdateSteps = 0;
        while (this.delta >= this.timestep) {
            this.updateFunction(this.timestep, timestamp);
            this.delta -= this.timestep;
            if (++numUpdateSteps >= 240) {
                this.delta = 0;
                break;
            }
        }

        this.renderFunction(this.fps);
    }
}