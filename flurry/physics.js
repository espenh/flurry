"use strict";

/**
 * Simulates physical objects and forces. 
 */
class FlurryPhysics {

    constructor() {
        this.gravity = 9.1;
        this.drag = 0.47;

        this.gravityVector = new Vector(0, this.gravity)
    }

    geCombinedForcesForObject(scene, flake) {
        let forces = [this.gravityVector.scale(flake.mass)];

        scene.forces.forEach(force => {
            let delta = Vector.vectorFromPoints(flake.position, force.position);
            let distance = delta.length();

            if (distance <= force.range) {
                forces.push(delta.normalize().scale(force.range - distance).scale(force.strength));
            }
        });

        let combinedForce = Vector.Zero();
        forces.forEach(force => {
            combinedForce = combinedForce.add(force);
        });

        return combinedForce;
    }

    update(scene, timeDelta) {
        let deltaInSeconds = timeDelta / 1000;

        scene.flakes.forEach(flake => {
            // Get the net force (all forces combined) that act on the object.
            let acceleration = this.geCombinedForcesForObject(scene, flake).scale(flake.mass);

            let oldVelocity = flake.velocity;
            flake.velocity = flake.velocity.add(acceleration.scale(deltaInSeconds));

            let terminalVelocity = flake.terminalVelocity(this.drag, this.gravity);
            flake.velocity = flake.velocity.clamp(terminalVelocity);

            // Position + (OldVelocity + NewVelocity)/2 * dT
            flake.position = flake.position.add(oldVelocity.add(flake.velocity).scale(0.5).scale(deltaInSeconds));
        });
    }
}

class PhysicsObject {
    constructor(position, velocity = Vector.Zero(), mass = 10) {
        this.position = position;
        this.velocity = velocity;

        this.mass = mass;
    }

    terminalVelocity() {
        return 10000;
    }
}