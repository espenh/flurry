"use strict";

/**
 * Handles clicks and drags with mouse.
 * Improvement: Support touch events.
 */
class MouseHandler {
    constructor(canvas, scene, objectClickHandler, objectChangedHandler) {
        this.canvas = canvas;
        this.scene = scene;

        let draggingObject = null;
        let draggingObjectStartPosition = null;

        let selectionInfo = {
            object: null,
            objectOriginalPosition: null,
            objectMousePositionDelta: null
        };

        let mouseMoveHandler = (moveEvent => {
            let mousePosition = new Vector(moveEvent.clientX - this.canvas.offsetLeft, moveEvent.clientY - this.canvas.offsetTop);

            if (Vector.vectorFromPoints(selectionInfo.object.position, mousePosition).length() < 5) {
                // Not a lot of movement. Do not treat as drag.
                // TODO - Consider checking this only on start of movement.
                return;
            }

            selectionInfo.object.position = mousePosition.add(selectionInfo.objectMousePositionDelta);
            objectChangedHandler()
        });

        this.canvas.addEventListener("mousedown", downEvent => {
            let mousePosition = new Vector(downEvent.clientX - this.canvas.offsetLeft, downEvent.clientY - this.canvas.offsetTop);
            let hitObject = scene.hitTestDraggableObjects(mousePosition);

            if (!hitObject) {
                return;
            }

            selectionInfo = {
                object: hitObject,
                objectOriginalPosition: hitObject.position,
                objectMousePositionDelta: Vector.vectorFromPoints(mousePosition, hitObject.position)
            }

            this.canvas.addEventListener("mousemove", mouseMoveHandler);

            if (objectClickHandler) {
                objectClickHandler(hitObject);
            }
        });

        this.canvas.addEventListener("mouseup", e => {
            this.canvas.removeEventListener("mousemove", mouseMoveHandler);

            selectionInfo = null;
        });
    }
}