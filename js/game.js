/**
 * @fileoverview Core game controller — initialization, start, restart, pause,
 * and cheat code handling. Manages the global game state (canvas, world,
 * keyboard, audioHub) and orchestrates the game lifecycle.
 */
let canvas;
let world;
let keyboard;
let audioHub;
let cheatBuffer = '';
let cheatCount = 0;
let cheatTaps = 0;
let cheatTapTimer = null;


/**
 * Initializes the landing page and audio (does NOT start the game yet).
 */
 async function init() {
    canvas = document.getElementById('canvas');
    canvas.classList.add('d-none');
    keyboard = new Keyboard();

    await initAudio();
    setupUI();
}


/**
 * Initializes the AudioHub singleton and loads all sounds.
 */
 async function initAudio() {
    audioHub = AudioHub.getInstance();
    await audioHub.loadConfig();
}


/**
 * Starts the game - stops music, shows curtain, then initializes.
 */
 function startGame() {
    const winds = document.getElementById('desert-winds-audio');
    if (winds) { winds.pause(); winds.currentTime = 0; winds.remove(); }

    if (audioHub) audioHub.stopCurrentMusic();

    document.getElementById('start-screen').style.display = 'none';
    const curtain = document.getElementById('curtain-overlay');
    curtain.classList.remove('d-none', 'open');
    curtain.style.display = 'flex';
    animateCurtainText(curtain);

    setTimeout(() => initGameWorld(curtain), 4000);
}


/**
 * Initializes the game world, shows canvas, and opens the curtain.
 * @param {HTMLElement} curtain - The curtain overlay element.
 */
 function initGameWorld(curtain) {
    document.getElementById('start-screen').classList.add('d-none');
    document.getElementById('canvas').classList.remove('d-none');
    document.getElementById('status-bar').classList.remove('d-none');

    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) mobileControls.classList.remove('d-none');

    initLevel1();
    world = new World(canvas, keyboard);

    const gameControlsTop = document.getElementById('game-controls-top');
    if (gameControlsTop) gameControlsTop.classList.remove('d-none');
    const controlsToggle = document.getElementById('btn-controls-toggle');
    if (controlsToggle) controlsToggle.classList.remove('d-none');

    curtain.classList.add('open');
    startGameAudio();
    setTimeout(() => { curtain.classList.add('d-none'); curtain.classList.remove('open'); }, 1500);
}


/**
 * Plays game start sound and background music after a short delay.
 */
 function startGameAudio() {
    if (audioHub && audioHub.isLoaded) {
        audioHub.playGameStartSound();
        setTimeout(() => audioHub.playBackgroundMusic(), 500);
    }
}


/**
 * Toggles the game between paused and running, syncing rendering, intervals, and UI.
 */
 function togglePauseGame() {
    if (!world) return;
    world.togglePause();
    IntervalHub.isPaused = world.paused;
    const btn = document.getElementById('btn-pause-top');
    if (btn) {
        btn.innerText = world.paused ? "▶" : "❚❚";
    }
}


/**
 * Attaches event listeners for try-again and home buttons on DOM ready.
 */
 window.addEventListener('DOMContentLoaded', () => {
    const tryAgainBtn = document.getElementById('try-again-btn');
    if (tryAgainBtn) tryAgainBtn.onclick = handleTryAgain;
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) homeBtn.onclick = handleGoHomeFromEnd;
});


/**
 * Handles the try-again button click from the end screen.
 */
 function handleTryAgain() {
    audioHub?.stopAll();
    IntervalHub.stopAllIntervals();
    if (world) { world.paused = true; world = null; }
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('end-screen').classList.add('d-none');
    document.getElementById('end-screen').style.display = 'none';
    restartGame();
}


/**
 * Handles the home button click from the end screen.
 */
 function handleGoHomeFromEnd() {
    audioHub?.stopAll();
    IntervalHub.stopAllIntervals();
    resetCheatState();
    showStartScreen();
    document.getElementById('end-screen').classList.add('d-none');
}


/**
 * Restarts the game by resetting world, level, and UI states.
 */
 function restartGame() {
    if (world) world.paused = true;
    world = null;
    resetCheatState();
    if (audioHub) audioHub.stopCurrentMusic();
    IntervalHub.stopAllIntervals();
    if (audioHub) audioHub.stopAll();

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    const pauseBtn = document.getElementById('btn-pause-top');
    if (pauseBtn) pauseBtn.innerText = '❚❚';

    const curtain = document.getElementById('curtain-overlay');
    curtain.classList.remove('d-none', 'open');
    curtain.style.display = 'flex';
    animateCurtainText(curtain);

    setTimeout(() => reinitGameWorld(curtain), 4000);
}


/**
 * Reinitializes the game world after a restart, resets UI and opens curtain.
 * @param {HTMLElement} curtain - The curtain overlay element.
 */
 function reinitGameWorld(curtain) {
    document.getElementById('end-screen').classList.add('d-none');
    document.getElementById('end-screen').style.display = 'none';
    if (world) world.paused = true;

    const pauseBtn = document.getElementById('btn-pause-top');
    if (pauseBtn) pauseBtn.innerText = '❚❚';

    initGameWorld(curtain);
}


/**
 * In-game home button handler — stops the game and returns to start screen.
 */
 function goHome() {
    if (!world) return;
    world.paused = true;
    audioHub?.stopAll();
    IntervalHub.stopAllIntervals();
    resetCheatState();
    showStartScreen();
}


/**
 * Resets cheat state for a new game.
 */
 function resetCheatState() {
    cheatCount = 0;
    cheatBuffer = '';
    cheatTaps = 0;
}


/**
 * Listens for the cheat code "pepehotkill" typed during gameplay.
 */
 document.addEventListener('keydown', (e) => {
    if (!world || !world.pepe || cheatCount >= 2) return;
    cheatBuffer += e.key.toLowerCase();
    if (cheatBuffer.length > 11) cheatBuffer = cheatBuffer.slice(-11);
    if (cheatBuffer === 'pepehotkill') activateCheat();
});


/**
 * Listens for 4 rapid taps on the health icon to activate the cheat on mobile.
 */
 document.addEventListener('DOMContentLoaded', () => {
    const health = document.getElementById('status-health');
    if (!health) return;
    health.style.pointerEvents = 'auto';
    health.addEventListener('click', () => {
        if (!world || !world.pepe || cheatCount >= 2) return;
        cheatTaps++;
        clearTimeout(cheatTapTimer);
        cheatTapTimer = setTimeout(() => cheatTaps = 0, 800);
        if (cheatTaps >= 4) {
            cheatTaps = 0;
            activateCheat();
        }
    });
});


/**
 * Activates the cheat code: +100 health and +50 bottles (usable twice).
 */
 function activateCheat() {
    cheatCount++;
    cheatBuffer = '';
    world.pepe.energy += 100;
    world.statusIconPepe.setAmount(world.pepe.energy);
    world.statusIconBottle.setAmount(world.statusIconBottle.amount + 50);
}
