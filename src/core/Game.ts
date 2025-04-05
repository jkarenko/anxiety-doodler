import { GameState } from './GameState';
import { Canvas } from '../drawing/Canvas';
import { DoodleManager } from '../drawing/DoodleManager';
import { Renderer } from '../drawing/Renderer';

export class Game {
  private container: HTMLElement;
  private gameState: GameState;
  private canvas: Canvas;
  private doodleManager: DoodleManager;
  private renderer: Renderer;
  private animationFrameId: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.gameState = new GameState();
    this.canvas = new Canvas(container);
    this.doodleManager = new DoodleManager();
    this.renderer = new Renderer(this.canvas.getContext());
    
    this.setupEventListeners();
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
    const { offsetX, offsetY } = e;
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
    
    const touch = e.touches[0];
    const rect = this.canvas.getElement().getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
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

  private render(): void {
    this.renderer.clear();
    this.renderer.drawDoodle(this.doodleManager.getPaths());
  }

  private gameLoop(): void {
    // For now, we just render the current state
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