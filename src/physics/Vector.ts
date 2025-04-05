export class Vector {
  constructor(public x: number = 0, public y: number = 0) {}

  /**
   * Create a copy of this vector
   */
  public clone(): Vector {
    return new Vector(this.x, this.y);
  }

  /**
   * Add another vector to this one
   */
  public add(v: Vector): Vector {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Subtract another vector from this one
   */
  public subtract(v: Vector): Vector {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Multiply this vector by a scalar
   */
  public multiply(scalar: number): Vector {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Divide this vector by a scalar
   */
  public divide(scalar: number): Vector {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  /**
   * Get the magnitude (length) of this vector
   */
  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalize this vector (make it unit length)
   */
  public normalize(): Vector {
    const mag = this.magnitude();
    if (mag > 0) {
      this.divide(mag);
    }
    return this;
  }

  /**
   * Set the magnitude of this vector
   */
  public setMagnitude(mag: number): Vector {
    this.normalize();
    this.multiply(mag);
    return this;
  }

  /**
   * Calculate the dot product with another vector
   */
  public dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Calculate the distance to another vector
   */
  public distance(v: Vector): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Limit the magnitude of this vector
   */
  public limit(max: number): Vector {
    if (this.magnitude() > max) {
      this.normalize();
      this.multiply(max);
    }
    return this;
  }

  /**
   * Get the angle of this vector in radians
   */
  public heading(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Rotate this vector by an angle in radians
   */
  public rotate(angle: number): Vector {
    const newHeading = this.heading() + angle;
    const mag = this.magnitude();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  }

  /**
   * Create a vector from an angle and magnitude
   */
  public static fromAngle(angle: number, magnitude: number = 1): Vector {
    return new Vector(
      Math.cos(angle) * magnitude,
      Math.sin(angle) * magnitude
    );
  }

  /**
   * Create a random 2D vector
   */
  public static random2D(): Vector {
    return Vector.fromAngle(Math.random() * Math.PI * 2);
  }
}