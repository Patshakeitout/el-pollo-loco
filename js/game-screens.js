/**
 * @fileoverview Screen transitions and overlay management — start overlay,
 * curtain countdown animation, pixel-build effects, end screens (win/lose),
 * and legal page navigation.
 */


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
    IntervalHub.startInterval(() => pixelBuildStep(startScreen, ++step, steps), 30);
}


/**
 * Executes a single step of the pixel build-in animation.
 * @param {HTMLElement} startScreen - The start screen element.
 * @param {number} step - The current animation step.
 * @param {number} steps - The total number of animation steps.
 */
 function pixelBuildStep(startScreen, step, steps) {
    startScreen.style.opacity = (step / steps).toString();
    startScreen.style.filter = `blur(${8 - (step / steps) * 8}px)`;

    if (step >= steps) {
        startScreen.style.opacity = '1';
        startScreen.style.filter = 'none';
        IntervalHub.stopAllIntervals();
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.classList.remove('d-none');
    }
}


/**
 * Shows the end overlay (win or lose) with the correct image.
 * @param {boolean} isWin - true for win, false for lose
 */
 function showEndOverlay(isWin) {
    const overlay = document.getElementById('end-screen');
    const img = document.getElementById('end-screen-img');

    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) { mobileControls.classList.add('d-none'); mobileControls.classList.remove('show-controls'); }

    const gameControlsTop = document.getElementById('game-controls-top');
    if (gameControlsTop) gameControlsTop.classList.add('d-none');

    if (overlay && img) {
        setEndScreenImage(img, isWin);
        overlay.classList.remove('d-none');
        overlay.style.display = 'flex';
    }
}


/**
 * Sets the end screen image based on win or lose state.
 * @param {HTMLImageElement} img - The end screen image element.
 * @param {boolean} isWin - true for win, false for lose.
 */
 function setEndScreenImage(img, isWin) {
    if (isWin) {
        img.classList.remove('game-over');
        img.src = 'assets/images/9_intro_outro_screens/end_screens/You Win A.png';
        img.alt = 'You Win';
    } else {
        img.classList.add('game-over');
        img.src = 'assets/images/9_intro_outro_screens/game_over/game-over.png';
        img.alt = 'Game Over';
    }
}


/**
 * Shows the pixelized start screen and hides game canvas and overlays.
 * Used on page load and when clicking Home.
 */
 function showStartScreen() {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.classList.add('d-none');
    syncVolumeButtonState();
    audioHub.playMenuMusic();

    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.style.opacity = '0';
        startScreen.style.filter = 'blur(8px)';
        startScreen.classList.remove('d-none');
        startScreen.style.display = 'flex';
        setTimeout(() => pixelBuildStartScreen(), 30);
    }
    hideGameUI();
}


/**
 * Hides canvas, end screen, mobile controls, game controls, and start overlay.
 */
 function hideGameUI() {
    document.getElementById('canvas').classList.add('d-none');
    document.getElementById('end-screen').classList.add('d-none');

    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) { mobileControls.classList.add('d-none'); mobileControls.classList.remove('show-controls'); }

    const gameControlsTop = document.getElementById('game-controls-top');
    if (gameControlsTop) gameControlsTop.classList.add('d-none');
    const controlsToggle = document.getElementById('btn-controls-toggle');
    if (controlsToggle) controlsToggle.classList.add('d-none');

    const statusBar = document.getElementById('status-bar');
    if (statusBar) statusBar.classList.add('d-none');

    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.remove();
}


/**
 * Animates "3" → "2" → "1" → "FIGHT!" text on the curtain overlay
 * and plays the countdown sound.
 */
 function animateCurtainText() {
    const text = document.getElementById('curtain-text');
    if (!text) return;
    audioHub?.playCountdownSound();
    showCurtainStep(text, 0);
}


/**
 * Shows a single step of the curtain countdown animation.
 * @param {HTMLElement} text - The curtain text element.
 * @param {number} i - The current step index.
 */
 function showCurtainStep(text, i) {
    const steps = ['3', '2', '1', 'FIGHT!'];
    text.classList.remove('show');
    void text.offsetWidth;
    text.textContent = steps[i];
    text.classList.add('show');
    if (i + 1 < steps.length) {
        setTimeout(() => showCurtainStep(text, i + 1), 1000);
    }
}


/**
 * Opens the legal overlay and fetches content from an external HTML file.
 * @param {string} url - The URL of the HTML file (e.g., 'imprint.html').
 */
 async function openLegalOverlay(url) {
    const overlay = document.getElementById('legal-overlay');
    const container = document.getElementById('legal-content');
    if (!overlay || !container) return;
    container.innerHTML = '<p>Loading...</p>';
    overlay.classList.remove('d-none');
    overlay.scrollTop = 0;
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const content = doc.querySelector('.imprint-container, .privacy-container');
    if (content) content.querySelector('.back-link')?.remove();
    container.innerHTML = content?.innerHTML || doc.body.innerHTML;
}


/**
 * Closes the legal overlay.
 */
 function closeLegalOverlay() {
    const overlay = document.getElementById('legal-overlay');
    if (overlay) overlay.classList.add('d-none');
}


/**
 * Binds touch and click events to the footer legal links.
 */
 function bindLegalLinks() {
    const links = [
        { id: 'link-imprint', url: 'imprint.html' },
        { id: 'link-privacy', url: 'privacy-policy.html' }
    ];
    links.forEach(({ id, url }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const handler = (e) => { e.preventDefault(); openLegalOverlay(url); };
        el.addEventListener('touchstart', handler, { passive: false });
        el.addEventListener('click', handler);
    });
}

document.addEventListener('DOMContentLoaded', bindLegalLinks);
