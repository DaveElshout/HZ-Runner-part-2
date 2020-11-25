abstract class ScoringObject {

    protected canvas: HTMLCanvasElement;

    protected leftLane: number;
    protected middleLane: number;
    protected rightLane: number;

    protected positionX: number;
    protected positionY: number;
    protected speed: number;
    protected image: HTMLImageElement
    protected points: number
    protected _lives: number


    protected constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.leftLane = this.canvas.width / 4;
        this.middleLane = this.canvas.width / 2;
        this.rightLane = this.canvas.width / 4 * 3;

        const random = this.randomInteger(1, 3);
        if (random === 1) {
            this.positionX = this.leftLane;
        }
        if (random === 2) {
            this.positionX = this.middleLane;
        }
        if (random === 3) {
            this.positionX = this.rightLane;
        }


        this.positionY = 60;



    }




    public move() {
        this.positionY += this.speed;
    }

    /**
     * Render the objects
     * @param ctx The CanvasRenderingContext2D of the canvas to draw on
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.image,
            // Center the image in the lane with the x coordinates
            this.positionX - this.image.width / 2,
            this.positionY
        );
    }

    public collidesWithCanvasBottom(): boolean {
        if (this.positionY + this.image.height > this.canvas.height) {
            return true;
        }

        return false;
    }

    public getPositionX(): number {
        return this.positionX;
    }

    public getPositionY(): number {
        return this.positionY;
    }

    public getImageWidth(): number {
        return this.image.width;
    }

    public getImageHeight(): number {
        return this.image.height;
    }

    public getPoints(): number {
        return this.points;
    }

    public getLives(): number {
        return this._lives
    }

    public setSpeed(v: number) {
        this.speed += v;
    }


    /**
    * Loads an image in such a way that the screen doesn't constantly flicker
    * @param {HTMLImageElement} source
    * @return HTMLImageElement - returns an image
    */
    protected loadNewImage(source: string): HTMLImageElement {
        const img = new Image();
        img.src = source;
        return img;
    }

    /**
    * Generates a random integer number between min and max
    *
    * @param {number} min - minimal time
    * @param {number} max - maximal time
    */
    private randomInteger(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }
}
