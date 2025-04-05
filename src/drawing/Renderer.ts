import { Path } from './DoodleManager';

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * Clear the canvas
   */
  public clear(): void {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Draw a single path
   */
  private drawPath(path: Path): void {
    const { points, color, width } = path;
    
    if (points.length < 2) {
      // If there's only one point, draw a dot
      if (points.length === 1) {
        const point = points[0];
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, width / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
      }
      return;
    }
    
    // Set line style
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    
    // Begin drawing
    this.ctx.beginPath();
    
    // Move to the first point
    this.ctx.moveTo(points[0].x, points[0].y);
    
    // Draw lines to each subsequent point
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    
    // Stroke the path
    this.ctx.stroke();
  }

  /**
   * Draw all paths in the doodle
   */
  public drawDoodle(paths: Path[]): void {
    for (const path of paths) {
      this.drawPath(path);
    }
  }

  /**
   * Get the canvas context
   */
  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Set the canvas context
   */
  public setContext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
  }
}