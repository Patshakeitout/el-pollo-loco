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

    storyState = { skipped: false, charIndex: 0 };
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
    const storyScreen = document.getElementById('story-screen');

    if (storyState.charIndex < fullText.length) {
        const char = fullText[storyState.charIndex];
        storyText.insertBefore(document.createTextNode(char), storyText.querySelector('.cursor'));
        storyState.charIndex++;
        storyScreen.scrollTop = storyScreen.scrollHeight;
        setTimeout(typeNextChar, char === '\n' ? 120 : char === '.' ? 80 : 35);
    } else {
        const cursor = storyText.querySelector('.cursor');
        if (cursor) cursor.remove();
    }
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
