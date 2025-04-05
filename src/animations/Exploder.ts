import { Path } from '../drawing/DoodleManager';
import { ParticleSystem } from '../physics/ParticleSystem';
import { Vector } from '../physics/Vector';

export class Exploder {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private particleSystem: ParticleSystem;
  private paths: Path[] = [];
  private isAnimating: boolean = false;
  private animationProgress: number = 0;
  private animationDuration: number = 90; // frames
  private explosionCenter: Vector;
  private explosionRadius: number = 0;
  private maxExplosionRadius: number = 100;
  private onComplete: () => void = () => {};
  private explosionRings: ExplosionRing[] = [];

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Initialize explosion center at center of canvas
    this.explosionCenter = new Vector(this.canvasWidth / 2, this.canvasHeight / 2);

    // Initialize particle system
    this.particleSystem = new ParticleSystem(this.explosionCenter.x, this.explosionCenter.y);
  }

  /**
   * Set the paths to be exploded
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
   * Start the explosion animation
   */
  public start(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.animationProgress = 0;
    this.explosionRadius = 0;
    this.explosionRings = [];

    // Calculate the explosion center (center of all paths)
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
        this.explosionCenter.x = totalX / pointCount;
        this.explosionCenter.y = totalY / pointCount;
      }
    }

    // Reset particle system
    this.particleSystem.setOrigin(this.explosionCenter.x, this.explosionCenter.y);
    this.particleSystem.clear();

    // Create initial explosion particles
    this.createExplosionParticles();
  }

  /**
   * Update the animation state
   */
  public update(): boolean {
    if (!this.isAnimating) return false;

    this.animationProgress++;

    // Phase 1: Initial explosion (0-20%)
    if (this.animationProgress < this.animationDuration * 0.2) {
      const progress = this.animationProgress / (this.animationDuration * 0.2);
      this.explosionRadius = this.maxExplosionRadius * progress;

      // Add a new explosion ring every few frames
      if (this.animationProgress % 5 === 0) {
        this.addExplosionRing();
      }
    } 
    // Phase 2: Particles scatter (20-100%)
    else {
      // Add occasional secondary explosions
      if (this.animationProgress % 15 === 0 && this.animationProgress < this.animationDuration * 0.6) {
        this.addSecondaryExplosion();
      }
    }

    // Update explosion rings
    for (let i = this.explosionRings.length - 1; i >= 0; i--) {
      const ring = this.explosionRings[i];
      ring.radius += ring.speed;
      ring.alpha -= 0.02;

      if (ring.alpha <= 0) {
        this.explosionRings.splice(i, 1);
      }
    }

    // Update particles
    this.particleSystem.update();

    // Apply gravity to particles
    const gravity = new Vector(0, 0.05);
    this.particleSystem.applyForce(gravity);

    // Check if animation is complete
    if (this.animationProgress >= this.animationDuration && this.particleSystem.isEmpty()) {
      this.isAnimating = false;
      this.onComplete();
      return false;
    }

    return true;
  }

  /**
   * Create particles for the explosion effect
   */
  private createExplosionParticles(): void {
    // For each path, create particles along the path
    for (const path of this.paths) {
      this.particleSystem.addParticlesFromPoints(
        path.points,
        0.5, // Use 50% of points
        path.color,
        [2, 6], // Size range
        [40, 80] // Life range
      );
    }

    // Add some explosion particles at the center
    this.particleSystem.addParticles(
      30, // Number of particles
      this.explosionCenter.x,
      this.explosionCenter.y,
      '#FFA500', // Orange particles
      [4, 10], // Size range
      [30, 60] // Life range
    );

    // Apply an outward force to simulate explosion
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const force = Vector.fromAngle(angle, 0.3 + Math.random() * 0.3);
      this.particleSystem.applyForce(force);
    }
  }

  /**
   * Add a secondary explosion at a random point
   */
  private addSecondaryExplosion(): void {
    // Find a random active particle to explode
    if (this.particleSystem.getParticleCount() > 0) {
      const offset = new Vector(
        (Math.random() * 2 - 1) * 50,
        (Math.random() * 2 - 1) * 50
      );

      const explosionPoint = new Vector(
        this.explosionCenter.x + offset.x,
        this.explosionCenter.y + offset.y
      );

      // Add some explosion particles
      this.particleSystem.addParticles(
        10, // Number of particles
        explosionPoint.x,
        explosionPoint.y,
        '#FF4500', // OrangeRed particles
        [3, 8], // Size range
        [20, 40] // Life range
      );

      // Add an explosion ring
      this.explosionRings.push({
        x: explosionPoint.x,
        y: explosionPoint.y,
        radius: 5,
        maxRadius: 30 + Math.random() * 20,
        speed: 1 + Math.random(),
        alpha: 0.8,
        color: '#FF4500'
      });
    }
  }

  /**
   * Add an explosion ring
   */
  private addExplosionRing(): void {
    this.explosionRings.push({
      x: this.explosionCenter.x,
      y: this.explosionCenter.y,
      radius: this.explosionRadius * 0.5,
      maxRadius: this.maxExplosionRadius,
      speed: 2 + Math.random() * 2,
      alpha: 0.7,
      color: '#FFA500'
    });
  }

  /**
   * Draw the explosion and particles
   */
  public draw(): void {
    if (!this.isAnimating && this.particleSystem.isEmpty() && this.explosionRings.length === 0) return;

    // Draw explosion rings
    for (const ring of this.explosionRings) {
      this.ctx.save();
      this.ctx.globalAlpha = ring.alpha;
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Draw particles
    this.particleSystem.draw(this.ctx);
  }

  /**
   * Check if the animation is currently playing
   */
  public isPlaying(): boolean {
    return this.isAnimating || !this.particleSystem.isEmpty() || this.explosionRings.length > 0;
  }

  /**
   * Stop the animation
   */
  public stop(): void {
    this.isAnimating = false;
    this.particleSystem.clear();
    this.explosionRings = [];
  }

  /**
   * Reset the animation state and clear paths
   */
  public reset(): void {
    this.paths = [];
    this.animationProgress = 0;
    this.explosionRadius = 0;
    this.explosionCenter = new Vector(this.canvasWidth / 2, this.canvasHeight / 2); // Reset to center of canvas
    this.stop();
  }
}

interface ExplosionRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
  color: string;
}
