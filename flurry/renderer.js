"use strict";

/**
 * Renders scene.
 */
class FlurryRenderer {

    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }

    render(scene, fps) {
        this.clear();

        // Flakes
        this.context.save();
        scene.flakes.forEach(flake => {
            this.context.fillStyle = flake.color || "#ffffff";
            this.context.beginPath();
            this.context.arc(flake.position.x, flake.position.y, flake.radius, 0, Math.PI * 2, true);
            this.context.fill();
        });
        this.context.restore();

        // Forces
        this.context.save();
        scene.forces.forEach(force => {
            let strength = Math.max(Math.min(force.strength, 1), -1);
            let red = 100 + strength * 155;
            let green = 100 + strength * -155;
            this.context.fillStyle = "rgba(" + Math.round(red) + "," + Math.round(green) + ", 150, 0.6)";
            this.context.beginPath();
            this.context.arc(force.position.x, force.position.y, force.radius, 0, Math.PI * 2, true);
            this.context.fill();
            this.context.strokeStyle = 'white';
            this.context.stroke();
        });
        this.context.restore();

        // Emitters
        this.context.save();
        this.context.fillStyle = "rgba(255,255,255,0.6)";
        this.context.shadowColor = "black";
        this.context.shadowBlur = 10;
        this.context.shadowOffsetX = 1;
        this.context.shadowOffsetY = 1;
        scene.emitters.forEach(emitter => {
            this.context.fillRect(emitter.position.x, emitter.position.y, emitter.width, emitter.height);
        });
        this.context.restore();

        if (fps) {
            this.context.save();
            this.context.fillStyle = "rgb(200,200,200)";
            this.context.fillText("fps: " + fps, 10, 10);
            this.context.restore();
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}