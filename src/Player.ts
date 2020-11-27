class Player {

    private canvas: HTMLCanvasElement;

    private leftLane: number;
    private middleLane: number;
    private rightLane: number;

    private keyListener: KeyListener;

    private image: HTMLImageElement;
    private positionX: number;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.leftLane = this.canvas.width / 4;
        this.middleLane = this.canvas.width / 2;
        this.rightLane = this.canvas.width / 4 * 3;

        this.keyListener = new KeyListener();

        this.image = this.loadNewImage("./assets/img/players/character_pain_walk0.png");
        this.positionX = this.canvas.width / 2;
    }

    public move() {
        if (this.keyListener.isKeyDown(KeyListener.KEY_LEFT) && this.positionX !== this.leftLane) {
            this.positionX = this.leftLane;
        }
        if (this.keyListener.isKeyDown(KeyListener.KEY_UP) && this.positionX !== this.middleLane) {
            this.positionX = this.middleLane;
        }
        if (this.keyListener.isKeyDown(KeyListener.KEY_RIGHT) && this.positionX !== this.rightLane) {
            this.positionX = this.rightLane;
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.image,
            // Center the image in the lane with the x coordinates
            this.positionX - this.image.width / 2,
            this.canvas.height - 150
        );
    }

    /**
     * Collision detection of scoringObject and player
     * Use bounding box detection method: https://computersciencewiki.org/index.php/Bounding_boxes
     */
    public collidesWith(scoringObject: ScoringObject): boolean {
        if (this.positionX < scoringObject.getPositionX() + scoringObject.getImageWidth()
            && this.positionX + this.image.width > scoringObject.getPositionX()
            && this.canvas.height - 150 < scoringObject.getPositionY() + scoringObject.getImageHeight()
            && this.canvas.height - 150 + this.image.height > scoringObject.getPositionY()
        ) {
            return true;
        }

        return false;
    }



    /**
    * Loads an image in such a way that the screen doesn't constantly flicker
    * @param {HTMLImageElement} source
    * @return HTMLImageElement - returns an image
    */
    private loadNewImage(source: string): HTMLImageElement {
        const img = new Image();
        img.src = source;
        return img;
    }
}
