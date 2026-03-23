/**
 * Sets up all UI buttons, overlays, and prints console credits.
 */
 function setupUI() {
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
        if (isMuted) audioHub.stopAll();
    }

    muteBtn.textContent = isMuted ? '🔇' : '🔈';
    muteBtn.onclick = () => handleMuteToggle(muteBtn);
}


/**
 * Handles the mute toggle click and resumes music if unmuted.
 * @param {HTMLElement} muteBtn - The mute button element.
 */
 function handleMuteToggle(muteBtn) {
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
 * Prints a styled credits message to the browser developer console.
 */
 function printConsoleCredits() {
    console.log(
        '\n%c  \u2764  %c  </>  %c\n\n' +
        'This game was developed with passion\nand in cooperation with Developer Akademie.\n\n' +
        '%c \u{1F310} Portfolio %c https://patrickschauer.de/\n' +
        '%c DA %c Academy  %c https://developerakademie.com/',
        'background:#e74c3c; color:#fff; font-size: 12px; padding: 3px 1px; border-radius: 4px 0 0 4px;',
        'background:#2c3e50; color:#3498db; font-size: 12px; font-weight:bold; padding: 3px 1px; border-radius: 0 4px 4px 0;',
        'color:#f0c040; font-size: 13px; font-weight:bold; line-height: 1.4;',
        'color:#aaa; font-weight:bold; font-size:10px;',
        'color:#ccc; font-size:10px;',
        'color:#e94560; font-size:10px; font-weight:bold;',
        'color:#aaa; font-weight:bold; font-size:10px;',
        'color:#ccc; font-size:10px;'
    );
}
