/// <reference path="ScoringObject.ts"/>

class GoldTrophy extends ScoringObject {

 
    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.image = this.loadNewImage("assets/img/objects/gold_trophy.png");
        this.speed = 5;
        this.points = 10;
        this._lives = 0;
    }
}
