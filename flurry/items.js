"use strict";

class Sphere extends PhysicsObject {
    constructor(position, radius = 5) {
        super(position, Vector.Zero(), radius);
        this.radius = radius;
        this.drag = 0.47;
    }

    hitTest(point) {
        return (Math.pow(point.x - this.position.x, 2) + Math.pow(point.y - this.position.y, 2)) < Math.pow(this.radius, 2);
    }

    terminalVelocity(airDensity, gravity) {
        /*
        TODO - Would be nice to do a real tv calculation, but for now we just set a hard limit.
        let refArea = Math.PI / 4 * (this.radius * 2);
        let above = 2 * this.mass * gravity;
        let below = airDensity *  refArea * this.drag;
        
        return Math.sqrt(above / below);
        */

        return 160;
    }
}

class Rectangle extends PhysicsObject {
    constructor(position, width = 10, height = 10) {
        super(position);
        this.width = width;
        this.height = height;
    }

    hitTest(point) {
        return point.x >= (this.position.x) && point.x <= (this.position.x + this.width) &&
            point.y >= (this.position.y) && point.y <= (this.position.y + this.height);
    }
}

class RadialForce extends Sphere {
    constructor(position, radius = 30, strength = 1, range = 200) {
        super(position, radius);

        this.range = range;
        this.strength = strength;
    }
    
    metainfo() {
        return {
           strength: {
               type: "range",
               min: -1,
               max: 1,
               step: 0.1
           },
           range: {
               type: "range",
               min: 0,
               max: 500,
               step: 10
           },
           radius: {
               type: "range",
               min: 10,
               max: 100,
               step: 5
           }
        }
    }
}

class SnowFlake extends Sphere {
    constructor(x = 0, y = 0) {
        let size = Math.round(Math.max(Math.random() * 5, 1));
        super(new Vector(x, y), size);
    }
}