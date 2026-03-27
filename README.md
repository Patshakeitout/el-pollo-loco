# El Pollo Loco

A 2D side-scrolling jump-and-run game built entirely with **object-oriented JavaScript** and the **HTML5 Canvas API** — no frameworks, no libraries, no dependencies.

> Help Pepe navigate through a dangerous desert, defeat chickens, collect coins and bottles, and take on the mighty Endboss in an epic final battle.

![HTML5](https://img.shields.io/badge/HTML5-Canvas-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Responsive-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![OOP](https://img.shields.io/badge/Architecture-OOP-blueviolet)

---

## Table of Contents

- [Features](#features)
- [OOP Architecture](#oop-architecture)
- [Class Hierarchy](#class-hierarchy)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Game Controls](#game-controls)
- [Technical Highlights](#technical-highlights)
- [Credits](#credits)

---

## Features

- Canvas-based 2D rendering with a custom game loop (`requestAnimationFrame`)
- Full class-based OOP architecture with inheritance and polymorphism
- Collision detection system using offset boxes and distance calculations
- Dynamic enemy spawning — the Endboss summons minions when hit
- Centralized audio management via Singleton pattern (`AudioHub`)
- Interval management system (`IntervalHub`) for decoupled game timing
- Cinematic camera system with bidirectional tracking near the Endboss
- Animated UI transitions (curtain countdown, pixel-build effects, disco win screen)
- Responsive HTML/CSS status bar with semantic markup
- Cheat code support for testing and demonstration
- Mobile-friendly touch controls
- Pause, mute, fullscreen, and home navigation during gameplay

---

## OOP Architecture

The entire game is built on a strict **object-oriented class hierarchy** using native ES6+ class syntax — no transpilers, no bundlers, pure JavaScript.

### Design Principles

| Principle | Implementation |
|---|---|
| **Inheritance** | `DrawableObject` → `MovableObject` → `Character`, `Chicken`, `Chick`, `EndBoss`, `ThrowableObject` |
| **Encapsulation** | Each class manages its own state, animation frames, and physics |
| **Polymorphism** | Enemies share a common interface (`hit()`, `isDead()`, `animate()`) but implement unique behavior |
| **Singleton** | `AudioHub` ensures a single centralized audio controller across the entire application |
| **Composition** | `World` composes level data, status icons, keyboard input, and all game entities |
| **Separation of Concerns** | Game logic, UI management, screen transitions, and story are split into dedicated modules |

### Key Patterns

- **Game Loop** — `World.draw()` drives rendering via `requestAnimationFrame`, while `IntervalHub` manages fixed-timestep logic intervals independently
- **Singleton** — `AudioHub.getInstance()` guarantees one audio manager, preventing duplicate playback and enabling global mute/volume control
- **Observer-like Updates** — `StatusIcon` instances bind to DOM elements and reactively update the UI when game state changes via `setAmount()`
- **Entity-Component Model** — All game objects inherit from `DrawableObject`, gaining image loading, caching, and rendering for free

---

## Class Hierarchy

```
DrawableObject
│   loadImage(), draw(), loadImages()
│
└── MovableObject
    │   gravity, collision detection, offset boxes
    │   hit(), isDead(), isHurt(), isAboveGround()
    │
    ├── Character (Pepe)
    │     movement, jump, camera tracking, cinematic mode
    │
    ├── Chicken
    │     patrol AI, random sizing, death animation
    │
    ├── Chick
    │     smaller variant, jumping behavior
    │
    ├── EndBoss
    │     multi-phase AI, rolling attack, minion spawning
    │
    ├── ThrowableObject
    │     arc physics, splash animation, enemy hit detection
    │
    └── CollectableObject
          coins, bottles, collection animation

AudioHub (Singleton)
    music/SFX management, mute, volume control

IntervalHub (Static)
    centralized interval management, pause support

World (Composition Root)
    game loop, collision checks, entity management

StatusIcon
    DOM-bound reactive UI elements

Keyboard
    input state tracking (desktop + mobile)

Level
    level data container (enemies, backgrounds, clouds, collectables)
```

---

## Project Structure

```
el-pollo-loco/
├── assets/                         # Game assets (sprites, audio, fonts)
│   ├── audio/                      # Music and sound effects
│   ├── fonts/                      # Custom game fonts
│   └── images/                     # Sprites, backgrounds, UI graphics
├── imprint.html                    # Legal imprint page
├── index.html                      # Entry point — game container and script loading
├── js/                             # Game logic modules
│   ├── game-screens.js             # Screen transitions, overlays, curtain animation
│   ├── game-story.js               # Story typewriter, skip logic
│   ├── game-ui.js                  # Button handlers, mute, fullscreen, tutorial
│   └── game.js                     # Core init, start, restart, pause, cheat code
├── levels/                         # Level configurations
│   └── level1.js                   # Level 1 configuration and entity spawning
├── models/                         # OOP class definitions (16 classes)
│   ├── audioHub.class.js           # Singleton audio manager
│   ├── background.class.js         # Parallax background layers
│   ├── character.class.js          # Player character (Pepe)
│   ├── chick.class.js              # Small enemy variant
│   ├── chicken.class.js            # Regular enemy
│   ├── cloud.class.js              # Animated clouds
│   ├── collectable-object.class.js # Coins and bottles
│   ├── drawable-object.class.js    # Base class — image loading and rendering
│   ├── endBoss.class.js            # Final boss with multi-phase AI
│   ├── intervalHub.class.js        # Centralized interval management
│   ├── keyboard.class.js           # Input handling
│   ├── level.class.js              # Level data structure
│   ├── movable-object.class.js     # Physics, gravity, collision detection
│   ├── status-icon.class.js        # DOM-bound status indicators
│   ├── throwable-object.class.js   # Bottle projectiles
│   └── world.class.js              # Game world — loop, collisions, entities
├── privacy-policy.html             # Privacy policy page
├── README.md                       # Project documentation (this file)
└── styles/                         # Modular stylesheet files
    ├── base.css                    # Fonts, body, header, general settings
    ├── controls.css                # In-game controls and control overlays
    ├── curtain.css                 # Curtain overlay and countdown animations
    ├── game-container.css          # Game canvas and aspect ratio wrapper
    ├── global.css                  # Main stylesheet (legacy reference)
    ├── legal-pages.css             # Styling for imprint and privacy pages
    ├── mobile.css                  # Mobile joystick and touch controls
    ├── responsive.css              # Media queries and responsive design
    └── screens.css                 # Start, story, and end screens
```

---

## Getting Started

No build tools, no installation, no dependencies. Just a browser.

```bash
# Clone the repository
git clone https://github.com/your-username/el-pollo-loco.git

# Open in browser
open index.html
```

Or use any local development server:

```bash
# Python
python -m http.server 8080

# VS Code
# Install "Live Server" extension → right-click index.html → "Open with Live Server"
```

---

## Game Controls

### Desktop

| Key | Action |
|---|---|
| `Arrow Left / Right` | Move |
| `Arrow Up` / `Space` | Jump |
| `Enter` | Throw bottle |

### Mobile

Touch controls are displayed automatically on mobile devices.

---

## Technical Highlights

### Pure Vanilla JavaScript
The entire codebase — 16 classes, 4 game modules, 1 level configuration — runs without any external dependency. No jQuery, no React, no Phaser, no webpack. Every line is handwritten ES6+ JavaScript loaded via `<script>` tags.

### Canvas Rendering Pipeline
The `World.draw()` method orchestrates all rendering through a translation-based camera system. Each frame: clear canvas → translate to camera position → draw backgrounds, enemies, clouds, collectables, player, projectiles → restore translation. All at 60 FPS via `requestAnimationFrame`.

### Collision Detection
Two-tier collision system: bounding box checks for broad phase, then precise offset box comparisons for narrow phase. Stomp detection uses vertical position and velocity checks to distinguish jumping-on-enemy from walking-into-enemy.

### Audio Architecture
`AudioHub` implements the Singleton pattern to provide a single point of control for all game audio. Music tracks are managed with crossfade logic. Sound effects are fire-and-forget with automatic replay. Global mute and per-category volume controls are built in.

### Interval Management
`IntervalHub` centralizes all `setInterval` calls, enabling global pause/resume and clean teardown on game restart — preventing the common browser game bug of orphaned intervals stacking up.

---

## Credits

Developed with passion in cooperation with [Developer Akademie](https://developerakademie.com).
