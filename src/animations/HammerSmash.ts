import { Path } from '../drawing/DoodleManager';
import { ParticleSystem } from '../physics/ParticleSystem';
import { Vector } from '../physics/Vector';

export class HammerSmash {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private hammerImg: HTMLImageElement;
  private hammerX: number;
  private hammerY: number;
  private hammerRotation: number = -Math.PI / 4; // Start rotated up
  private hammerScale: number = 1;
  private isAnimating: boolean = false;
  private animationProgress: number = 0;
  private animationDuration: number = 60; // frames
  private particleSystem: ParticleSystem;
  private paths: Path[] = [];
  private originalPaths: Path[] = []; // Store original paths for scaling
  private smashPoint: Vector;
  private centerLineX: number = 0; // Center-line x-coordinate
  private highestPointY: number = 0; // Y-coordinate of highest point on center-line
  private smashCount: number = 0; // Count of smashes performed
  private totalSmashes: number = 1; // Total number of smashes to perform (one per button press)
  private pathScaleFactor: number = 1.0; // Scale factor for flattening
  private onComplete: () => void = () => {};

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Create a hammer image (we'll use a simple drawn hammer for now)
    this.hammerImg = new Image();
    this.hammerImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMzAgMjBINzBWNDBIMzBWMjBaIiBmaWxsPSIjODg4Ii8+PHBhdGggZD0iTTQ1IDQwSDU1VjgwSDQ1VjQwWiIgZmlsbD0iIzYxNDEyNiIvPjwvc3ZnPg==';

    // Initialize position at top center
    this.hammerX = this.canvasWidth / 2;
    this.hammerY = 0;

    // Initialize smash point at center of canvas
    this.smashPoint = new Vector(this.canvasWidth / 2, this.canvasHeight / 2);

    // Initialize particle system
    this.particleSystem = new ParticleSystem(this.smashPoint.x, this.smashPoint.y);
  }

  /**
   * Set the paths to be smashed
   */
  public setPaths(paths: Path[]): void {
    // Only set paths if they are not already set or if they are empty
    if (this.paths.length === 0 || this.originalPaths.length === 0) {
      this.paths = JSON.parse(JSON.stringify(paths)); // Deep copy
      this.originalPaths = JSON.parse(JSON.stringify(paths)); // Store original paths
    }
    // If paths are already set, don't overwrite them to preserve flattening
  }

  /**
   * Find the center-line x-coordinate of the drawing
   */
  private findCenterLineX(): number {
    if (this.paths.length === 0) return this.canvasWidth / 2;

    let minX = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;

    for (const path of this.paths) {
      for (const point of path.points) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
      }
    }

    return (minX + maxX) / 2;
  }

  /**
   * Find the highest point on the center-line
   */
  private findHighestPointOnCenterLine(): number {
    if (this.paths.length === 0) return this.canvasHeight / 2;

    let highestY = this.canvasHeight;
    const tolerance = 5; // Tolerance for center-line proximity

    for (const path of this.paths) {
      for (let i = 0; i < path.points.length - 1; i++) {
        const p1 = path.points[i];
        const p2 = path.points[i + 1];

        // Check if this line segment crosses or is near the center-line
        if ((p1.x <= this.centerLineX && p2.x >= this.centerLineX) || 
            (p1.x >= this.centerLineX && p2.x <= this.centerLineX) ||
            Math.abs(p1.x - this.centerLineX) < tolerance ||
            Math.abs(p2.x - this.centerLineX) < tolerance) {

          // Interpolate y value at center-line if segment crosses it
          let y;
          if (Math.abs(p2.x - p1.x) < 0.001) {
            y = Math.min(p1.y, p2.y); // Vertical line
          } else {
            const t = (this.centerLineX - p1.x) / (p2.x - p1.x);
            y = p1.y + t * (p2.y - p1.y);
          }

          // Update highest point (lowest y value)
          highestY = Math.min(highestY, y);
        }
      }
    }

    return highestY;
  }

  /**
   * Find the lowest point in the drawing (highest y-value)
   */
  private findLowestPoint(): number {
    // Use original paths on first smash, current paths on subsequent smashes
    const pathsToUse = this.pathScaleFactor === 1.0 ? this.originalPaths : this.paths;

    if (pathsToUse.length === 0) return this.canvasHeight;

    let lowestY = 0;

    for (const path of pathsToUse) {
      for (const point of path.points) {
        lowestY = Math.max(lowestY, point.y);
      }
    }

    return lowestY;
  }

  /**
   * Scale the paths on the y-axis to flatten them
   */
  private flattenPaths(scaleFactor: number): void {
    // On first smash, start with original paths
    if (this.pathScaleFactor === 1.0) {
      this.paths = JSON.parse(JSON.stringify(this.originalPaths));
    }
    // Otherwise, continue flattening the current paths (don't reset to original)

    // Find the lowest point in the drawing
    const lowestPointY = this.findLowestPoint();

    // Apply scaling to each point's y-coordinate
    for (const path of this.paths) {
      for (const point of path.points) {
        // Scale y-coordinate relative to the lowest point
        point.y = lowestPointY - (lowestPointY - point.y) * scaleFactor;
      }
    }
  }

  /**
   * Set the callback to be called when the animation completes
   */
  public setOnComplete(callback: () => void): void {
    this.onComplete = callback;
  }

  /**
   * Start the hammer smash animation
   */
  public start(): void {
    if (this.isAnimating) return;

    // Reset animation state
    this.isAnimating = true;
    this.animationProgress = 0;
    this.smashCount = 0;
    // Don't reset pathScaleFactor to allow progressive flattening

    // Find the center-line x-coordinate
    this.centerLineX = this.findCenterLineX();

    // Find the highest point on the center-line
    this.highestPointY = this.findHighestPointOnCenterLine();

    // Set the smash point to be on the center-line at the highest point
    this.smashPoint.x = this.centerLineX;
    this.smashPoint.y = this.highestPointY;

    // Position hammer above the smash point
    this.hammerX = this.centerLineX;
    this.hammerY = -50; // Start above the canvas

    // Reset particle system
    this.particleSystem.setOrigin(this.smashPoint.x, this.smashPoint.y);
    this.particleSystem.clear();

    console.log(`Starting hammer animation: centerLineX=${this.centerLineX}, highestPointY=${this.highestPointY}`);
  }

  /**
   * Update the animation state
   */
  public update(): boolean {
    if (!this.isAnimating) return false;

    this.animationProgress++;

    // Phase 1: Hammer swings down (0-30%)
    if (this.animationProgress < this.animationDuration * 0.3) {
      const progress = this.animationProgress / (this.animationDuration * 0.3);
      this.hammerRotation = -Math.PI / 4 + progress * Math.PI / 2;
      this.hammerY = -50 + progress * (this.smashPoint.y + 50);
    } 
    // Phase 2: Impact and shake (30-40%)
    else if (this.animationProgress < this.animationDuration * 0.4) {
      // On first frame of impact, create particles and flatten the drawing
      if (this.animationProgress === Math.floor(this.animationDuration * 0.3)) {
        // Create impact particles
        this.createImpactParticles();

        // Increment smash count
        this.smashCount++;
        console.log(`Smash ${this.smashCount} of ${this.totalSmashes}`);

        // Flatten the drawing (reduce scale factor by 20% each time)
        this.pathScaleFactor *= 0.8;
        this.flattenPaths(this.pathScaleFactor);

        // Find the new highest point after flattening
        this.highestPointY = this.findHighestPointOnCenterLine();
        this.smashPoint.y = this.highestPointY;
      }

      // Shake the hammer
      const shakeAmount = 3;
      this.hammerX = this.smashPoint.x + (Math.random() * 2 - 1) * shakeAmount;
      this.hammerY = this.smashPoint.y + (Math.random() * 2 - 1) * shakeAmount;
    } 
    // Phase 3: Hammer rises back up (40-100%)
    else {
      const progress = (this.animationProgress - this.animationDuration * 0.4) / (this.animationDuration * 0.6);
      this.hammerRotation = Math.PI / 4 - progress * Math.PI / 2;
      this.hammerY = this.smashPoint.y + 50 - progress * (this.smashPoint.y + 100);
      this.hammerX = this.smashPoint.x;
    }

    // Update particles
    this.particleSystem.update();

    // Check if animation cycle is complete
    if (this.animationProgress >= this.animationDuration) {
      // If we haven't completed all smashes, start the next one
      if (this.smashCount < this.totalSmashes) {
        // Reset animation progress for the next smash
        this.animationProgress = 0;

        // Position hammer above the new smash point
        this.hammerX = this.centerLineX;
        this.hammerY = -50;
        this.hammerRotation = -Math.PI / 4; // Reset rotation

        // Clear particles from previous smash
        this.particleSystem.clear();

        console.log(`Starting next smash at y=${this.highestPointY}`);
      } else {
        // All smashes completed, end the animation
        this.isAnimating = false;
        this.onComplete();
        return false;
      }
    }

    return true;
  }

  /**
   * Create particles for the impact effect
   */
  private createImpactParticles(): void {
    // For each path, create particles along the path
    for (const path of this.paths) {
      this.particleSystem.addParticlesFromPoints(
        path.points,
        0.3, // Use 30% of points
        path.color,
        [2, 5], // Size range
        [30, 60] // Life range
      );
    }

    // Add some impact particles at the smash point
    this.particleSystem.addParticles(
      20, // Number of particles
      this.smashPoint.x,
      this.smashPoint.y,
      '#FFF', // White particles
      [3, 8], // Size range
      [20, 40] // Life range
    );

    // Apply an outward force to simulate explosion
    const explosionForce = new Vector(0, -0.2);
    this.particleSystem.applyForce(explosionForce);
  }

  /**
   * Draw the hammer, particles, and flattened paths
   */
  public draw(): void {
    if (!this.isAnimating && this.particleSystem.isEmpty()) return;

    // Draw the flattened paths
    if (this.paths.length > 0) {
      for (const path of this.paths) {
        if (path.points.length < 2) continue;

        this.ctx.beginPath();
        this.ctx.strokeStyle = path.color;
        this.ctx.lineWidth = path.width;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Move to the first point
        this.ctx.moveTo(path.points[0].x, path.points[0].y);

        // Draw lines to each subsequent point
        for (let i = 1; i < path.points.length; i++) {
          this.ctx.lineTo(path.points[i].x, path.points[i].y);
        }

        this.ctx.stroke();
      }
    }

    // Draw particles
    this.particleSystem.draw(this.ctx);

    // Draw hammer
    if (this.isAnimating) {
      this.ctx.save();

      // Move to hammer position
      this.ctx.translate(this.hammerX, this.hammerY);

      // Rotate
      this.ctx.rotate(this.hammerRotation);

      // Scale
      this.ctx.scale(this.hammerScale, this.hammerScale);

      // Draw the hammer image
      const hammerWidth = 60;
      const hammerHeight = 100;
      this.ctx.drawImage(
        this.hammerImg,
        -hammerWidth / 2,
        -hammerHeight / 2,
        hammerWidth,
        hammerHeight
      );

      this.ctx.restore();
    }
  }

  /**
   * Check if the animation is currently playing
   */
  public isPlaying(): boolean {
    return this.isAnimating || !this.particleSystem.isEmpty();
  }

  /**
   * Get the current flattened paths
   */
  public getPaths(): Path[] {
    return this.paths;
  }

  /**
   * Stop the animation
   */
  public stop(): void {
    this.isAnimating = false;
    this.particleSystem.clear();
  }

  /**
   * Reset the animation state and clear paths
   */
  public reset(): void {
    this.paths = [];
    this.originalPaths = [];
    this.pathScaleFactor = 1.0;
    this.animationProgress = 0;
    this.smashCount = 0;
    this.hammerRotation = -Math.PI / 4; // Reset to initial rotation
    this.hammerX = this.canvasWidth / 2; // Reset to center of canvas
    this.hammerY = 0; // Reset to top of canvas
    this.stop();
  }
}
