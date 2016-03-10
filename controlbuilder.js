"use strict";

/**
 * Builds HTML input controls for non-specific object.
 */
class ControlBuilder {
    constructor(sceneChangedHandler, blacklist = []) {
        this.sceneChangedHandler = sceneChangedHandler;
        this.blacklist = blacklist;
    }

    build(scene, container, object) {
        if (!container) {
            return;
        }

        container.innerHTML = "";

        // Delete button.
        let deleteContainer = document.getElementById('delete-object').content.cloneNode(true);
        deleteContainer.querySelector(".delete-button").onclick = () => {
            scene.delete(object);
        };
        container.appendChild(deleteContainer);
        
        // Create controls for each property.
        let properties = Object.getOwnPropertyNames(object).filter(property => !this.blacklist.includes(property));
        let propertyMetainfo = object.metainfo ? object.metainfo() : {};
        properties.forEach(property => {
            // TODO - No support for object types yet.
            if (["object", "function"].includes(typeof object[property])) {
                return;
            }

            let metainfo = propertyMetainfo[property];
            if(metainfo && metainfo.hidden){
                return;
            }

            if (metainfo) {
                container.appendChild(this.createInputFromMetadata(scene, object, property, metainfo));
            } else {
                container.appendChild(this.createSimpleInput(scene, object, property));
            }
        });
    }

    createSimpleInput(scene, object, property) {
        let newInputElement = document.getElementById('simple-input').content.cloneNode(true);
        newInputElement.querySelector(".label").innerText = property;

        let inputBox = newInputElement.querySelector(".value");
        inputBox.value = object[property];
        inputBox.onchange = () => {
            let value = inputBox.value;
            if (typeof object[property] === "number") {
                value = parseFloat(value);
            }

            object[property] = value;
            this.sceneChangedHandler(scene);
        };
        
        return newInputElement;
    }
    
    createRangeInput(scene, object, property, min, max, step = 1) {
        let newInputElement = document.getElementById('range-input').content.cloneNode(true);
        newInputElement.querySelector(".label").innerText = property;
        
        let outputBox = newInputElement.querySelector(".valueLabel");
        outputBox.innerText = object[property];

        let inputBox = newInputElement.querySelector(".value");
        inputBox.min = min;
        inputBox.max = max;
        inputBox.step = step;
        inputBox.value = object[property];
        inputBox.oninput = () => {
            let value = inputBox.value;
            if (typeof object[property] === "number") {
                value = parseFloat(value);
            }

            object[property] = value;
            outputBox.innerText = value;
            this.sceneChangedHandler(scene);
        };
        
        return newInputElement;
    }
    
    createInputFromMetadata(scene, object, property, metainfo) {
        if(metainfo.type === "range") {
            return this.createRangeInput(scene, object, property, metainfo.min, metainfo.max, metainfo.step)
        } else{
            console.error("Unknown metainfo type: " + metainfo.type);
        }
    }
}