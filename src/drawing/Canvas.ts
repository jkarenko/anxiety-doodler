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

    // Add resize and orientation change event listeners
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    window.addEventListener('orientationchange', this.resizeCanvas.bind(this));
  }

  /**
   * Resize the canvas to appropriate dimensions
   */
  private resizeCanvas(): void {
    // Determine device type based on screen width
    const isSmallMobile = window.innerWidth <= 480; // iPhone and small devices
    const isMobile = window.innerWidth <= 768; // Tablets and medium devices
    const isIpadPro = window.innerWidth > 768 && window.innerWidth <= 1024; // iPad Pro

    let canvasWidth, canvasHeight;

    if (isSmallMobile) {
      // For iPhone and small mobile devices
      canvasWidth = this.container.clientWidth * 0.95;
      canvasHeight = this.container.clientHeight * 0.8; // Slightly smaller height ratio for small screens
    } else if (isMobile) {
      // For tablets and medium-sized devices
      canvasWidth = this.container.clientWidth * 0.95;
      canvasHeight = this.container.clientHeight * 0.85;
    } else if (isIpadPro) {
      // For iPad Pro
      canvasWidth = this.container.clientWidth * 0.9;
      canvasHeight = this.container.clientHeight * 0.85;
    } else {
      // For desktop
      canvasWidth = Math.min(900, this.container.clientWidth * 0.9); // Slightly larger max width
      canvasHeight = Math.min(700, this.container.clientHeight * 0.9); // Slightly larger max height
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
