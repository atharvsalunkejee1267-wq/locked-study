

const Inventory = (() => {

  const MAX_SLOTS = 8;

  function showMessage(text, duration = 4000) {
    const el = document.getElementById('message-text');
    if (!el) return;
    el.textContent = text;
    el.style.opacity = '1';
    clearTimeout(el._timer);
    el._timer = setTimeout(() => {
      el.textContent = 'Click on objects to explore...';
    }, duration);
  }

  function render() {
    const data    = GameState.getData();
    const items   = GameState.getInventory();
    const selected = GameState.getSelectedItem();
    const slotsEl = document.getElementById('inv-slots');
    const descEl  = document.getElementById('inv-description');
    if (!slotsEl) return;
        
    
    slotsEl.innerHTML = '';

    items.forEach(itemId => {
      const itemData = data.items[itemId];
      const slot = document.createElement('div');
      slot.className = 'inv-slot' + (selected === itemId ? ' selected' : '');
      slot.innerHTML = `<span style="font-size:26px">${itemData.icon}</span>
                        <div class="inv-slot-label">${itemData.label}</div>`;
      slot.onclick = () => {
        GameState.selectItem(itemId);
        render();
      };
      slotsEl.appendChild(slot);
    });

    const empty = MAX_SLOTS - items.length;
    for (let i = 0; i < empty; i++) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot inv-slot-empty';
      slotsEl.appendChild(slot);
    }

    if (selected && data.items[selected]) {
      descEl.textContent = data.items[selected].description;
    } else {
      descEl.textContent = selected ? '' : 'Select an item to use it.';
    }
  }

  function renderClues() {
    const data  = GameState.getData();
    const clues = GameState.getClues();
    const el    = document.getElementById('clues-list');
    if (!el) return;
    el.innerHTML = clues.length === 0
      ? '<span class="clue-empty">None yet...</span>'
      : clues.map((id, index) => {
          const clue = data.clues[id];
          const recentClass = index === clues.length - 1 ? ' recent' : '';
          return `<div class="clue-entry${recentClass}">${clue.text}</div>`;
        }).join('');
  }

  function init() {
    GameState.on('inventoryChange', () => { render(); });
    GameState.on('itemSelected', () => { render(); });
    GameState.on('clueFound', ({ clue }) => {
      renderClues();
      showMessage(`📋 Clue found: ${clue.text}`, 6000);
    });
    render();
    renderClues();
  }

  return { init, showMessage, render };
})();
