export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'drawing-canvas';

    // Note: All canvas styles (background-color, border-radius, box-shadow, touch-action, display)
    // are set in the .drawing-canvas CSS class

    // Append canvas to container
    container.appendChild(this.canvas);

    // Get 2D context
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;

    // Set initial size
    this.resizeCanvas();

    // Add resize event listener
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  /**
   * Resize the canvas to appropriate dimensions
   */
  private resizeCanvas(): void {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    let canvasWidth, canvasHeight;

    if (isMobile) {
      // On mobile, use 95% of container width and 70% of container height
      canvasWidth = this.container.clientWidth * 0.95;
      canvasHeight = this.container.clientHeight * 0.7;
    } else {
      // On desktop, use fixed dimensions
      canvasWidth = Math.min(800, this.container.clientWidth * 0.8);
      canvasHeight = Math.min(600, this.container.clientHeight * 0.8);
    }

    // Set canvas dimensions
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    // Set canvas CSS dimensions
    this.canvas.style.width = `${canvasWidth}px`;
    this.canvas.style.height = `${canvasHeight}px`;

    // Reset any canvas transformations
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Set default line style
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = '#000000';
  }

  /**
   * Get the canvas element
   */
  public getElement(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get the canvas rendering context
   */
  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Get the canvas width
   */
  public getWidth(): number {
    return this.canvas.width;
  }

  /**
   * Get the canvas height
   */
  public getHeight(): number {
    return this.canvas.height;
  }

  /**
   * Clear the canvas
   */
  public clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
