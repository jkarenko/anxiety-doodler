# Anxiety Doodler

A mobile-friendly web game where players doodle their anxieties and destroy them through amusing animations.

## Concept

Players draw their stress/anxiety on a vector canvas and then choose from three destruction methods:
- Hammer smash
- Explosion
- Fire combustion

## Technology Stack

- **Language**: TypeScript
- **Build Tool**: Vite (vanilla-ts template)
- **Rendering**: HTML5 Canvas API
- **Deployment**: GitHub Pages via GitHub Actions

## Project Structure

```
src/
├── core/
│   ├── Game.ts           # Main controller
│   └── GameState.ts      # State management
├── drawing/
│   ├── Canvas.ts         # Canvas setup
│   ├── DoodleManager.ts  # Handling vector paths
│   └── Renderer.ts       # Drawing to canvas
├── animations/
│   ├── HammerSmash.ts    # Hammer animation
│   ├── Exploder.ts       # Explosion effect
│   └── Burner.ts         # Fire animation
├── physics/
│   ├── ParticleSystem.ts # For explosions
│   └── Vector.ts         # Vector math utilities
├── ui/
│   ├── Button.ts         # Button component
│   └── Menu.ts           # UI screens
├── audio/
│   ├── SoundManager.ts   # Audio controller
│   └── effects/          # Sound assets
└── main.ts               # Entry point
```

## Development Workflow

1. **Setup**
   ```bash
   npm create vite@latest anxiety-doodler -- --template vanilla-ts
   cd anxiety-doodler
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Testing**
    - Test on desktop browsers
    - Mobile device testing via local network or ngrok

## Deployment

Automated GitHub Actions workflow for GitHub Pages:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

Configuration in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/anxiety-doodler/',
  // other config...
})
```

## Implementation Plan

1. **Phase 1: Setup & Core**
    - Project initialization
    - Canvas drawing implementation
    - Basic state management

2. **Phase 2: Animations**
    - Implement destruction animations
    - Physics for particle effects
    - Animation timing and sequencing

3. **Phase 3: UI & Polish**
    - Mobile-friendly UI elements
    - Sound effects integration
    - Touch events optimization

4. **Phase 4: Testing & Deployment**
    - Cross-browser testing
    - Mobile device testing
    - CI/CD setup for automatic deployment

## Performance Considerations

- Optimize canvas operations for mobile
- Use requestAnimationFrame for smooth animations
- Implement touch event debouncing
- Ensure assets are properly sized for mobile

## License

MIT