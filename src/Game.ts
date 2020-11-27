class Game {
    

    // The canvas
    private canvas: HTMLCanvasElement;

    // The player on the canvas
    private player: Player;

    

    private level: Level;
    // KeyListener so the user can give input
    private keyListener: KeyListener;

    // Score
    
    // amount of frames
    private frameIndex: number;


    //paused or not
    private paused: boolean;
    //9 is last level
    private levelIndex: number = 0;

    public constructor(canvas: HTMLElement) {
        this.canvas = <HTMLCanvasElement>canvas;

        // Resize the canvas so it looks more like a Runner game
        this.canvas.width = 650;
        this.canvas.height = window.innerHeight;

        // Set the player at the center
        this.player = new Player(this.canvas);

        this.advanceToNextLevel();

        

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
        if (this.paused === false && this.level.getTotalLives() > 0 && this.level.isComplete() === false) {
            this.level.logic(this.frameIndex);
            this.frameIndex = this.level.getFrameIndex();
            this.frameIndex++
            
            this.player.move();
            //console.log(this.frameIndex);
            


            // checks if player collides
            this.level.collision();
            
            if (this.level.isComplete()){
                this.advanceToNextLevel();
            }
        } 

        this.draw();

        // Call this method again on the next animation frame
        // The user must hit F5 to reload the game
        requestAnimationFrame(this.step);
    }

    private advanceToNextLevel() {
        const levelArray: Level[] = [
            new Level(this.canvas, this.player, 90, 400, 0),
            new Level(this.canvas, this.player, 80, 400,0.5),
            new Level(this.canvas, this.player, 75, 600, 1),
            new Level(this.canvas, this.player, 70, 800, 1.5),
            new Level(this.canvas, this.player, 65, 1000, 2),
            new Level(this.canvas, this.player, 60, 1200, 2.5),
            new Level(this.canvas, this.player, 55, 1400, 3),
            new Level(this.canvas, this.player, 50, 1600, 3.5)]
        this.level = levelArray[this.levelIndex];
        this.levelIndex ++
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

        this.writeTextToCanvas(ctx,` Level: ${this.levelIndex}`, this.canvas.width / 2,  20, 18);
        this.writeTextToCanvas(ctx, "UP arrow = middle | LEFT arrow = left | RIGHT arrow = right", this.canvas.width / 2, 40, 14);
        this.writeTextToCanvas(ctx, `Press ESC to pause`, this.canvas.width / 2 - 250, 20, 16);
        this.writeTextToCanvas(ctx, `Lives: ${this.level.getTotalLives()}`, this.canvas.width / 2 + 250, 20, 16);

        //writes you won when you win
        if (this.level.isComplete()  === true) {
            this.writeTextToCanvas(ctx, `You Won!`, this.canvas.width / 2, 200, 40);
        }
        //writes you lost when you lost
        if (this.level.getTotalLives() <= 0) {
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
        this.level.drawObjects(ctx);
    }

    

    /**
     * Draw the score on a canvas
     * @param ctx
     */
    private drawScore(ctx: CanvasRenderingContext2D): void {
        this.writeTextToCanvas(ctx, `Score: ${this.level.getTotalScore()}`, this.canvas.width / 2, 80, 16);
    }

    /**
     * Create a random scoring object and clear the other scoring objects by setting them to `null`.
     */
    
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



    
}
