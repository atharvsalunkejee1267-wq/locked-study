

const SymbolPuzzle = (() => {

  let currentPuzzle = null;
  let selected = [];

  function render(puzzle) {
    currentPuzzle = puzzle;
    selected = [];

    const unique = [...new Set(puzzle.symbols)];
    const content = document.getElementById('puzzle-content');
    content.innerHTML = `
      <p style="font-size:12px;color:#888;margin-bottom:12px;text-align:center">
        Select the 3 symbols that appear on the wall painting
      </p>
      <div class="symbol-options" id="sym-options">
        ${unique.map(sym => `
          <div class="symbol-btn" data-sym="${sym}" onclick="SymbolPuzzle.toggle('${sym}')">
            ${sym}
          </div>
        `).join('')}
      </div>
      <div style="text-align:center;margin:8px 0;font-size:12px;color:#666">Selected:</div>
      <div class="symbol-answer-row" id="sym-answer">
        <div class="symbol-slot">?</div>
        <div class="symbol-slot">?</div>
        <div class="symbol-slot">?</div>
      </div>
      <button class="puzzle-submit-btn" onclick="SymbolPuzzle.submit()">Confirm</button>
    `;
  }

  function toggle(sym) {
    const idx = selected.indexOf(sym);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else if (selected.length < currentPuzzle.answer.length) {
      selected.push(sym);
    }
    updateUI();
  }

  function updateUI() {
    document.querySelectorAll('.symbol-btn').forEach(btn => {
      btn.classList.toggle('selected', selected.includes(btn.dataset.sym));
    });
    const slots = document.querySelectorAll('.symbol-slot');
    slots.forEach((slot, i) => {
      slot.textContent = selected[i] || '?';
    });
  }

  function submit() {
    const fb = document.getElementById('puzzle-feedback');
    const answer = currentPuzzle.answer;
    const correct = answer.length === selected.length &&
                    answer.every(sym => selected.includes(sym));
    if (correct) {
      fb.textContent = '✓ Symbols matched!';
      fb.className = 'success';
      setTimeout(() => {
        PuzzleManager.closePuzzle();
        PuzzleManager.onSolve(currentPuzzle);
      }, 700);
    } else {
      fb.textContent = '✗ Wrong combination. Try again.';
      fb.className = 'error';
      selected = [];
      updateUI();
    }
  }

  return { render, toggle, submit };
})();
