

const GameState = (() => {

  let state = {
    started: false,
    over: false,
    won: false,
    inventory: [],
    selectedItem: null,
    objectStates: {},
    solvedPuzzles: [],      
    discoveredClues: [],    
    startTimestamp: null,
  };

  let data = null;
  const listeners = {};

  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
  }

  function emit(event, payload) {
    (listeners[event] || []).forEach(fn => fn(payload));
  }

  async function init() {
    const res = await fetch('gameData.json');
    data = await res.json();

    // Init object states from data
    for (const [id, obj] of Object.entries(data.objects)) {
      state.objectStates[id] = obj.state;
    }

    state.started = true;
    state.startTimestamp = Date.now();
    emit('init', data);
    return data;
  }

  function getObjectState(objectId) {
    return state.objectStates[objectId];
  }

  function setObjectState(objectId, newState) {
    state.objectStates[objectId] = newState;
    emit('objectStateChange', { objectId, newState });
  }

  function addItem(itemId) {
    if (!state.inventory.includes(itemId)) {
      state.inventory.push(itemId);
      emit('inventoryChange', { type: 'add', itemId });
    }
  }

  function removeItem(itemId) {
    const idx = state.inventory.indexOf(itemId);
    if (idx > -1) {
      state.inventory.splice(idx, 1);
      if (state.selectedItem === itemId) state.selectedItem = null;
      emit('inventoryChange', { type: 'remove', itemId });
    }
  }

  function hasItem(itemId) {
    return state.inventory.includes(itemId);
  }

  function selectItem(itemId) {
    state.selectedItem = (state.selectedItem === itemId) ? null : itemId;
    emit('itemSelected', state.selectedItem);
  }

  function getSelectedItem() { return state.selectedItem; }

  function addClue(clueId) {
    if (!state.discoveredClues.includes(clueId)) {
      state.discoveredClues.push(clueId);
      emit('clueFound', { clueId, clue: data.clues[clueId] });
    }
  }

  function markPuzzleSolved(puzzleId) {
    if (!state.solvedPuzzles.includes(puzzleId)) {
      state.solvedPuzzles.push(puzzleId);
      emit('puzzleSolved', { puzzleId });
    }
  }

  function isPuzzleSolved(puzzleId) {
    return state.solvedPuzzles.includes(puzzleId);
  }

  function win() {
    if (state.over) return;
    state.over = true;
    state.won = true;
    const elapsed = Math.floor((Date.now() - state.startTimestamp) / 1000);
    emit('win', { elapsed });
  }

  function lose() {
    if (state.over) return;
    state.over = true;
    state.won = false;
    emit('lose', {});
  }

  function isOver() { return state.over; }

  function getData() { return data; }
  function getInventory() { return [...state.inventory]; }
  function getClues() { return [...state.discoveredClues]; }

  return {
    init, on, emit,
    getObjectState, setObjectState,
    addItem, removeItem, hasItem, selectItem, getSelectedItem,
    addClue,
    markPuzzleSolved, isPuzzleSolved,
    win, lose, isOver,
    getData, getInventory, getClues
  };
})();
