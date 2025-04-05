import { Vector } from './Vector';
import { Point } from '../drawing/DoodleManager';

export interface Particle {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  isDead: boolean;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private origin: Vector;
  private gravity: Vector;

  constructor(x: number, y: number) {
    this.origin = new Vector(x, y);
    this.gravity = new Vector(0, 0.1); // Default gravity pulls downward
  }

  /**
   * Set the origin point of the particle system
   */
  public setOrigin(x: number, y: number): void {
    this.origin.x = x;
    this.origin.y = y;
  }

  /**
   * Set the gravity vector
   */
  public setGravity(x: number, y: number): void {
    this.gravity.x = x;
    this.gravity.y = y;
  }

  /**
   * Add a single particle to the system
   */
  public addParticle(
    x: number = this.origin.x,
    y: number = this.origin.y,
    color: string = '#FF5722',
    size: number = 5,
    life: number = 60
  ): void {
    const particle: Particle = {
      position: new Vector(x, y),
      velocity: Vector.random2D().multiply(Math.random() * 2 + 1),
      acceleration: this.gravity.clone(),
      color,
      size,
      life,
      maxLife: life,
      isDead: false
    };

    this.particles.push(particle);
  }

  /**
   * Add multiple particles at once
   */
  public addParticles(
    count: number,
    x: number = this.origin.x,
    y: number = this.origin.y,
    color: string = '#FF5722',
    sizeRange: [number, number] = [3, 8],
    lifeRange: [number, number] = [30, 90]
  ): void {
    for (let i = 0; i < count; i++) {
      const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
      const life = Math.floor(Math.random() * (lifeRange[1] - lifeRange[0]) + lifeRange[0]);
      this.addParticle(x, y, color, size, life);
    }
  }

  /**
   * Create particles from a path's points
   */
  public addParticlesFromPoints(
    points: Point[],
    density: number = 0.5, // Percentage of points to convert to particles
    color: string = '#FF5722',
    sizeRange: [number, number] = [3, 8],
    lifeRange: [number, number] = [30, 90]
  ): void {
    // Sample points based on density
    const sampleCount = Math.max(1, Math.floor(points.length * density));
    const step = Math.floor(points.length / sampleCount);

    for (let i = 0; i < points.length; i += step) {
      const point = points[i];
      const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
      const life = Math.floor(Math.random() * (lifeRange[1] - lifeRange[0]) + lifeRange[0]);
      
      // Add some randomness to the position
      const jitter = 2;
      const x = point.x + (Math.random() * jitter * 2 - jitter);
      const y = point.y + (Math.random() * jitter * 2 - jitter);
      
      this.addParticle(x, y, color, size, life);
    }
  }

  /**
   * Update all particles in the system
   */
  public update(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Apply physics
      p.velocity.add(p.acceleration);
      p.position.add(p.velocity);
      p.acceleration.multiply(0); // Reset acceleration
      
      // Reduce life
      p.life--;
      
      // Mark as dead if life is depleted
      if (p.life <= 0) {
        p.isDead = true;
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Apply a force to all particles
   */
  public applyForce(force: Vector): void {
    for (const p of this.particles) {
      p.acceleration.add(force);
    }
  }

  /**
   * Draw all particles to the canvas
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      // Calculate alpha based on remaining life
      const alpha = p.life / p.maxLife;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Check if the particle system is empty
   */
  public isEmpty(): boolean {
    return this.particles.length === 0;
  }

  /**
   * Get the number of active particles
   */
  public getParticleCount(): number {
    return this.particles.length;
  }

  /**
   * Clear all particles
   */
  public clear(): void {
    this.particles = [];
  }
}