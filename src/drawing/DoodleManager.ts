export interface Point {
  x: number;
  y: number;
}

export interface Path {
  points: Point[];
  color: string;
  width: number;
}

export class DoodleManager {
  private paths: Path[] = [];
  private currentPath: Path | null = null;
  private lineWidth: number = 5;
  private lineColor: string = '#000000';

  constructor() {
    // Initialize with default settings
  }

  /**
   * Start a new path at the given coordinates
   */
  public startPath(x: number, y: number): void {
    this.currentPath = {
      points: [{ x, y }],
      color: this.lineColor,
      width: this.lineWidth
    };
    
    // Add the new path to the paths array
    this.paths.push(this.currentPath);
  }

  /**
   * Add a point to the current path
   */
  public addPoint(x: number, y: number): void {
    if (!this.currentPath) {
      this.startPath(x, y);
      return;
    }
    
    this.currentPath.points.push({ x, y });
  }

  /**
   * End the current path
   */
  public endPath(): void {
    this.currentPath = null;
  }

  /**
   * Get all paths
   */
  public getPaths(): Path[] {
    return this.paths;
  }

  /**
   * Clear all paths
   */
  public clearPaths(): void {
    this.paths = [];
    this.currentPath = null;
  }

  /**
   * Set the line width
   */
  public setLineWidth(width: number): void {
    this.lineWidth = width;
  }

  /**
   * Get the current line width
   */
  public getLineWidth(): number {
    return this.lineWidth;
  }

  /**
   * Set the line color
   */
  public setLineColor(color: string): void {
    this.lineColor = color;
  }

  /**
   * Get the current line color
   */
  public getLineColor(): string {
    return this.lineColor;
  }
}