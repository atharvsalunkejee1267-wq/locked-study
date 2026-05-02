

const NumpadPuzzle = (() => {

  let currentInput = [];
  let currentPuzzle = null;

  function render(puzzle) {
    currentPuzzle = puzzle;
    currentInput = [];

    const content = document.getElementById('puzzle-content');
    content.innerHTML = `
      <div class="numpad-display" id="numpad-display">
        ${Array(puzzle.digits).fill('<div class="numpad-digit">?</div>').join('')}
      </div>
      <div class="numpad-grid">
        <button class="numpad-btn" onclick="NumpadPuzzle.pressBack()">←</button>
        ${[1,2,3,4,5,6,7,8,9,0].map(n =>
          `<button class="numpad-btn" onclick="NumpadPuzzle.pressDigit('${n}')">${n}</button>`
        ).join('')}
        <button class="numpad-btn enter" onclick="NumpadPuzzle.submit()">↵</button>
      </div>
    `;
  }

  function updateDisplay() {
    const digits = document.querySelectorAll('.numpad-digit');
    digits.forEach((el, i) => {
      el.textContent = currentInput[i] !== undefined ? currentInput[i] : '?';
    });
  }

  function pressDigit(d) {
    if (currentInput.length < currentPuzzle.digits) {
      currentInput.push(d);
      updateDisplay();
    }
  }

  function pressBack() {
    currentInput.pop();
    updateDisplay();
  }

  function submit() {
    const fb = document.getElementById('puzzle-feedback');
    const answer = currentInput.join('');

    if (answer.length < currentPuzzle.digits) {
      fb.textContent = 'Enter all digits first.';
      fb.className = 'error';
      return;
    }

    if (answer === currentPuzzle.answer) {
      fb.textContent = '✓ Correct!';
      fb.className = 'success';
      setTimeout(() => {
        PuzzleManager.closePuzzle();
        PuzzleManager.onSolve(currentPuzzle);
      }, 700);
    } else {
      fb.textContent = '✗ Wrong code. Try again.';
      fb.className = 'error';
      currentInput = [];
      updateDisplay();
    }
  }

  return { render, pressDigit, pressBack, submit };
})();
