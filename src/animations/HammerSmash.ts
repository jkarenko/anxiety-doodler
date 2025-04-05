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
  private smashPoint: Vector;
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
    this.paths = paths;
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
    
    this.isAnimating = true;
    this.animationProgress = 0;
    
    // Calculate the smash point (center of all paths)
    if (this.paths.length > 0) {
      let totalX = 0;
      let totalY = 0;
      let pointCount = 0;
      
      for (const path of this.paths) {
        for (const point of path.points) {
          totalX += point.x;
          totalY += point.y;
          pointCount++;
        }
      }
      
      if (pointCount > 0) {
        this.smashPoint.x = totalX / pointCount;
        this.smashPoint.y = totalY / pointCount;
      }
    }
    
    // Position hammer above the smash point
    this.hammerX = this.smashPoint.x;
    this.hammerY = -50; // Start above the canvas
    
    // Reset particle system
    this.particleSystem.setOrigin(this.smashPoint.x, this.smashPoint.y);
    this.particleSystem.clear();
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
      // On first frame of impact, create particles
      if (this.animationProgress === Math.floor(this.animationDuration * 0.3)) {
        this.createImpactParticles();
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
    
    // Check if animation is complete
    if (this.animationProgress >= this.animationDuration) {
      this.isAnimating = false;
      this.onComplete();
      return false;
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
   * Draw the hammer and particles
   */
  public draw(): void {
    if (!this.isAnimating && this.particleSystem.isEmpty()) return;
    
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
   * Stop the animation
   */
  public stop(): void {
    this.isAnimating = false;
    this.particleSystem.clear();
  }
}