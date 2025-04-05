import { GameState, DestructionMethod } from './GameState';
import { Canvas } from '../drawing/Canvas';
import { DoodleManager } from '../drawing/DoodleManager';
import { Renderer } from '../drawing/Renderer';
import { HammerSmash } from '../animations/HammerSmash';
import { Exploder } from '../animations/Exploder';
import { Burner } from '../animations/Burner';

export class Game {
  private gameState: GameState;
  private canvas: Canvas;
  private doodleManager: DoodleManager;
  private renderer: Renderer;
  private animationFrameId: number | null = null;

  // Animation instances
  private hammerSmash: HammerSmash;
  private exploder: Exploder;
  private burner: Burner;

  // UI elements
  private destructionButtons!: HTMLDivElement;

  // Flag to track if a destruction method has been used
  private destructionMethodUsed: boolean = false;

  constructor(container: HTMLElement) {
    this.gameState = new GameState();
    this.canvas = new Canvas(container);
    this.doodleManager = new DoodleManager();
    this.renderer = new Renderer(this.canvas.getContext());

    // Initialize animations
    const ctx = this.canvas.getContext();
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();

    this.hammerSmash = new HammerSmash(ctx, width, height);
    this.exploder = new Exploder(ctx, width, height);
    this.burner = new Burner(ctx, width, height);

    // Set completion callbacks
    this.hammerSmash.setOnComplete(() => this.onAnimationComplete());
    this.exploder.setOnComplete(() => this.onAnimationComplete());
    this.burner.setOnComplete(() => this.onAnimationComplete());

    // Create destruction method buttons
    this.createDestructionButtons();

    this.setupEventListeners();

    // Add window unload event listener to stop the game loop when navigating away
    window.addEventListener('beforeunload', () => this.stop());
  }

  private setupEventListeners(): void {
    const canvasElement = this.canvas.getElement();

    // Mouse events
    canvasElement.addEventListener('mousedown', this.handlePointerStart.bind(this));
    canvasElement.addEventListener('mousemove', this.handlePointerMove.bind(this));
    canvasElement.addEventListener('mouseup', this.handlePointerEnd.bind(this));
    canvasElement.addEventListener('mouseout', this.handlePointerEnd.bind(this));

    // Touch events for mobile
    canvasElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
    canvasElement.addEventListener('touchmove', this.handleTouchMove.bind(this));
    canvasElement.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handlePointerStart(e: MouseEvent): void {
    e.preventDefault();

    // Prevent drawing if an animation is playing
    if (this.gameState.isAnimationPlaying()) return;

    const { offsetX, offsetY } = e;

    // Only reset animation classes and clear paths if a destruction method has been used
    if (this.destructionMethodUsed) {
      // Reset animation classes when starting a new doodle
      this.hammerSmash.reset();
      this.exploder.reset();
      this.burner.reset();

      // Clear existing paths
      this.doodleManager.clearPaths();

      // Reset the destruction method used flag
      this.destructionMethodUsed = false;
    }

    this.gameState.setDrawing(true);
    this.doodleManager.startPath(offsetX, offsetY);
  }

  private handlePointerMove(e: MouseEvent): void {
    if (!this.gameState.isDrawing()) return;

    const { offsetX, offsetY } = e;
    this.doodleManager.addPoint(offsetX, offsetY);
    this.render();
  }

  private handlePointerEnd(e: MouseEvent): void {
    e.preventDefault();
    this.gameState.setDrawing(false);
    this.doodleManager.endPath();
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    if (e.touches.length !== 1) return;

    // Prevent drawing if an animation is playing
    if (this.gameState.isAnimationPlaying()) return;

    const touch = e.touches[0];
    const rect = this.canvas.getElement().getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Only reset animation classes and clear paths if a destruction method has been used
    if (this.destructionMethodUsed) {
      // Reset animation classes when starting a new doodle
      this.hammerSmash.reset();
      this.exploder.reset();
      this.burner.reset();

      // Clear existing paths
      this.doodleManager.clearPaths();

      // Reset the destruction method used flag
      this.destructionMethodUsed = false;
    }

    this.gameState.setDrawing(true);
    this.doodleManager.startPath(x, y);
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    if (!this.gameState.isDrawing() || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const rect = this.canvas.getElement().getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    this.doodleManager.addPoint(x, y);
    this.render();
  }

  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    this.gameState.setDrawing(false);
    this.doodleManager.endPath();
  }

  /**
   * Create UI buttons for selecting destruction methods
   */
  private createDestructionButtons(): void {
    // Get the controls container
    const controlsContainer = document.getElementById('controls');
    if (!controlsContainer) {
      console.error('Controls container not found!');
      return;
    }

    // Create container for buttons
    this.destructionButtons = document.createElement('div');
    this.destructionButtons.className = 'destruction-buttons';

    // Create buttons for each destruction method
    const methods = [
      { id: DestructionMethod.HAMMER, label: '🔨 Hammer', color: '#4CAF50' },
      { id: DestructionMethod.EXPLOSION, label: '💥 Explode', color: '#FF9800' },
      { id: DestructionMethod.FIRE, label: '🔥 Burn', color: '#F44336' }
    ];

    for (const method of methods) {
      const button = document.createElement('button');
      button.textContent = method.label;

      // Add appropriate class based on destruction method
      let methodClass = '';
      switch(method.id) {
        case DestructionMethod.HAMMER:
          methodClass = 'hammer';
          break;
        case DestructionMethod.EXPLOSION:
          methodClass = 'explosion';
          break;
        case DestructionMethod.FIRE:
          methodClass = 'fire';
          break;
      }
      button.className = `destruction-button ${methodClass}`;

      // Add click event
      button.addEventListener('click', () => {
        this.startAnimation(method.id);
      });

      this.destructionButtons.appendChild(button);
    }

    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = '🔄 Reset';
    resetButton.className = 'reset-button';

    resetButton.addEventListener('click', () => {
      this.resetGame();
    });

    this.destructionButtons.appendChild(resetButton);

    // Disable all buttons initially
    const buttons = this.destructionButtons.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = true;
    });

    // Add to controls container
    controlsContainer.appendChild(this.destructionButtons);
  }

  /**
   * Start the selected animation
   */
  private startAnimation(method: DestructionMethod): void {
    if (this.gameState.isAnimationPlaying()) return;

    // Stop the main game loop before starting animation
    this.stop();

    // Set the destruction method
    this.gameState.setDestructionMethod(method);
    this.gameState.setAnimating(true);

    // Disable drawing while animation is playing
    this.gameState.setDrawing(false);

    // Mark that a destruction method has been used
    this.destructionMethodUsed = true;

    // Disable destruction buttons during animation
    const buttons = this.destructionButtons.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = true;
    });

    // Set paths for the animation
    const paths = this.doodleManager.getPaths();

    // Start the appropriate animation
    switch (method) {
      case DestructionMethod.HAMMER:
        this.hammerSmash.setPaths(paths);
        this.hammerSmash.start();
        break;
      case DestructionMethod.EXPLOSION:
        this.exploder.setPaths(paths);
        this.exploder.start();
        break;
      case DestructionMethod.FIRE:
        this.burner.setPaths(paths);
        this.burner.start();
        break;
    }

    // Restart the game loop to handle animation rendering
    this.start();
  }

  /**
   * Handle animation completion
   */
  private onAnimationComplete(): void {
    // Stop the game loop since animation is complete
    this.stop();

    const currentMethod = this.gameState.getDestructionMethod();
    this.gameState.setAnimating(false);
    this.gameState.setDestructionMethod(DestructionMethod.NONE);

    // Handle different destruction methods
    if (currentMethod === DestructionMethod.HAMMER) {
      // For hammer, update the doodle manager with the flattened paths
      // This allows the flattened drawing to persist after hammer smashes
      const flattenedPaths = this.hammerSmash.getPaths();
      this.doodleManager.setPaths(flattenedPaths);
    } else {
      // For other methods, clear the doodle
      this.doodleManager.clearPaths();
    }

    // Enable reset button after animation
    const resetButton = this.destructionButtons.querySelector('button:last-child');
    if (resetButton) {
      resetButton.classList.remove('disabled');
    }

    // Restart the game loop to continue rendering
    this.start();
  }

  /**
   * Reset the game state
   */
  private resetGame(): void {
    // Stop the game loop
    this.stop();

    // Stop any running animations and reset their state
    this.hammerSmash.reset();
    this.exploder.reset();
    this.burner.reset();

    // Reset game state
    this.gameState.reset();

    // Reset the destruction method used flag
    this.destructionMethodUsed = false;

    // Clear the doodle
    this.doodleManager.clearPaths();

    // Disable destruction buttons
    const buttons = this.destructionButtons.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = true;
    });

    // Restart the game loop
    this.start();
  }

  /**
   * Check if there's a valid doodle to animate
   */
  private hasValidDoodle(): boolean {
    const paths = this.doodleManager.getPaths();
    return paths.length > 0 && paths.some(path => path.points.length > 1);
  }

  private render(): void {
    // Clear the canvas
    this.renderer.clear();

    // If we're not animating, just draw the doodle
    if (!this.gameState.isAnimationPlaying()) {
      this.renderer.drawDoodle(this.doodleManager.getPaths());

      // Always show destruction buttons, but enable/disable based on valid doodle
      const hasValidDoodle = this.hasValidDoodle();
      const buttons = this.destructionButtons.querySelectorAll('button');
      buttons.forEach(button => {
        button.disabled = !hasValidDoodle;
      });
    } 
    // Otherwise, update and draw the active animation
    else {
      const method = this.gameState.getDestructionMethod();

      switch (method) {
        case DestructionMethod.HAMMER:
          this.hammerSmash.update();
          this.hammerSmash.draw();
          break;
        case DestructionMethod.EXPLOSION:
          this.exploder.update();
          this.exploder.draw();
          break;
        case DestructionMethod.FIRE:
          this.burner.update();
          this.burner.draw();
          break;
      }
    }
  }

  private gameLoop(): void {
    // Render the current state
    this.render();

    // Continue the game loop
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  public start(): void {
    // Initialize the game loop
    this.gameLoop();
  }

  public stop(): void {
    // Stop the game loop
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
