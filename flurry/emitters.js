"use strict";

class SnowEmitter extends Rectangle {
    constructor(position, width, flakeCreator, flakesPerSecond = 50) {
        super(position, width, 10);

        this.flakeCreator = flakeCreator;
        this.flakesPerSecond = flakesPerSecond;
        this.lastCreatedTime = performance.now();
    }

    update(timeDelta, timestamp) {
        let now = timestamp;
        let delta = now - this.lastCreatedTime;

        if (delta >= (1000 / this.flakesPerSecond)) {

            let flakesToCreate = Math.min(Math.floor(delta / (1000 / this.flakesPerSecond)), 100);

            for (let i = 0; i < flakesToCreate; i++) {
                let flake = this.flakeCreator();
                flake.position = new Vector(this.position.x + Math.random() * this.width, this.position.y + this.height);
                flake.velocity = new Vector(0, 10 + Math.random() * 50);
            }

            this.lastCreatedTime = now;
        }
    }

    // TODO - Can this be done with the ecmascript 7 decorator things?
    metainfo() {
        return {
            flakesPerSecond: {
                type: "range",
                min: 0,
                max: 200
            }
        };
    }
}