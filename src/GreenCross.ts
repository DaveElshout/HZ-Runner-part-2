
/// <reference path="ScoringObject.ts"/>

class GreenCross extends ScoringObject {


    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.image = this.loadNewImage("assets/img/objects/tilted_plus_health.png");
        this.speed = 9;
        this.points = 0;
        this._lives = 1;
    }
}

