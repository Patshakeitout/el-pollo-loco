class StatusIcon {

    iconName;
    amount;
    elementId;

    constructor(icon, elementId, initialAmount) {
        this.iconName = icon;
        this.elementId = elementId;
        this.amount = initialAmount;
        this.updateDOM();
    }

    /**
     * Sets the amount and updates the DOM element.
     * @param {number} amount - The new amount to display.
     */
    setAmount(amount) {
        this.amount = amount;
        this.updateDOM();
    }

    /**
     * Updates the figcaption text of the corresponding HTML element.
     */
    updateDOM() {
        const el = document.getElementById(this.elementId);
        if (!el) return;
        const caption = el.querySelector('figcaption');
        if (caption) caption.textContent = this.amount;
    }

    /**
     * Shows this status icon in the DOM.
     */
    show() {
        const el = document.getElementById(this.elementId);
        if (el) el.classList.remove('d-none');
    }

    /**
     * Hides this status icon in the DOM.
     */
    hide() {
        const el = document.getElementById(this.elementId);
        if (el) el.classList.add('d-none');
    }
}
