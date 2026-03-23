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
    setupTutorialButton();
    setupFullscreenButton();
    setupStoryButton();

    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.classList.add('d-none');
    }
    showStartOverlay();
    printConsoleCredits();
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

    muteBtn.onclick = function () {
        if (!audioHub) return;
        const newMutedState = audioHub.toggleMute();
        localStorage.setItem('elPolloMute', newMutedState);
        muteBtn.textContent = newMutedState ? '🔇' : '🔈';
        if (!newMutedState) {
            const startScreen = document.getElementById('start-screen');
            const startOverlay = document.getElementById('start-overlay');
            const canvas = document.getElementById('canvas');
            if (startOverlay) return;
            if (startScreen && !startScreen.classList.contains('d-none')) {
                audioHub.playMenuMusic();
            } else if (canvas && !canvas.classList.contains('d-none')) {
                audioHub.playBackgroundMusic();
            }
        };
    }
}


/**
 * Displays the initial start overlay and transitions to the start screen on click.
 */
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
            setTimeout(() => pixelBuildStartScreen(), 30);
        }
        startOverlay.remove();
    });
}


/**
 * Sets up the story replay button on the start screen.
 */
function setupStoryButton() {
    const storyBtn = document.getElementById('story-btn');
    if (!storyBtn) return;

    storyBtn.addEventListener('click', () => {
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.classList.add('d-none');
            startScreen.style.display = 'none';
        }
        showStoryIntro();
    });
}


/**
 * Shows the typewriter story intro, then transitions to the start screen.
 */
function showStoryIntro() {
    const storyScreen = document.getElementById('story-screen');
    const storyText = document.getElementById('story-text');
    const skipBtn = document.getElementById('skip-story-btn');

    storyScreen.classList.remove('d-none');
    storyScreen.style.display = 'flex';

    const storyLines = [
        "The desert sun burns without mercy...\n\n",
        "In 2126, humanity began colonizing Mars.\n",
        "By 2300, the atmosphere was restored\nand a new frontier was born.\n\n",
        "Pepe's father built a chicken farm\nto feed the colonists with the finest\npoultry and eggs on the red planet.\n\n",
        "When he passed, Pepe inherited the ranch.\n",
        "Driven by ambition, he turned to\ngenetic engineering — breeding bigger,\ntastier, and stronger chickens.\n\n",
        "One morning, Pepe woke to silence.\n",
        "The lab was destroyed.\nCages ripped open. Equipment shattered.\n\n",
        "His creations had escaped.\n",
        "And among them... one had grown\nbeyond control.\n\n",
        "They call it El Pollo Loco.\n\n",
        "Now Pepe must cross the Martian wasteland,\nreclaim what he created,\nand face the monster he unleashed.\n\n",
        "Collect. Fight. Survive."
    ];

    const fullText = storyLines.join('');
    let charIndex = 0;
    let skipped = false;

    storyText.innerHTML = '<span class="cursor"></span>';

    setTimeout(() => {
        if (!skipped) skipBtn.classList.remove('d-none');
    }, 1500);

    function typeNextChar() {
        if (skipped) return;
        if (charIndex < fullText.length) {
            const char = fullText[charIndex];
            const cursor = storyText.querySelector('.cursor');
            const textNode = document.createTextNode(char);
            storyText.insertBefore(textNode, cursor);
            charIndex++;
            // Auto-scroll to keep cursor visible
            storyScreen.scrollTop = storyScreen.scrollHeight;
            const delay = char === '\n' ? 120 : char === '.' ? 80 : 35;
            setTimeout(typeNextChar, delay);
        } else {
            const cursor = storyText.querySelector('.cursor');
            if (cursor) cursor.remove();
        }
    }

    function finishStory() {
        storyScreen.classList.add('d-none');
        storyScreen.style.display = 'none';
        skipBtn.classList.add('d-none');
        transitionToStartScreen();
    }

    skipBtn.onclick = () => {
        skipped = true;
        skipBtn.classList.add('d-none');
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.classList.add('d-none');
        finishStory();
    };

    setTimeout(typeNextChar, 600);
}


/**
 * Transitions from story to the start screen with pixel build effect.
 */
function transitionToStartScreen() {
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.style.opacity = '0';
        startScreen.style.filter = 'blur(8px)';
        startScreen.classList.remove('d-none');
        startScreen.style.display = 'flex';
        setTimeout(() => pixelBuildStartScreen(), 30);
    }
}


/**
 * Sets up the tutorial button to show/hide the controls overlay.
 */
function setupTutorialButton() {
    const tutorialBtn = document.getElementById('tutorial-btn');
    const overlay = document.getElementById('controls-overlay');
    const closeBtn = document.getElementById('close-controls-btn');
    if (!tutorialBtn || !overlay || !closeBtn) return;

    tutorialBtn.addEventListener('click', () => {
        overlay.classList.remove('d-none');
        overlay.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.add('d-none');
        overlay.style.display = 'none';
    });
}


/**
 * Sets up the fullscreen toggle button.
 */
function setupFullscreenButton() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (!fullscreenBtn) return;

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('fullscreenchange', () => {
        fullscreenBtn.textContent = document.fullscreenElement ? '⛶' : '⛶';
        fullscreenBtn.title = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
    });
}


/**
 * Toggles fullscreen on the game container.
 */
function toggleFullscreen() {
    const container = document.getElementById('game-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen();
    }
}


/**
 * Sets up the start button to begin the game.
 */
function setupStartButton() {
    const startBtn = document.getElementById('start-btn');
    startBtn.classList.add('d-none');
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
            const startBtn = document.getElementById('start-btn');
            if (startBtn) startBtn.classList.remove('d-none');
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

    if (audioHub) audioHub.stopCurrentMusic();

    const curtain = document.getElementById('curtain-overlay');

    curtain.classList.remove('d-none', 'open');
    curtain.style.display = 'flex';
    animateCurtainText(curtain);

    setTimeout(() => {
        document.getElementById('start-screen').classList.add('d-none');
        document.getElementById('canvas').classList.remove('d-none');

        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) mobileControls.classList.remove('d-none');

        initLevel1();
        world = new World(canvas, keyboard);

        const gameControlsTop = document.getElementById('game-controls-top');
        if (gameControlsTop) gameControlsTop.classList.remove('d-none');

        curtain.classList.add('open');

        if (audioHub && audioHub.isLoaded) {
            audioHub.playGameStartSound();
            setTimeout(() => audioHub.playBackgroundMusic(), 500);
        }

        setTimeout(() => {
            curtain.classList.add('d-none');
            curtain.classList.remove('open');
        }, 1500);
    }, 4000);
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
 * Toggles music on/off during gameplay.
 */
function toggleMusic() {
    if (!audioHub) return;
    audioHub.musicMuted = !audioHub.musicMuted;
    const musicBtn = document.getElementById('btn-music-top');
    if (musicBtn) {
        musicBtn.style.opacity = audioHub.musicMuted ? '0.3' : '1';
    }
    if (audioHub.musicMuted) {
        audioHub.stopCurrentMusic();
    } else {
        audioHub.playBackgroundMusic();
    }
}


/**
 * Toggles mobile controls visibility on desktop.
 */
function toggleMobileControls() {
    const mobileControls = document.getElementById('mobile-controls');
    const toggleBtn = document.getElementById('btn-controls-toggle');
    if (!mobileControls) return;

    mobileControls.classList.toggle('show-controls');
    if (toggleBtn) {
        toggleBtn.style.opacity = mobileControls.classList.contains('show-controls') ? '1' : '0.6';
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
        mobileControls.classList.remove('show-controls');
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

    const curtain = document.getElementById('curtain-overlay');
    curtain.classList.remove('d-none', 'open');
    curtain.style.display = 'flex';
    animateCurtainText(curtain);

    setTimeout(() => {
        document.getElementById('end-screen').classList.add('d-none');
        if (world) world.paused = true;
        initLevel1();
        world = new World(canvas, keyboard);

        const pauseBtn = document.getElementById('btn-pause-top');
        if (pauseBtn) pauseBtn.innerText = '❚❚';

        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) mobileControls.classList.remove('d-none');

        document.getElementById('canvas').classList.remove('d-none');

        const gameControlsTop = document.getElementById('game-controls-top');
        if (gameControlsTop) gameControlsTop.classList.remove('d-none');

        curtain.classList.add('open');

        if (audioHub && audioHub.isLoaded) {
            audioHub.playGameStartSound();
            setTimeout(() => audioHub.playBackgroundMusic(), 500);
        }

        setTimeout(() => {
            curtain.classList.add('d-none');
            curtain.classList.remove('open');
        }, 1500);
    }, 4000);
}


/**
 * Shows the pixelized start screen and hides game canvas and overlays.
 * Used on page load and when clicking Home.
 */
function showStartScreen() {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.classList.add('d-none');
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
        mobileControls.classList.remove('show-controls');
    }
    // Hide game controls container
    const gameControlsTop = document.getElementById('game-controls-top');
    if (gameControlsTop) gameControlsTop.classList.add('d-none');
    // Remove any start overlay if present
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.remove();
}


/**
 * In-game home button handler — stops the game and returns to start screen.
 */
function goHome() {
    if (!world) return;
    world.paused = true;
    audioHub?.stopAll();
    IntervalHub.stopAllIntervals();
    showStartScreen();
}


/**
 * Animates "1" → "2" → "3" → "FIGHT!" text on the curtain overlay
 * and plays the countdown sound.
 */
function animateCurtainText() {
    const text = document.getElementById('curtain-text');
    if (!text) return;

    audioHub?.playCountdownSound();

    const steps = ['3', '2', '1', 'FIGHT!'];
    let i = 0;

    function showNext() {
        text.classList.remove('show');
        void text.offsetWidth;
        text.textContent = steps[i];
        text.classList.add('show');
        i++;
        if (i < steps.length) {
            setTimeout(showNext, 1000);
        }
    }

    showNext();
}


/**
 * Opens a legal overlay (imprint or privacy policy) inside the game container.
 * @param {string} id - The overlay element ID.
 */
function openLegalOverlay(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('d-none');
    overlay.scrollTop = 0;
}


/**
 * Closes a legal overlay and returns to the start screen.
 * @param {string} id - The overlay element ID.
 */
function closeLegalOverlay(id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.add('d-none');
}



/**
 * Prints a styled credits message to the browser developer console.
 */
function printConsoleCredits() {
    console.log(
        '\n%c  \u2764  %c  </>  %c\n\n' +
        'This game is made with creativity and passion.\n\n' +
        '%c \u{1F310} Portfolio %c https://patrickschauer.de/',
        'background:#e74c3c; color:#fff; font-size: 16px; padding: 6px 2px; border-radius: 4px 0 0 4px;',
        'background:#2c3e50; color:#3498db; font-size: 16px; font-weight:bold; padding: 6px 2px; border-radius: 0 4px 4px 0;',
        'color:#f0c040; font-size: 14px; font-weight:bold; line-height: 1.6;',
        'color:#aaa; font-weight:bold; font-size:12px;',
        'color:#ccc; font-size:12px;'
    );
}