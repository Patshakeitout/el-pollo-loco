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
 * Starts the game - hides start screen, shows canvas, initializes world.
 */
function startGame() {
    // Hide start screen, show canvas
    document.getElementById('start-screen').classList.add('d-none');
    document.getElementById('canvas').classList.remove('d-none');
    
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
 * Toggles audio mute state (can be connected to mute button).
 * @returns {boolean} Current mute state
 */
function toggleMute() {
    if (audioHub) {
        return audioHub.toggleMute();
    }
    return false;
}