class IntervalHub {
    // Speichert alle registrierten Interval-IDs
    static allIntervals = [];

    // Startet ein neues Intervall und
    // fügt es dem Array allIntervals hinzu
    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        console.log(
            `Neues Intervall gestartet mit ID: ${newInterval}`
        );
        IntervalHub.allIntervals.push(newInterval);
    }

    //Stoppt alle registrierten Intervalle und leert die Registry.
    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}