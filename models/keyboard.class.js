/** Keyboard class to handle the key presses for game controls. */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    SPACE = false;
    ENTER = false;
    
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
     * Binds mobile touch events: joystick for movement, buttons for actions.
     */
     bindMobileTouchEvents() {
        this.bindJoystick('joystick-zone', 'joystick-thumb', 'joystick-base');
        this.bindTouch('btn-jump', 'SPACE');
        this.bindTouch('btn-throw', 'ENTER');
    }

    
    /**
     * Binds a virtual joystick for LEFT/RIGHT movement via touch and mouse drag.
     * The thumb is clamped to the base circle with a 25% dead zone.
     * @param {string} zoneId - The HTML ID of the touch capture area.
     * @param {string} thumbId - The HTML ID of the draggable thumb element.
     * @param {string} baseId - The HTML ID of the joystick base circle.
     */
     bindJoystick(zoneId, thumbId, baseId) {
        const zone = document.getElementById(zoneId);
        const thumb = document.getElementById(thumbId);
        const base = document.getElementById(baseId);
        if (!zone || !thumb || !base) return;
        let active = false, centerX = 0, centerY = 0;

        const onStart = (e) => { this.prevent(e); active = true; const r = base.getBoundingClientRect(); centerX = r.left + r.width / 2; centerY = r.top + r.height / 2; };
        const onMove = (e) => { if (!active) return; this.prevent(e); const t = e.touches ? e.touches[0] : e; this.updateJoystick(t.clientX - centerX, t.clientY - centerY, base.offsetWidth / 2, thumb); };
        const onEnd = (e) => { this.prevent(e); active = false; thumb.style.transform = 'translate(-50%, -50%)'; this.LEFT = false; this.RIGHT = false; };

        ['touchstart', 'mousedown'].forEach(ev => zone.addEventListener(ev, onStart, { passive: false }));
        ['touchmove', 'mousemove'].forEach(ev => zone.addEventListener(ev, onMove, { passive: false }));
        ['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(ev => zone.addEventListener(ev, onEnd, { passive: false }));
    }


    /** @param {Event} e - Prevents default if cancelable. */
     prevent(e) { 
        if (e.cancelable) e.preventDefault(); 
    }


    /**
     * Updates joystick thumb position and sets LEFT/RIGHT based on drag offset.
     * @param {number} dx - Horizontal offset from joystick center.
     * @param {number} dy - Vertical offset from joystick center.
     * @param {number} r - Maximum radius of the joystick base.
     * @param {HTMLElement} thumb - The joystick thumb element.
     */
     updateJoystick(dx, dy, r, thumb) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r) { dx = (dx / dist) * r; dy = (dy / dist) * r; }
        thumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        this.LEFT = dx < -r * 0.25;
        this.RIGHT = dx > r * 0.25;
    }


    /**
     * Binds touch and mouse events to toggle a keyboard property.
     * @param {string} elementId - The HTML ID of the button.
     * @param {string} command - The property to toggle (e.g., 'SPACE').
     */
     bindTouch(elementId, command) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const set = (v) => (e) => { if (e.cancelable) e.preventDefault(); this[command] = v; };
        el.addEventListener('touchstart', set(true), { passive: false });
        el.addEventListener('touchend', set(false), { passive: false });
        el.addEventListener('mousedown', set(true));
        el.addEventListener('mouseup', set(false));
        el.addEventListener('mouseleave', set(false));
    }
}