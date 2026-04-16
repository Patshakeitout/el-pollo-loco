/**
 * @fileoverview Story intro sequence — typewriter text animation with
 * skip support. Displays the narrative backstory before gameplay begins.
 */
let storyState = { skipped: false, charIndex: 0 };
const storyLines = [
    "The desert sun burns without mercy...\n\n",
    "In 2126, humanity began colonizing Mars.\n",
    "By 2300, the atmosphere was restored\nand a new frontier was born.\n\n",
    "Pepe's father built a chicken farm\nto feed the colonists with the finest\npoultry and eggs on the red planet.\n\n",
    "When he passed, Pepe inherited the ranch.\n",
    "Driven by ambition, he turned to\ngenetic engineering — breeding bigger,\ntastier, and stronger chickens.\n\n",
    "One morning, Pepe woke to silence.\n",
    "The lab was destroyed.\nCages ripped open. Equipment shattered.\n\n",
    "Among the wreckage, strange marks glowed:\n❤❤❤❤  \x01lliktohepeP\x02\n\n",
    "His creations had escaped.\n",
    "And among them... one had grown\nbeyond control.\n\n",
    "They call it El Pollo Loco.\n\n",
    "Now Pepe must cross the Martian wasteland,\nreclaim what he created,\nand face the monster he unleashed.\n\n",
    "Collect. Fight. Survive."
];


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
    const skipBtn = document.getElementById('skip-story-btn');

    storyState = { skipped: false, charIndex: 0, mirrorSpan: null };
    storyScreen.classList.remove('d-none');
    storyScreen.style.display = 'flex';
    document.getElementById('story-text').innerHTML = '<span class="cursor"></span>';

    setTimeout(() => { if (!storyState.skipped) skipBtn.classList.remove('d-none'); }, 1500);
    skipBtn.onclick = () => skipStory(skipBtn);
    setTimeout(typeNextChar, 600);
}


/**
 * Types the next character of the story with typewriter effect.
 */
 function typeNextChar() {
    if (storyState.skipped) return;
    const fullText = storyLines.join('');
    const storyText = document.getElementById('story-text');
    const cursor = storyText.querySelector('.cursor');
    if (storyState.charIndex >= fullText.length) { if (cursor) cursor.remove(); return; }
    const char = fullText[storyState.charIndex++];
    if (handleStoryMarker(char, storyText, cursor)) { typeNextChar(); return; }
    appendStoryChar(char, storyText, cursor);
    autoScrollStory(document.getElementById('story-screen'));
    setTimeout(typeNextChar, nextCharDelay(char));
}


/**
 * Handles mirror-text markers (\x01 opens, \x02 closes a mirrored span).
 * @returns {boolean} True if the char was a marker and was consumed.
 */
 function handleStoryMarker(char, storyText, cursor) {
    if (char === '\x01') {
        const span = document.createElement('span');
        span.className = 'mirror-text';
        storyText.insertBefore(span, cursor);
        storyState.mirrorSpan = span;
        return true;
    }
    if (char === '\x02') { storyState.mirrorSpan = null; return true; }
    return false;
}


/**
 * Appends a character into the active mirror span or the main story flow.
 */
 function appendStoryChar(char, storyText, cursor) {
    const node = document.createTextNode(char);
    if (storyState.mirrorSpan) storyState.mirrorSpan.appendChild(node);
    else storyText.insertBefore(node, cursor);
}


/**
 * Auto-scrolls the story screen only when the user is near the bottom.
 */
 function autoScrollStory(storyScreen) {
    const nearBottom = storyScreen.scrollHeight - storyScreen.scrollTop - storyScreen.clientHeight < 40;
    if (nearBottom) storyScreen.scrollTop = storyScreen.scrollHeight;
}


/**
 * Returns the delay (ms) before typing the next character.
 */
 function nextCharDelay(char) {
    return char === '\n' ? 120 : char === '.' ? 80 : 35;
}


/**
 * Skips the story intro and transitions to the start screen.
 * @param {HTMLElement} skipBtn - The skip button element.
 */
 function skipStory(skipBtn) {
    storyState.skipped = true;
    skipBtn.classList.add('d-none');
    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.classList.add('d-none');

    document.getElementById('story-screen').classList.add('d-none');
    document.getElementById('story-screen').style.display = 'none';
    transitionToStartScreen();
}
