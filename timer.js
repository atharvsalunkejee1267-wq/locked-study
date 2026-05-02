

const Timer = (() => {
  let totalSeconds = 600;
  let remaining = 600;
  let intervalId = null;

  const display = () => document.getElementById('timer-display');
  const wrap    = () => document.getElementById('timer-wrap');

  function format(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function update() {
    const el = display();
    if (el) el.textContent = format(remaining);

    const w = wrap();
    if (w) {
      w.classList.remove('warning', 'critical');
      if (remaining <= 30) w.classList.add('critical');
      else if (remaining <= 120) w.classList.add('warning');
    }
  }

  function start(seconds) {
    if (seconds) { totalSeconds = seconds; remaining = seconds; }
    update();
    intervalId = setInterval(() => {
      remaining--;
      update();
      if (remaining <= 0) {
        stop();
        GameState.lose();
      }
    }, 1000);
  }

  function stop() {
    clearInterval(intervalId);
    intervalId = null;
  }

  function getElapsedFormatted() {
    return format(totalSeconds - remaining);
  }

  return { start, stop, getElapsedFormatted };
})();
