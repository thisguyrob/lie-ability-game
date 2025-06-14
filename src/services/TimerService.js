class TimerService {
  constructor() {
    this.activeTimers = new Map(); // Map of timerIds to timer objects
  }

  /**
   * Start a timer with automatic cleanup
   * @param {string} timerId - Unique identifier for this timer
   * @param {number} duration - Timer duration in milliseconds
   * @param {function} callback - Function to call when timer expires
   * @param {function} onTick - Optional function to call every second (for countdown updates)
   * @returns {string} The timer ID
   */
  startTimer(timerId, duration, callback, onTick = null) {
    // Cancel any existing timer with this ID
    this.cancelTimer(timerId);

    const startTime = Date.now();
    let remainingTime = duration;

    const timerObj = {
      id: timerId,
      startTime,
      duration,
      callback,
      onTick,
      timeoutId: null,
      intervalId: null,
      isActive: true
    };

    // Set up the main timeout
    timerObj.timeoutId = setTimeout(() => {
      if (timerObj.isActive) {
        this.cleanupTimer(timerId);
        callback();
      }
    }, duration);

    // Set up tick interval if onTick is provided
    if (onTick) {
      timerObj.intervalId = setInterval(() => {
        if (timerObj.isActive) {
          remainingTime = Math.max(0, duration - (Date.now() - startTime));
          onTick(Math.ceil(remainingTime / 1000)); // Send seconds remaining
          
          if (remainingTime <= 0) {
            clearInterval(timerObj.intervalId);
          }
        }
      }, 1000);
    }

    this.activeTimers.set(timerId, timerObj);
    return timerId;
  }

  /**
   * Cancel a timer by ID
   * @param {string} timerId - ID of timer to cancel
   * @returns {boolean} True if timer was found and cancelled
   */
  cancelTimer(timerId) {
    const timer = this.activeTimers.get(timerId);
    if (timer) {
      timer.isActive = false;
      this.cleanupTimer(timerId);
      return true;
    }
    return false;
  }

  /**
   * Cancel all active timers
   */
  cancelAllTimers() {
    for (const timerId of this.activeTimers.keys()) {
      this.cancelTimer(timerId);
    }
  }

  /**
   * Get remaining time for a timer in milliseconds
   * @param {string} timerId - ID of timer to check
   * @returns {number} Remaining time in milliseconds, or 0 if timer not found
   */
  getRemainingTime(timerId) {
    const timer = this.activeTimers.get(timerId);
    if (timer && timer.isActive) {
      const elapsed = Date.now() - timer.startTime;
      return Math.max(0, timer.duration - elapsed);
    }
    return 0;
  }

  /**
   * Private method to clean up timer resources
   * @param {string} timerId - ID of timer to clean up
   */
  cleanupTimer(timerId) {
    const timer = this.activeTimers.get(timerId);
    if (timer) {
      if (timer.timeoutId) {
        clearTimeout(timer.timeoutId);
      }
      if (timer.intervalId) {
        clearInterval(timer.intervalId);
      }
      this.activeTimers.delete(timerId);
    }
  }
}

module.exports = TimerService;
