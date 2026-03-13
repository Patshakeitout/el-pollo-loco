let canvas;
let world;
let keyboard;
let audioHub;


/**
 * Initializes the landing page and audio (does NOT start the game yet).
 */
async function init() {
    canvas = document.getElementById('canvas');
    canvas.classList.add('d-none');

    keyboard = new Keyboard();

    await initAudio();

    setupStartButton();
    setupMuteButton();
    // Hide start screen initially
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.classList.add('d-none');
    }
    showStartOverlay();
}


/**
 * Sets up the Mute Button state and event listener.
 */
function setupMuteButton() {
    const muteBtn = document.getElementById('mute-btn');
    if (!muteBtn) return;

    let isMuted = localStorage.getItem('elPolloMute') === 'true';
    if (audioHub) {
        audioHub.isMuted = isMuted;
        if (isMuted) {
            audioHub.stopAll();
        }
    }

    muteBtn.textContent = isMuted ? '🔇' : '🔈';

    /**
     * Toggles the mute state of the game and updates the button text.
     * Saves the current mute state to local storage.
     */
    muteBtn.onclick = function () {
        if (!audioHub) return;

        const newMutedState = audioHub.toggleMute();
        localStorage.setItem('elPolloMute', newMutedState);

        // Update Icon
        muteBtn.textContent = newMutedState ? '🔇' : '🔈';

        if (!newMutedState) {
            const startScreen = document.getElementById('start-screen');
            const startOverlay = document.getElementById('start-overlay');
            const canvas = document.getElementById('canvas');

            // A: If the generic "Start Overlay" (Click to Play) is still there, do nothing.
            // The user hasn't started the interaction yet.
            if (startOverlay) return;

            // B: If Start Screen is visible, play Menu Music
            if (startScreen && !startScreen.classList.contains('d-none')) {
                audioHub.playMenuMusic();
            }
            // C: If Canvas is visible (Game is running), play Background Music
            else if (canvas && !canvas.classList.contains('d-none')) {
                // Determine if we should play standard or battle music? 
                // For simplicity, playBackgroundMusic() usually handles the main loop.
                audioHub.playBackgroundMusic();
            }
        };
    }
}


function showStartOverlay() {
    const startOverlay = document.getElementById('start-overlay');
    const startBtnOverlay = document.getElementById('start-btn-overlay');

    startBtnOverlay.addEventListener('click', () => {
        if (audioHub) {
            audioHub.playMenuMusic();
        }
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.style.opacity = '0';
            startScreen.style.filter = 'blur(8px)';
            startScreen.classList.remove('d-none');
            startScreen.style.display = 'flex';
            // Allow browser to render with opacity 0 and blur before animating
            setTimeout(() => pixelBuildStartScreen(), 30);
        }
        startOverlay.remove();
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
 * Pixel build effect for start screen.
 */
function pixelBuildStartScreen() {
    const startScreen = document.getElementById('start-screen');
    if (!startScreen) return;

    startScreen.style.transition = 'none';
    startScreen.style.opacity = '0';
    startScreen.style.filter = 'blur(8px)';

    let step = 0;
    const steps = 60;
    IntervalHub.startInterval(() => {
        step++;
        startScreen.style.opacity = (step / steps).toString();
        startScreen.style.filter = `blur(${8 - (step / steps) * 8}px)`;

        if (step >= steps) {
            startScreen.style.opacity = '1';
            startScreen.style.filter = 'none';
            IntervalHub.stopAllIntervals();
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
    // Show mobile controls
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.remove('d-none');
    }
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


function togglePauseGame() {
    // Check if the game is actually running
    if (!world) return;

    // 1. Toggle the "Eyes" (Rendering)
    world.togglePause(); // Calls the method we discussed earlier

    // 2. Toggle the "Brain" (Logic / Intervals)
    // We sync the IntervalHub state with the World state
    IntervalHub.isPaused = world.paused;

    // 3. Update the Button Text/Icon
    const btn = document.getElementById('btn-pause');
    if (btn) {
        btn.innerText = world.paused ? "▶" : "❚❚";
    }
}


/**
 * Shows the end overlay (win or lose) with the correct image.
 * @param {boolean} isWin - true for win, false for lose
 */
function showEndOverlay(isWin) {
    const overlay = document.getElementById('end-screen');
    const img = document.getElementById('end-screen-img');
    // Hide mobile controls when game ends
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.add('d-none');
    }
    if (overlay && img) {
        if (isWin) {
            img.classList.remove('game-over');
            img.src = 'assets/images/9_intro_outro_screens/end_screens/You Win A.png';
            img.alt = 'You Win';
        } else {
            img.classList.add('game-over');
            img.src = 'assets/images/9_intro_outro_screens/game_over/game-over.png';
            img.alt = 'Game Over';
        }
        overlay.classList.remove('d-none');
        overlay.style.display = 'flex';
    }
}


// Attach event listeners for try-again and home buttons if present
window.addEventListener('DOMContentLoaded', () => {
    const tryAgainBtn = document.getElementById('try-again-btn');
    if (tryAgainBtn) {
        tryAgainBtn.onclick = function () {
            audioHub?.stopAll();

            IntervalHub.stopAllIntervals();
            restartGame();
            document.getElementById('end-screen').classList.add('d-none');
            document.getElementById('end-screen').style.display = 'none';
        };
    }
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.onclick = function () {
            audioHub?.stopAll();

            IntervalHub.stopAllIntervals();
            showStartScreen();
            document.getElementById('end-screen').classList.add('d-none');
            //document.getElementById('end-screen').style.display = 'none';
        };
    }
});


/**
 * Restarts the game by resetting world, level, and UI states.
 */
function restartGame() {

    if (audioHub) audioHub.stopCurrentMusic();

    IntervalHub.stopAllIntervals();
    if (audioHub) {
        audioHub.stopAll();
    }
    document.getElementById('end-screen').classList.add('d-none');
    initLevel1();
    world = new World(canvas, keyboard);

    // Show mobile controls
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.remove('d-none');
    }

    document.getElementById('canvas').classList.remove('d-none');
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
    audioHub.playMenuMusic();
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
    document.getElementById('end-screen').classList.add('d-none');
    // Hide mobile controls when returning to start screen
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.add('d-none');
    }
    // Remove any start overlay if present
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.remove();
}