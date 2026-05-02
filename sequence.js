

const SequencePuzzle = (() => {

  let currentPuzzle = null;
  let arrangement = [];
  let dragged = null;
  let selectedIndex = null;

  function render(puzzle) {
    currentPuzzle = puzzle;
    arrangement = [...puzzle.books];
    selectedIndex = null;

    const content = document.getElementById('puzzle-content');
    content.innerHTML = `
      <p style="font-size:12px;color:#888;margin-bottom:12px;text-align:center">
        Drag books into the correct order, or click two books to swap
      </p>
      <div class="book-row" id="book-row"></div>
      <button class="puzzle-submit-btn" onclick="SequencePuzzle.submit()">Check Order</button>
    `;
    renderBooks();
  }

  function renderBooks() {
    const row = document.getElementById('book-row');
    if (!row) return;
    row.innerHTML = arrangement.map((color, i) => `
      <div class="puzzle-book${selectedIndex === i ? ' selected' : ''}"
           data-color="${color}"
           data-index="${i}"
           draggable="true"
           onclick="SequencePuzzle.selectBook(${i})"
           ondragstart="SequencePuzzle.dragStart(event, ${i})"
           ondragover="SequencePuzzle.dragOver(event)"
           ondrop="SequencePuzzle.drop(event, ${i})"
           ondragend="SequencePuzzle.dragEnd(event)">
        ${color}
      </div>
    `).join('');
  }

  function swapBooks(fromIndex, toIndex) {
    const arr = [...arrangement];
    const tmp = arr[fromIndex];
    arr[fromIndex] = arr[toIndex];
    arr[toIndex] = tmp;
    arrangement = arr;
  }

  function selectBook(index) {
    if (selectedIndex === null) {
      selectedIndex = index;
      renderBooks();
      return;
    }

    if (selectedIndex === index) {
      selectedIndex = null;
      renderBooks();
      return;
    }

    swapBooks(selectedIndex, index);
    selectedIndex = null;
    renderBooks();
  }

  function dragStart(e, index) {
    dragged = index;
    selectedIndex = null;
    e.target.classList.add('dragging');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    }
  }

  function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function drop(e, targetIndex) {
    e.preventDefault();

    let sourceIndex = dragged;
    if (sourceIndex === null && e.dataTransfer) {
      const raw = e.dataTransfer.getData('text/plain');
      const parsed = Number.parseInt(raw, 10);
      if (!Number.isNaN(parsed)) sourceIndex = parsed;
    }

    if (sourceIndex === null || sourceIndex === targetIndex) return;

    swapBooks(sourceIndex, targetIndex);
    dragged = null;
    renderBooks();
  }

  function dragEnd(e) {
    e.target.classList.remove('dragging');
    dragged = null;
  }

  function submit() {
    const fb = document.getElementById('puzzle-feedback');
    const correct = currentPuzzle.answer.every((c, i) => c === arrangement[i]);
    if (correct) {
      fb.textContent = '✓ Correct order!';
      fb.className = 'success';
      setTimeout(() => {
        PuzzleManager.closePuzzle();
        PuzzleManager.onSolve(currentPuzzle);
      }, 700);
    } else {
      fb.textContent = '✗ Not quite right. Keep trying!';
      fb.className = 'error';
    }
  }

  return { render, selectBook, dragStart, dragOver, drop, dragEnd, submit };
})();
