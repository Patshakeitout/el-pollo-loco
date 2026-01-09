let canvas;
let world;
let keyboard = new Keyboard();
let audioHub;


/**
 * Initializes the landing page and audio (does NOT start the game yet).
 */
async function init() {
    canvas = document.getElementById('canvas');
    await initAudio();
    setupStartButton();
    // Hide start screen initially
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.classList.add('d-none');
    }
    showStartOverlay();
}


function showStartOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'start-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;
    overlay.innerHTML = `<button id="start-btn-overlay" style="font-size:2rem;padding:1rem 2rem;">Start</button>`;
    document.body.appendChild(overlay);

    const startBtnOverlay = document.getElementById('start-btn-overlay');
    startBtnOverlay.addEventListener('click', () => {
        playDesertWindsWhispering();
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.style.opacity = '0';
            startScreen.style.filter = 'blur(8px)';
            startScreen.classList.remove('d-none');
            startScreen.style.display = 'flex';
            // Allow browser to render with opacity 0 and blur before animating
            setTimeout(() => pixelBuildStartScreen(), 30);
        }
        overlay.remove();
    });
}


/**
 * Sets up the start button to begin the game.
 */
function setupStartButton() {
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', startGame);
}


/**
 * Initializes the AudioHub singleton and loads all sounds.
 */
async function initAudio() {
    audioHub = AudioHub.getInstance();
    await audioHub.loadConfig();
}


/**
 * Plays desert-winds-whispering.mp3 on page load.
 */
function playDesertWindsWhispering() {
    let audio = document.getElementById('desert-winds-audio');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'desert-winds-audio';
        audio.src = 'assets/audio/game/desert-winds-whispering.mp3';
        audio.loop = true;
        audio.volume = 0.2;
        audio.autoplay = true;
        document.body.appendChild(audio);
    }
    audio.play().catch((err) => {
        audio.muted = true;
        audio.play().then(() => {
            setTimeout(() => {
                audio.muted = false;
            }, 500);
        }).catch((err2) => {
            document.body.addEventListener('click', () => audio.play(), { once: true });
            console.warn('Autoplay blocked. Will play on user interaction.', err2);
        });
        console.warn('Autoplay blocked. Trying muted play.', err);
    });
}


/**
 * Pixel build effect for start screen.
 */
function pixelBuildStartScreen() {
    const startScreen = document.getElementById('start-screen');
    if (!startScreen) return;
    startScreen.style.transition = 'opacity 0.9s linear, filter 0.9s linear';
    startScreen.style.opacity = '0';
    startScreen.style.filter = 'blur(8px)';
    let step = 0;
    const steps = 60;
    const interval = IntervalHub.startInterval(() => {
        step++;
        startScreen.style.opacity = (step / steps).toString();
        startScreen.style.filter = `blur(${8 - (step / steps) * 8}px)`;
        if (step >= steps) {
            startScreen.style.opacity = '1';
            startScreen.style.filter = 'none';
            IntervalHub.stopAllIntervals(interval);
        }
    }, 30);
}


/**
 * Starts the game - hides start screen, shows canvas, initializes world.
 */
function startGame() {
    // Stop desert-winds-whispering if playing
    const winds = document.getElementById('desert-winds-audio');
    if (winds) {
        winds.pause();
        winds.currentTime = 0;
        winds.remove();
    }
    // Hide start screen, show canvas
    document.getElementById('start-screen').classList.add('d-none');
    document.getElementById('canvas').classList.remove('d-none');
    // Create level when starting the game
    initLevel1();
    // Initialize the game world
    world = new World(canvas, keyboard);
    // Play sounds
    if (audioHub && audioHub.isLoaded) {
        audioHub.playGameStartSound();
        setTimeout(() => {
            audioHub.playBackgroundMusic();
        }, 500);
    }
}


/**
 * Shows the game over overlay, which is hidden by default.
 * This function can be called when Pepe dies to display the game over screen.
 * @example
 * function onPepeDeath() {
 *   // ...existing death logic...
 *   showGameOverOverlay();
 * }
 */
function showGameOverOverlay() {
    const overlay = document.querySelector('.game-over-frame');
    if (overlay) {
        overlay.classList.remove('d-none');
        overlay.style.display = 'flex';
    }
}


// Attach event listeners for try-again and home buttons if present
window.addEventListener('DOMContentLoaded', () => {
    const tryAgainBtn = document.getElementById('try-again-btn');
    if (tryAgainBtn) {
        tryAgainBtn.onclick = function() {
            IntervalHub.stopAllIntervals();
            restartGame();
            document.querySelector('.game-over-frame').classList.add('d-none');
        };
    }
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.onclick = function() {
            IntervalHub.stopAllIntervals();
            audioHub.stopAll();
            showStartScreen();
            document.querySelector('.game-over-frame').classList.add('d-none');
        };
    }
});


/**
 * Toggles audio mute state (can be connected to mute button).
 * @returns {boolean} Current mute state
 */
function toggleMute() {
    if (audioHub) {
        return audioHub.toggleMute();
    }
    return false;
}


/**
 * Restarts the game by resetting world, level, and UI states.
 */
function restartGame() {
    IntervalHub.stopAllIntervals();
    if (audioHub) {
        audioHub.stopAll();
    }
    document.querySelector('.game-over-frame').classList.add('d-none');
    initLevel1();
    world = new World(canvas, keyboard);
    document.getElementById('canvas').classList.remove('d-none');
    document.getElementById('start-screen').classList.add('d-none');
    if (audioHub && audioHub.isLoaded) {
        audioHub.playGameStartSound();
        setTimeout(() => {
            audioHub.playBackgroundMusic();
        }, 500);
    }
}


/**
 * Shows the pixelized start screen and hides game canvas and overlays.
 * Used on page load and when clicking Home.
 */
function showStartScreen() {
    playDesertWindsWhispering();
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.style.opacity = '0';
        startScreen.style.filter = 'blur(8px)';
        startScreen.classList.remove('d-none');
        startScreen.style.display = 'flex';
        setTimeout(() => pixelBuildStartScreen(), 30);
    }
    // Hide canvas and overlays
    document.getElementById('canvas').classList.add('d-none');
    document.querySelector('.game-over-frame').classList.add('d-none');
    // Remove any start overlay if present
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.remove();
}