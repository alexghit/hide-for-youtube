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
  suggestions: `#secondary, #related,
    ytd-watch-next-secondary-results-renderer,
    ytd-compact-video-renderer`,
  comments: `#comments, ytd-comments`,
  endscreen: `.ytp-endscreen-content, .ytp-ce-element, .html5-endscreen,
    .ytp-pause-overlay, .ytp-suggested-action`,
  subsbar: `ytd-guide-section-renderer:nth-of-type(2),
    ytd-guide-section-renderer:has(#guide-section-title)`,
  playlists: `ytd-playlist-panel-renderer, #playlist`,
  chat: `#chat, ytd-live-chat-frame, #chat-container`
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
  const out = Object.keys(RULES)
    .filter(k => s[k])
    .map(k => `${RULES[k]}{display:none!important}`);
  // reclaim the space the sidebar leaves behind
  if (s.suggestions) {
    out.push(`#primary.ytd-watch-flexy{max-width:none!important;margin:0 auto!important}`);
  }
  return out.join('\n');
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
}).observe(document.documentElement, { childList: true });
