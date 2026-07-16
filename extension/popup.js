const DEFAULTS = { on: true, feed: true, shorts: true, suggestions: true,
  comments: true, endscreen: true, subsbar: false, playlists: false, chat: false };

const opts = document.getElementById('opts');
const power = document.getElementById('power');
let state = { ...DEFAULTS };

function render() {
  power.querySelectorAll('button').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.on === String(state.on))));
  opts.toggleAttribute('data-off', !state.on);
  opts.querySelectorAll('.opt').forEach(b => {
    b.setAttribute('aria-pressed', String(!!state[b.dataset.k]));
    b.disabled = !state.on;
  });
}

function save() {
  chrome.storage.sync.set({ hfy: state });
  render();
}

chrome.storage.sync.get('hfy', d => { state = { ...DEFAULTS, ...(d.hfy || {}) }; render(); });

power.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  state.on = b.dataset.on === 'true'; save();
});

opts.addEventListener('click', e => {
  const b = e.target.closest('.opt'); if (!b) return;
  state[b.dataset.k] = !state[b.dataset.k];
  save();
});
