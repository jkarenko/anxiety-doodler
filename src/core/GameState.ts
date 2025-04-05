export enum DestructionMethod {
  NONE = 'none',
  HAMMER = 'hammer',
  EXPLOSION = 'explosion',
  FIRE = 'fire'
}

export class GameState {
  private isDrawingActive: boolean = false;
  private currentDestructionMethod: DestructionMethod = DestructionMethod.NONE;
  private isAnimating: boolean = false;

  /**
   * Check if drawing is currently active
   */
  public isDrawing(): boolean {
    return this.isDrawingActive;
  }

  /**
   * Set the drawing state
   */
  public setDrawing(isDrawing: boolean): void {
    this.isDrawingActive = isDrawing;
  }

  /**
   * Get the current destruction method
   */
  public getDestructionMethod(): DestructionMethod {
    return this.currentDestructionMethod;
  }

  /**
   * Set the destruction method
   */
  public setDestructionMethod(method: DestructionMethod): void {
    this.currentDestructionMethod = method;
  }

  /**
   * Check if an animation is currently playing
   */
  public isAnimationPlaying(): boolean {
    return this.isAnimating;
  }

  /**
   * Set the animation state
   */
  public setAnimating(isAnimating: boolean): void {
    this.isAnimating = isAnimating;
  }

  /**
   * Reset the game state
   */
  public reset(): void {
    this.isDrawingActive = false;
    this.currentDestructionMethod = DestructionMethod.NONE;
    this.isAnimating = false;
  }
}