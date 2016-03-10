"use strict";

let flurryGlobal = {};

document.addEventListener("DOMContentLoaded", (event) => {
    let canvas = document.querySelector(".scene-container>canvas");
    let controlsContainer = document.querySelector(".object-properties");
    
    // Create a hasher that serializes the state of the scene on change (debounced 1 second).
    let sceneHasher = new SceneHasher(["lastCreatedTime", "velocity", "mass"]);
    let timeoutId = null;
    let sceneChangedHandler = (scene) => {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            window.location.hash = sceneHasher.getHash(flurry.scene);
            timeoutId = null;
        }, 1000);
    };

    // Create a builder to generate the input UI for clicked objects.
    let controlBuilder = new ControlBuilder(sceneChangedHandler, ["lastCreatedTime", "drag", "mass"]);
    let objectClickHandler = (scene, object) => {
        controlBuilder.build(scene, controlsContainer, object);
    };

    let flurry = new Flurry(canvas, objectClickHandler, sceneChangedHandler);

    // Set scene state if present.
    if (window.location.hash) {
        sceneHasher.setStateFromHash(flurry.scene, window.location.hash);
    }

    flurry.start();

    // Set properties on a global that is referenced in the markup.
    flurryGlobal = {
        start: flurry.start.bind(flurry),
        stop: flurry.stop.bind(flurry),
        addForce: flurry.scene.addForce.bind(flurry.scene),
        addEmitter: flurry.scene.addEmitter.bind(flurry.scene),
        clear: flurry.scene.clear.bind(flurry.scene)
    };
});
