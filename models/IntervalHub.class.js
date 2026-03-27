/**
 * Central registry for all game intervals. Provides global pause/resume
 * and bulk-stop functionality for all registered intervals.
 */
class IntervalHub {
    static allIntervals = [];
    static isPaused = false;


    /**
     * Wraps the callback in a pause-aware function, starts a setInterval,
     * and registers it for later cleanup.
     * @param {Function} func - The callback to execute on each tick.
     * @param {number} timer - The interval delay in milliseconds.
     */
     static startInterval(func, timer) {
        const pausableFunc = () => {
            if (!IntervalHub.isPaused) {
                func();
            }
        };
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