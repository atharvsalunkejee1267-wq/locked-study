

/* ─────────────────────────────────────────────
   PUZZLE MANAGER
───────────────────────────────────────────── */
const PuzzleManager = (() => {
  const overlay = () => document.getElementById('puzzle-overlay');

  function open(puzzleId) {
    const data = GameState.getData();
    const puzzle = data.puzzles[puzzleId];
    if (!puzzle) return;
    if (GameState.isPuzzleSolved(puzzleId)) {
      Inventory.showMessage('You already solved this puzzle.');
      return;
    }

    document.getElementById('puzzle-title').textContent = puzzle.title;
    document.getElementById('puzzle-instruction').textContent = puzzle.instruction || '';
    document.getElementById('puzzle-hint').textContent = puzzle.hint ? `Hint: ${puzzle.hint}` : '';
    document.getElementById('puzzle-feedback').textContent = '';
    document.getElementById('puzzle-content').innerHTML = '';
    overlay().classList.remove('hidden');

    switch (puzzle.type) {
      case 'numpad':   NumpadPuzzle.render(puzzle); break;
      case 'sequence': SequencePuzzle.render(puzzle); break;
      case 'symbol':   SymbolPuzzle.render(puzzle); break;
    }
  }

  function closePuzzle() {
    overlay().classList.add('hidden');
  }

  function onSolve(puzzle) {
    const solve = puzzle.onSolve;
    GameState.markPuzzleSolved(puzzle.id);

    if (solve.setState) {
      GameState.setObjectState(solve.setState.objectId, solve.setState.state);
      updateObjectEl(solve.setState.objectId, solve.setState.state);
    }
    if (solve.giveItem) {
      GameState.addItem(solve.giveItem);
    }
    if (solve.message) {
      Inventory.showMessage(`✅ ${solve.message}`, 6000);
    }
  }

  document.addEventListener('click', e => {
    if (e.target.id === 'puzzle-close' || e.target.id === 'puzzle-overlay') {
      closePuzzle();
    }
  });

  return { open, closePuzzle, onSolve };
})();

function updateObjectEl(objectId, newState) {
  const el = document.getElementById(`obj-${objectId}`);
  if (el) el.dataset.state = newState;
}

function handleObjectClick(objectId) {
  if (GameState.isOver()) return;

  const data = GameState.getData();
  const objData = data.objects[objectId];
  const currentState = GameState.getObjectState(objectId);
  const stateConfig = objData.states[currentState];
  const interaction = objData.interactions?.[currentState] || stateConfig?.onInteract;
  const selectedItem = GameState.getSelectedItem();

  // Interaction (requires item or search)
  if (interaction) {
    const act = interaction;

    // Direct actions
    if (act.action === 'WIN') {
      GameState.win();
      return;
    }
    if (act.action === 'OPEN_PUZZLE') {
      PuzzleManager.open(act.puzzleId);
      return;
    }

    // SEARCH (no item needed)
    if (act.action === 'SEARCH') {
      const s = act.onSuccess || {};
      if (s.setState) {
        GameState.setObjectState(objectId, s.setState);
        updateObjectEl(objectId, s.setState);
      }
      if (s.giveItem)   GameState.addItem(s.giveItem);
      if (s.removeItem) GameState.removeItem(s.removeItem);
      if (s.giveClue)   GameState.addClue(s.giveClue);
      if (s.message)    Inventory.showMessage(`🔍 ${s.message}`, 5000);
      return;
    }

    // Item-required actions
    if (act.requireItem) {
      if (selectedItem === act.requireItem) {
        // SUCCESS
        const s = act.onSuccess || {};
        if (s.setState) {
          GameState.setObjectState(objectId, s.setState);
          updateObjectEl(objectId, s.setState);
        }
        if (s.giveItem)    GameState.addItem(s.giveItem);
        if (s.removeItem)  GameState.removeItem(s.removeItem);
        if (s.giveClue)    GameState.addClue(s.giveClue);
        if (s.message)     Inventory.showMessage(`✅ ${s.message}`, 5000);
      } else {
        // FAIL
        Inventory.showMessage(act.onFail?.message || "That doesn't work here.");
      }
      return;
    }
  }

  // Nothing applicable — show tooltip text as message
  if (stateConfig?.tooltip) {
    Inventory.showMessage(stateConfig.tooltip, 3000);
  }
}

function initTooltips() {
  const tooltip = document.getElementById('tooltip');

  document.querySelectorAll('.room-object').forEach(el => {
    el.addEventListener('mouseenter', e => {
      const objectId = el.dataset.id;
      const currentState = GameState.getObjectState(objectId);
      const data = GameState.getData();
      const stateConfig = data.objects[objectId]?.states?.[currentState];
      if (!stateConfig?.tooltip) return;
      tooltip.textContent = stateConfig.tooltip;
      tooltip.style.display = 'block';
    });

    el.addEventListener('mousemove', e => {
      const rect = document.getElementById('room-scene').getBoundingClientRect();
      let x = e.clientX - rect.left + 12;
      let y = e.clientY - rect.top + 12;
      if (x + 230 > rect.width) x -= 240;
      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
    });

    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    el.addEventListener('click', () => {
      handleObjectClick(el.dataset.id);
    });
  });
}

function initEndScreens() {
  GameState.on('win', ({ elapsed }) => {
    Timer.stop();
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    document.getElementById('win-time').textContent =
      `Escaped in ${mins}m ${secs}s!`;
    document.getElementById('win-screen').classList.remove('hidden');
  });

  GameState.on('lose', () => {
    document.getElementById('lose-screen').classList.remove('hidden');
  });
}

async function bootGame() {
  const data = await GameState.init();

  Inventory.init();
  initTooltips();
  initEndScreens();

  Timer.start(data.meta.timerSeconds);

  // Subscribe to object state changes to update DOM
  GameState.on('objectStateChange', ({ objectId, newState }) => {
    updateObjectEl(objectId, newState);
    // Check win condition on door open
    if (objectId === 'door' && newState === 'open') {
      setTimeout(() => GameState.win(), 400);
    }
  });

  Inventory.showMessage('You wake up in a locked study. Find a way out!', 5000);
}

bootGame();
