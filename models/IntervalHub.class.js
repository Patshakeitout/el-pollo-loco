class IntervalHub {
    static allIntervals = [];
    static isPaused = false;

    // Startet ein neues Intervall und
    // fügt es dem Array allIntervals hinzu
    static startInterval(func, timer) {
        // const newInterval = setInterval(func, timer);
        // IntervalHub.allIntervals.push(newInterval);

        const pausableFunc = () => {
            if (!IntervalHub.isPaused) {
                func();
            }
        };

        // 3. Register the WRAPPER, not the original function
        const newInterval = setInterval(pausableFunc, timer);
        IntervalHub.allIntervals.push(newInterval);
    }

    
    /**
     * Stops all currently running intervals and empties the registry.
     */
    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
        IntervalHub.isPaused = false;
    }
}