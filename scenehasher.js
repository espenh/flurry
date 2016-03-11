"use strict";

/**
 * Creates hashes of scene state. Messy deluxe, but works for now.
 */
class SceneHasher {
    constructor(blacklist = []) {
        this.blacklist = blacklist;

        this.objectDelimiter = "|";
        this.propertyDelimiter = "!";

        this.objectTypeNameMap = {
            SnowEmitter: "E",
            RadialForce: "RF"
        };
    }

    getHash(scene) {
        let thingsToHash = scene.emitters.concat(scene.forces);
        let propsForAllThings = thingsToHash.map(thingToHash => {
            return {
                props: Object.getOwnPropertyNames(thingToHash).filter(prop => !this.blacklist.includes(prop)).map(prop => this.getPropertyString(thingToHash, prop)),
                type: this.objectTypeNameMap[thingToHash.constructor.name] || thingToHash.constructor.name
            };
        });

        let propString = "";
        propsForAllThings.forEach(propsAndType => {
            propString += this.objectDelimiter + propsAndType.type;
            propsAndType.props.forEach(prop => {
                if (prop) {
                    propString += this.propertyDelimiter + prop;
                }
            });
        });

        return propString;
    }

    setStateFromHash(scene, hash) {
        scene.emitters = [];
        scene.forces = [];

        let objectsAndPropString = hash.split(this.objectDelimiter);
        objectsAndPropString.forEach(objectAndPropString => {
            let propertyStrings = objectAndPropString.split(this.propertyDelimiter);

            // First property is the classname.
            // #|SnowEmitter!position:(50,50)!mass:10!width:100!height:10!flakesPerSecond:50|SnowEmitter!position:(200,200)!mass:10!width:100!height:10!flakesPerSecond:50

            if (["SnowEmitter", this.objectTypeNameMap.SnowEmitter].includes(propertyStrings[0])) {
                let emitter = scene.addEmitter();
                propertyStrings.slice(1).forEach(property => {
                    this.setPropertyFromString(emitter, property);
                });
            }
            
            if (["RadialForce", this.objectTypeNameMap.RadialForce].includes(propertyStrings[0])) {
                let force = scene.addForce();
                propertyStrings.slice(1).forEach(property => {
                    this.setPropertyFromString(force, property);
                });
            }
        });
    }

    getPropertyString(object, property) {
        let value = object[property];
        let objectType = typeof value;
        let empty = "";

        if (value === undefined) {
            return empty;
        }

        if (objectType === "number" || objectType === "string") {
            return property + ":" + value;
        }

        if (objectType === "object" && value.x !== undefined && value.y != undefined) {
            return property + ";(" + Math.round(value.x) + "," + Math.round(value.y) + ")";
        }

        return empty;
    }
    
    setPropertyFromString(thing, propertyString) {
        let setValue = (property, value) => {
            if(typeof thing[property] === "number"){
                thing[property] = parseFloat(value);
            } else {
                thing[property] = value;
            }
        };
        
        // Number value.
        if(propertyString.indexOf(":") > 0){
            let nameAndValue = propertyString.split(":");
            setValue(nameAndValue[0], nameAndValue[1]);
        }
        
        // x and y value.
        if(propertyString.indexOf(";") > 0){
            let nameAndValue = propertyString.split(";");
            let range = nameAndValue[1].substring(1, nameAndValue[1].length - 1).split(",");
            setValue(nameAndValue[0], new Vector(parseInt(range[0]), parseInt(range[1])));
        }
    }
}