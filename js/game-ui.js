/**
 * @fileoverview UI setup and interaction handlers — start, pause, mute,
 * fullscreen, tutorial overlay, mobile controls, and developer console credits.
 */


/**
 * Sets up all UI buttons, overlays, and prints console credits.
 */
 function setupUI() {
    setupStartButton();
    setupMuteAllButton();
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
 * Sets up the Mute All button (mutes music + SFX).
 */
 function setupMuteAllButton() {
    const btn = document.getElementById('mute-all-btn');
    if (!btn) return;

    let isMuted = localStorage.getItem('elPolloMuteAll') === 'true';
    if (audioHub && isMuted) {
        audioHub.isMuted = true;
        audioHub.musicMuted = true;
        audioHub.sfxMuted = true;
        if (audioHub.currentMusic) {
            audioHub.currentMusic.muted = true;    
        }
    }

    const savedVolume = localStorage.getItem('elPolloVolume');
    if (audioHub && savedVolume !== null) {
        applyVolume(parseInt(savedVolume));
    }

    btn.textContent = isMuted ? '🔇' : '🔊';
    btn.onclick = () => toggleVolumeSlider();

    setupVolumeSlider();
}


/**
 * Toggles a volume slider panel visibility.
 * @param {string} containerId - The slider container element ID.
 * @param {string} btnId - The toggle button element ID.
 */
 function toggleVolumePanel(containerId, btnId) {
    const panel = document.getElementById(containerId);
    const btn = document.getElementById(btnId);
    if (!panel) return;
    panel.classList.toggle('d-none');
    const show = !panel.classList.contains('d-none');
    if (btn) btn.setAttribute('aria-expanded', show);

    if (show) {
        const closeOnOutsideClick = (e) => {
            const wrapper = panel.closest('.volume-wrapper') || panel.parentElement;
            if (!wrapper.contains(e.target)) {
                panel.classList.add('d-none');
                if (btn) btn.setAttribute('aria-expanded', false);
                document.removeEventListener('pointerdown', closeOnOutsideClick);
            }
        };
        setTimeout(() => document.addEventListener('pointerdown', closeOnOutsideClick), 0);
    }
}


/**
 * Toggles the start screen volume slider.
 */
 function toggleVolumeSlider() {
    toggleVolumePanel('volume-slider-container', 'mute-all-btn');
}


/**
 * Toggles the in-game volume slider.
 */
 function toggleGameVolumeSlider() {
    toggleVolumePanel('game-volume-panel', 'btn-volume-top');
}


/**
 * Sets up both volume sliders (start screen + in-game).
 */
 function setupVolumeSlider() {
    const savedVolume = localStorage.getItem('elPolloVolume');
    const sliders = [
        document.getElementById('volume-slider'),
        document.getElementById('game-volume-slider')
    ];

    sliders.forEach(slider => {
        if (!slider) return;
        if (savedVolume !== null) slider.value = savedVolume;
        slider.addEventListener('input', (e) => handleVolumeChange(e, sliders));
    });

    const gameBtn = document.getElementById('btn-volume-top');
    if (gameBtn) gameBtn.onclick = () => toggleGameVolumeSlider();
}


/**
 * Handles volume slider input and syncs both sliders.
 * @param {Event} event - The input event.
 * @param {HTMLInputElement[]} sliders - All volume sliders to sync.
 */
 function handleVolumeChange(event, sliders) {
    const value = parseInt(event.target.value);
    localStorage.setItem('elPolloVolume', value);

    applyVolume(value);

    sliders.forEach(slider => {
        if (slider && slider !== event.target) slider.value = value;
    });

    syncVolumeButtonState();
}


/**
 * Applies a volume level (0-100) to audioHub.
 * @param {number} value - Volume percentage (0-100)
 */
 function applyVolume(value) {
    if (!audioHub) return;
    const vol = value / 100;
    audioHub.musicVolume = vol;
    audioHub.sfxVolume = vol;

    if (vol === 0) {
        audioHub.isMuted = true;
        if (audioHub.currentMusic) audioHub.currentMusic.muted = true;
    } else {
        audioHub.isMuted = false;
        if (audioHub.currentMusic) {
            audioHub.currentMusic.volume = vol;
            audioHub.currentMusic.muted = audioHub.musicMuted;
        }
        if (!audioHub.musicMuted) audioHub.resumeMusic();
    }
}


/**
 * Syncs volume button icons with current audioHub state.
 */
 function syncVolumeButtonState() {
    if (!audioHub) return;
    const startBtn = document.getElementById('mute-all-btn');
    const gameBtn = document.getElementById('btn-volume-top');

    const silent = audioHub.isMuted || audioHub.musicVolume === 0;
    if (startBtn) startBtn.textContent = silent ? '🔇' : '🔊';
    if (gameBtn) gameBtn.textContent = silent ? '🔇' : '🔊';
}


/**
 * SFX-only toggle:
 *   - OFF (default) → music + sfx both play
 *   - ON            → sfx only, music muted
 * Volume=0 (isMuted) still forces full silence regardless of mode.
 */
 function toggleSfxOnly() {
    if (!audioHub) return;
    const sfxOnlyActive = audioHub.musicMuted && !audioHub.sfxMuted;

    if (sfxOnlyActive) {
        audioHub.musicMuted = false;
        audioHub.sfxMuted = false;
        if (audioHub.currentMusic) audioHub.currentMusic.muted = audioHub.isMuted;
        if (!audioHub.isMuted) audioHub.resumeMusic();
    } else {
        audioHub.musicMuted = true;
        audioHub.sfxMuted = false;
        if (audioHub.currentMusic) audioHub.currentMusic.muted = true;
    }
    localStorage.setItem('elPolloMuteAll', false);

    syncVolumeButtonState();
    syncSfxButtonState();
}


/**
 * Syncs the SFX button highlight state.
 */
 function syncSfxButtonState() {
    if (!audioHub) return;
    const active = !audioHub.isMuted && audioHub.musicMuted;
    const btn = document.getElementById('btn-sfx-top');
    if (btn) btn.style.opacity = active ? '1' : '0.3';
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
 * Joystick button handler: activates the mobile controls, or shows a
 * "already activated" feedback message if they are already on.
 */
 function toggleMobileControls() {
    const mobileControls = document.getElementById('mobile-controls');
    const toggleBtn = document.getElementById('btn-controls-toggle');
    if (!mobileControls) return;

    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const isAlreadyActive = mobileControls.classList.contains('show-controls');

    if (isMobile && isAlreadyActive) {
        showMessage("Mobile controls already activated!");
        return;
    }

    mobileControls.classList.toggle('show-controls');
    const nowActive = mobileControls.classList.contains('show-controls');
    if (toggleBtn) toggleBtn.style.opacity = nowActive ? '1' : '0.6';
    if (nowActive) showMessage("Mobile controls activated!");
}


/**
 * Outputs a transient feedback message in the joystick status box.
 * @param {string} text
 */
 function showMessage(text) {
    const statusBox = document.getElementById('joystick-status-message');
    if (!statusBox) return;
    
    statusBox.textContent = text; 
    statusBox.classList.remove('d-none');
    
    setTimeout(() => {
        statusBox.style.opacity = "1";
    }, 10);

    setTimeout(() => {
        statusBox.style.opacity = "0";
        setTimeout(() => {
            statusBox.classList.add('d-none');
            statusBox.textContent = ""; 
        }, 400);
    }, 2000);
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
