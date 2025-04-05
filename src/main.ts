import { Game } from './core/Game';

// Get the canvas container
const canvasContainer = document.getElementById('canvas-container');

if (!canvasContainer) {
  console.error('Canvas container not found!');
} else {
  // Initialize the game
  const game = new Game(canvasContainer);
  game.start();
}
