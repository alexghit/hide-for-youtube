const DEFAULTS = { on: true, feed: true, shorts: true, suggestions: true,
  comments: true, endscreen: true, subsbar: false, playlists: false, chat: false };

const RULES = {
  feed: `ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
    ytd-browse[page-subtype="home"] ytd-rich-section-renderer,
    ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer`,
  shorts: `ytd-guide-entry-renderer:has(a[title="Shorts"]),
    ytd-mini-guide-entry-renderer:has(a[title="Shorts"]),
    ytd-rich-shelf-renderer[is-shorts],
    ytd-reel-shelf-renderer,
    ytd-video-renderer:has(a[href^="/shorts"]),
    ytd-rich-item-renderer:has(a[href^="/shorts"]),
    grid-shelf-view-model:has(a[href^="/shorts"])`,
  suggestions: `#secondary-inner`,
  comments: `#comments, ytd-comments`,
  endscreen: `.ytp-endscreen-content, .ytp-ce-element, .ytp-pause-overlay`,
  subsbar: `ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[href^="/@"]),
    ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[href^="/channel/"]),
    ytd-guide-collapsible-entry-renderer`,
  playlists: `ytd-watch-flexy ytd-playlist-panel-renderer`,
  chat: `ytd-watch-flexy ytd-live-chat-frame`
};

const style = document.createElement('style');
style.id = 'hfy-style';

function mount() {
  const head = document.head || document.documentElement;
  if (head && !style.isConnected) head.appendChild(style);
}
mount();

function css(s) {
  if (!s.on) return '';
  return Object.keys(RULES)
    .filter(k => s[k])
    .map(k => `${RULES[k]}{display:none!important}`)
    .join('\n');
}

function apply(s) {
  mount();
  style.textContent = css(s);
}

let current = { ...DEFAULTS };
chrome.storage.sync.get('hfy', d => {
  current = { ...DEFAULTS, ...(d.hfy || {}) };
  apply(current);
});

chrome.storage.onChanged.addListener(c => {
  if (!c.hfy) return;
  current = { ...DEFAULTS, ...c.hfy.newValue };
  apply(current);
});

// yt swaps <head> on soft navigation; re-attach if we get dropped
document.addEventListener('yt-navigate-finish', () => apply(current));
new MutationObserver(() => {
  if (!style.isConnected) apply(current);
}).observe(document.documentElement, { childList: true, subtree: true });
