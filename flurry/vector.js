"use strict";

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    dot(vector) {
        return new Vector(this.x * vector.x, this.y * vector.y);
    }

    scale(scale) {
        return new Vector(this.x * scale, this.y * scale);
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    clamp(limit) {
        let length = this.length();
        if (limit > length) {
            return this.copy();
        }

        let ratio = limit / length;
        return new Vector(this.x * ratio, this.y * ratio);
    }
    
    normalize(){
        let length = this.length();
        return new Vector(this.x/length, this.y/length);
    }
    
    static vectorFromPoints(from, to){
        return new Vector(to.x - from.x, to.y - from.y);
    }
    
    static Zero() {
        return new Vector(0,0);
    }
}