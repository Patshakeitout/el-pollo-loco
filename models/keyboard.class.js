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
            if (e.key === Keyboard.KEY_SPACE || e.key === Keyboard.KEY_ENTER) e.preventDefault();
            this.handleKeyEvent(e.key, true);
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === Keyboard.KEY_SPACE || e.key === Keyboard.KEY_ENTER) e.preventDefault();
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
        this.bindTouch('btn-left', 'LEFT');
        this.bindTouch('btn-right', 'RIGHT');
        this.bindTouch('btn-jump', 'SPACE');
        this.bindTouch('btn-throw', 'ENTER');
    }

    
    /**
     * Helper to bind touch and mouse events to class variables.
     * @param {string} elementId - The HTML ID of the button.
     * @param {string} command - The property to toggle (e.g., 'LEFT').
     */
    bindTouch(elementId, command) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Touch events
        element.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault();
            this[command] = true;
        }, { passive: false });

        element.addEventListener('touchend', (e) => {
            if (e.cancelable) e.preventDefault();
            this[command] = false;
        }, { passive: false });

        // Mouse events for testing/desktop
        element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this[command] = true;
        });

        element.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this[command] = false;
        });

        // Handle mouse leaving the button while pressed
        element.addEventListener('mouseleave', (e) => {
            this[command] = false;
        });
    }
}