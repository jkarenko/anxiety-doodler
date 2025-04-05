import { Path, Point } from '../drawing/DoodleManager';
import { ParticleSystem } from '../physics/ParticleSystem';
import { Vector } from '../physics/Vector';

export class Burner {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private particleSystem: ParticleSystem;
  private paths: Path[] = [];
  private isAnimating: boolean = false;
  private animationProgress: number = 0;
  private animationDuration: number = 120; // frames
  private burnPoints: BurnPoint[] = [];
  private onComplete: () => void = () => {};
  private burnedSegments: number = 0;
  private totalSegments: number = 0;
  private fireColors: string[] = [
    '#FF4500', // OrangeRed
    '#FF7F50', // Coral
    '#FFA500', // Orange
    '#FFD700', // Gold
    '#FFFF00'  // Yellow
  ];

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Initialize particle system at bottom center of canvas
    this.particleSystem = new ParticleSystem(this.canvasWidth / 2, this.canvasHeight);

    // Set upward gravity for fire particles
    this.particleSystem.setGravity(0, -0.05);
  }

  /**
   * Set the paths to be burned
   */
  public setPaths(paths: Path[]): void {
    this.paths = paths;

    // Calculate total segments for progress tracking
    this.totalSegments = 0;
    for (const path of paths) {
      if (path.points.length > 1) {
        this.totalSegments += path.points.length - 1;
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
   * Start the burning animation
   */
  public start(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.animationProgress = 0;
    this.burnPoints = [];
    this.burnedSegments = 0;

    // Reset particle system
    this.particleSystem.clear();

    // Initialize burn points at the bottom of each path
    this.initializeBurnPoints();
  }

  /**
   * Initialize burn points at the bottom of each path
   */
  private initializeBurnPoints(): void {
    for (let pathIndex = 0; pathIndex < this.paths.length; pathIndex++) {
      const path = this.paths[pathIndex];

      if (path.points.length < 2) continue;

      // Find the lowest point in the path (highest y value)
      let lowestPointIndex = 0;
      let lowestY = path.points[0].y;

      for (let i = 1; i < path.points.length; i++) {
        if (path.points[i].y > lowestY) {
          lowestY = path.points[i].y;
          lowestPointIndex = i;
        }
      }

      // Create a burn point at the lowest point
      this.burnPoints.push({
        pathIndex,
        segmentIndex: lowestPointIndex > 0 ? lowestPointIndex - 1 : 0,
        progress: 0,
        position: new Vector(
          path.points[lowestPointIndex].x,
          path.points[lowestPointIndex].y
        ),
        speed: 0.05 + Math.random() * 0.05,
        active: true
      });
    }
  }

  /**
   * Update the animation state
   */
  public update(): boolean {
    if (!this.isAnimating) return false;

    this.animationProgress++;

    // Update burn points
    this.updateBurnPoints();

    // Update particles
    this.particleSystem.update();

    // Add some wind variation to particles
    if (this.animationProgress % 10 === 0) {
      const windForce = new Vector((Math.random() * 2 - 1) * 0.02, 0);
      this.particleSystem.applyForce(windForce);
    }

    // Check if animation is complete
    if ((this.burnedSegments >= this.totalSegments && this.particleSystem.getParticleCount() < 5) ||
        this.animationProgress >= this.animationDuration) {
      this.isAnimating = false;
      this.onComplete();
      return false;
    }

    return true;
  }

  /**
   * Update all burn points
   */
  private updateBurnPoints(): void {
    for (let i = this.burnPoints.length - 1; i >= 0; i--) {
      const burnPoint = this.burnPoints[i];

      if (!burnPoint.active) continue;

      const path = this.paths[burnPoint.pathIndex];
      const currentSegmentIndex = burnPoint.segmentIndex;

      // If we're at a valid segment
      if (currentSegmentIndex < path.points.length - 1) {
        const startPoint = path.points[currentSegmentIndex];
        const endPoint = path.points[currentSegmentIndex + 1];

        // Update progress along current segment
        burnPoint.progress += burnPoint.speed;

        // If we've completed this segment
        if (burnPoint.progress >= 1) {
          // Move to next segment
          burnPoint.segmentIndex++;
          burnPoint.progress = 0;
          this.burnedSegments++;

          // Create fire particles at the completed segment
          this.createFireParticles(startPoint, endPoint);

          // If we've reached the end of the path
          if (burnPoint.segmentIndex >= path.points.length - 1) {
            // Create final fire particles
            this.createFireParticles(
              path.points[path.points.length - 2],
              path.points[path.points.length - 1],
            );

            // Mark this burn point as inactive
            burnPoint.active = false;
            this.burnedSegments++;
            continue;
          }
        }

        // Update position based on progress
        const newX = startPoint.x + (endPoint.x - startPoint.x) * burnPoint.progress;
        const newY = startPoint.y + (endPoint.y - startPoint.y) * burnPoint.progress;
        burnPoint.position.x = newX;
        burnPoint.position.y = newY;

        // Create ember particles at the burn point
        if (this.animationProgress % 2 === 0) {
          this.createEmberParticle(burnPoint.position.x, burnPoint.position.y);
        }
      }
    }

    // If we need more burn points (for branching), add them
    if (this.animationProgress % 30 === 0 && this.burnPoints.length < 10) {
      this.addRandomBurnPoint();
    }
  }

  /**
   * Add a new burn point at a random active segment
   */
  private addRandomBurnPoint(): void {
    // Find active burn points
    const activeBurnPoints = this.burnPoints.filter(bp => bp.active);

    if (activeBurnPoints.length === 0) return;

    // Pick a random active burn point
    const sourceBurnPoint = activeBurnPoints[Math.floor(Math.random() * activeBurnPoints.length)];
    const path = this.paths[sourceBurnPoint.pathIndex];

    // Create a new burn point at a nearby segment
    const newSegmentIndex = Math.max(0, sourceBurnPoint.segmentIndex - Math.floor(Math.random() * 3));

    if (newSegmentIndex < path.points.length - 1) {
      const point = path.points[newSegmentIndex];

      this.burnPoints.push({
        pathIndex: sourceBurnPoint.pathIndex,
        segmentIndex: newSegmentIndex,
        progress: 0,
        position: new Vector(point.x, point.y),
        speed: 0.03 + Math.random() * 0.04,
        active: true
      });
    }
  }

  /**
   * Create fire particles along a segment
   */
  private createFireParticles(start: Point, end: Point): void {
    // Calculate segment length
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Number of particles based on segment length
    const particleCount = Math.max(3, Math.floor(length / 5));

    // Create particles along the segment
    for (let i = 0; i < particleCount; i++) {
      const t = i / (particleCount - 1);
      const x = start.x + dx * t;
      const y = start.y + dy * t;

      // Create a cluster of fire particles
      for (let j = 0; j < 3; j++) {
        const fireColor = this.fireColors[Math.floor(Math.random() * this.fireColors.length)];
        const jitter = 3;

        this.particleSystem.addParticle(
          x + (Math.random() * 2 - 1) * jitter,
          y + (Math.random() * 2 - 1) * jitter,
          fireColor,
          2 + Math.random() * 4,
          20 + Math.random() * 30
        );
      }
    }
  }

  /**
   * Create a single ember particle
   */
  private createEmberParticle(x: number, y: number): void {
    const fireColor = this.fireColors[Math.floor(Math.random() * this.fireColors.length)];

    this.particleSystem.addParticle(
      x + (Math.random() * 2 - 1) * 2,
      y + (Math.random() * 2 - 1) * 2,
      fireColor,
      1 + Math.random() * 2,
      10 + Math.random() * 20
    );
  }

  /**
   * Draw the fire and particles
   */
  public draw(): void {
    if (!this.isAnimating && this.particleSystem.isEmpty()) return;

    // Draw particles
    this.particleSystem.draw(this.ctx);

    // Draw burn points (for debugging)
    // for (const burnPoint of this.burnPoints) {
    //   if (burnPoint.active) {
    //     this.ctx.fillStyle = '#FF0000';
    //     this.ctx.beginPath();
    //     this.ctx.arc(burnPoint.position.x, burnPoint.position.y, 3, 0, Math.PI * 2);
    //     this.ctx.fill();
    //   }
    // }
  }

  /**
   * Check if the animation is currently playing
   */
  public isPlaying(): boolean {
    return this.isAnimating || !this.particleSystem.isEmpty();
  }

  /**
   * Stop the animation
   */
  public stop(): void {
    this.isAnimating = false;
    this.particleSystem.clear();
    this.burnPoints = [];
  }

  /**
   * Reset the animation state and clear paths
   */
  public reset(): void {
    this.paths = [];
    this.totalSegments = 0;
    this.burnedSegments = 0;
    this.animationProgress = 0;
    this.stop();
  }
}

interface BurnPoint {
  pathIndex: number;
  segmentIndex: number;
  progress: number;
  position: Vector;
  speed: number;
  active: boolean;
}
