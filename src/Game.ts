class Game {

    // The canvas
    private canvas: HTMLCanvasElement;

    // The player on the canvas
    private player: Player;

    // The objects on the canvas
    private scoringObject: Array<ScoringObject> = new Array()

    // KeyListener so the user can give input
    private keyListener: KeyListener;

    // Score
    private totalScore: number;
    private totalLives: number;
    private speedBoost: number;
    private won: boolean = false;

    // amount of frames
    private frameIndex: number;


    //paused or not
    private paused: boolean;

    public constructor(canvas: HTMLElement) {
        this.canvas = <HTMLCanvasElement>canvas;

        // Resize the canvas so it looks more like a Runner game
        this.canvas.width = 650;
        this.canvas.height = window.innerHeight;

        // Set the player at the center
        this.player = new Player(this.canvas);

        // Score is zero at start
        this.totalScore = 0;
        this.totalLives = 5;

        //upps the speed
        this.speedBoost = 0;

        this.frameIndex = 0;

        //pause state
        this.paused = true;

        this.keyListener = new KeyListener();
        // Start the animation
        console.log('start animation');
        requestAnimationFrame(this.step);
    }

    /**
     * This MUST be an arrow method in order to keep the `this` variable
     * working correctly. It will be overwritten by another object otherwise
     * caused by javascript scoping behaviour.
     */
    step = () => {

        //makes sure the pause logic is not frozen when the game is paused
        this.pause();

        //only executes the game when the game is not paused
        if (this.paused === false && this.totalLives > 0 && this.won === false) {
            this.frameIndex++
            if (this.totalScore >= 1000) {
                this.won = true
            }
            //makes you lose if you have minus points
            if (this.totalScore < 0){
                this.totalLives = 0;
            }

            //spawns an item every x frames & decides the speed boost and frequency of items
            if (this.frameIndex === 40 && this.totalScore >= 700) {
                this.createRandomScoringObject();
                this.frameIndex = 0;
                this.speedBoost = 4;
            }
            if (this.frameIndex === 60 && this.totalScore >= 300) {
                this.createRandomScoringObject();
                this.frameIndex = 0;
                this.speedBoost = 3;
            }
            if (this.frameIndex === 80 && this.totalScore >= 100) {
                this.createRandomScoringObject();
                this.frameIndex = 0;
                this.speedBoost = 2
            }
            if (this.frameIndex === 100) {
                this.createRandomScoringObject();
                this.frameIndex = 0;
            }
            this.player.move();


            // checks if player collides
            this.scoringObject.forEach(
                (object, index) => {
                    if (object !== null) {
                        object.move();

                        if (this.player.collidesWith(object)) {
                            this.totalScore += object.getPoints();
                            this.totalLives += object.getLives();
                            this.scoringObject.splice(index, 1)
                        } else if (object.collidesWithCanvasBottom()) {
                            this.scoringObject.splice(index, 1)
                        }
                    }
                }
            );
        } if (this.totalLives <= 0) {
            //clears screen on death
            this.scoringObject = [];
        }

        this.draw();

        // Call this method again on the next animation frame
        // The user must hit F5 to reload the game
        requestAnimationFrame(this.step);
    }

    /**
     * pauses the game on button press and start back up 1000 ms after pressing start
     */
    private async pause() {
        if (this.keyListener.isKeyDown(KeyListener.KEY_ESC)) {
            this.paused = true
        } else if (this.keyListener.isKeyDown(KeyListener.KEY_P)) {
            await this.delay(1000);
            this.paused = false
        }
    }


    /**
     * Render the items on the canvas
     */
    private draw() {
        // Get the canvas rendering context
        const ctx = this.canvas.getContext('2d');
        // Clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.writeTextToCanvas(ctx, "UP arrow = middle | LEFT arrow = left | RIGHT arrow = right", this.canvas.width / 2, 40, 14);
        this.writeTextToCanvas(ctx, `Press ESC to pause`, this.canvas.width / 2 - 250, 20, 16);
        this.writeTextToCanvas(ctx, `Lives: ${this.totalLives}`, this.canvas.width / 2 + 250, 20, 16);

        //writes you won when you win
        if (this.won === true) {
            this.writeTextToCanvas(ctx, `You Won!`, this.canvas.width / 2, 200, 40);
        }
        //writes you lost when you lost
        if (this.totalLives <= 0) {
            this.writeTextToCanvas(ctx, `You Lost`, this.canvas.width / 2, 200, 40);
        }
        //writes the pause message when game is paused
        else if (this.paused === true) {
            this.writeTextToCanvas(ctx, `Paused`, this.canvas.width / 2, 200, 40);
            this.writeTextToCanvas(ctx, `Press P to start`, this.canvas.width / 2, 250, 35);
        }

        this.drawScore(ctx);

        this.player.draw(ctx);

        //draws each object
        this.scoringObject.forEach(
            (object) => {
                if (object !== null) {
                    object.draw(ctx);
                }
            });
    }

    /**
     * Draw the score on a canvas
     * @param ctx
     */
    private drawScore(ctx: CanvasRenderingContext2D): void {
        this.writeTextToCanvas(ctx, `Score: ${this.totalScore}`, this.canvas.width / 2, 80, 16);
    }

    /**
     * Create a random scoring object and clear the other scoring objects by setting them to `null`.
     */
    private createRandomScoringObject(): void {

        const random = this.randomInteger(1, 4);
        const plusLife = this.randomInteger(1, 40)


        if (plusLife === 6) {
            this.scoringObject.push(new GreenCross(this.canvas));
        } else if (random === 1) {
            this.scoringObject.push(new GoldTrophy(this.canvas));
        }

        else if (random === 2) {
            this.scoringObject.push(new SilverTrophy(this.canvas));
        }

        else if (random === 3) {
            this.scoringObject.push(new RedCross(this.canvas));
        }

        else if (random === 4) {
            this.scoringObject.push(new LightningBolt(this.canvas));
        }

        const last_element: number = this.scoringObject.length - 1;
        this.scoringObject[last_element].setSpeed(this.speedBoost);
    }

    /**
   * Writes text to the canvas
   * @param {string} text - Text to write
   * @param {number} fontSize - Font size in pixels
   * @param {number} xCoordinate - Horizontal coordinate in pixels
   * @param {number} yCoordinate - Vertical coordinate in pixels
   * @param {string} alignment - Where to align the text
   * @param {string} color - The color of the text
   */
    public writeTextToCanvas(
        ctx: CanvasRenderingContext2D,
        text: string,
        xCoordinate: number,
        yCoordinate: number,
        fontSize: number = 20,
        color: string = "red",
        alignment: CanvasTextAlign = "center"
    ) {
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = alignment;
        ctx.fillText(text, xCoordinate, yCoordinate);
    }


    /**
     * pauses the game for ms amount of time
     * @param ms amount of time in MS
     */
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
