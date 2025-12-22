/** Keyboard class to handle the key presses for game controls. */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    SPACE = false;
    ENTER = false;

    /** * Static constants to avoid "Magic Numbers" in code.
     * Use these to map keys to actions.
     */
    static KEY_LEFT = 'ArrowLeft';
    static KEY_RIGHT = 'ArrowRight';
    static KEY_SPACE = ' ';
    static KEY_ENTER = 'Enter';

    /**
     * Initializes the keyboard and binds event listeners.
     */
    constructor() {
        this.bindKeyPressEvents();
        this.bindMobileTouchEvents();
    }

    /**
     * Binds standard keyboard events (keydown/keyup).
     */
    bindKeyPressEvents() {
        window.addEventListener('keydown', (e) => {
            this.handleKeyEvent(e.key, true);
        });

        window.addEventListener('keyup', (e) => {
            this.handleKeyEvent(e.key, false);
        });
    }

    /**
     * Helper function to toggle boolean states based on key input.
     * @param {string} key - The key pressed or released.
     * @param {boolean} isPressed - True if key is down, false if up.
     */
    handleKeyEvent(key, isPressed) {
        switch (key) {
            case Keyboard.KEY_LEFT:
                this.LEFT = isPressed;
                break;
            case Keyboard.KEY_RIGHT:
                this.RIGHT = isPressed;
                break;
            case Keyboard.KEY_SPACE:
                this.SPACE = isPressed;
                break;
            case Keyboard.KEY_ENTER:
                this.ENTER = isPressed;
                break;
        }
    }

    /**
     * Binds touch events for mobile buttons.
     * You will need to assign IDs to your HTML buttons (e.g., 'btnLeft').
     */
    bindMobileTouchEvents() {
        // Example for Left Button
        // this.bindTouch('btnLeft', 'LEFT');
        // this.bindTouch('btnRight', 'RIGHT');
        // this.bindTouch('btnJump', 'SPACE');
        // this.bindTouch('btnThrow', 'ENTER');
    }

    /**
     * Helper to bind touchstart/touchend to class variables.
     * @param {string} elementId - The HTML ID of the button.
     * @param {string} command - The property to toggle (e.g., 'LEFT').
     */
    bindTouch(elementId, command) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this[command] = true;
        });

        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            this[command] = false;
        });
    }
}