# Hide for YouTube

A Chrome extension that hides the parts of YouTube you didn't ask for.

Eight toggles, no network requests, no tracking, no accounts. YouTube stays
YouTube — the video plays, search works, subscriptions are there. Everything
built to pull you somewhere else is gone.

## What it hides

| Option | Default |
| --- | --- |
| Homepage feed | on |
| Shorts | on |
| Suggestions (related videos) | on |
| Comments | on |
| Videos at end | on |
| Subscriptions bar | off |
| Playlists | off |
| Live chat | off |

The first five are the ones almost everyone wants gone, so they ship on. The
last three are situational — hidden only if you ask.

## How it works

A stylesheet is injected at `document_start`, before YouTube paints. Hidden
elements never appear, so there's no flash of a feed you asked to remove.

That's the whole mechanism. No MutationObserver polling the DOM, no scripts
racing YouTube's own JavaScript, no per-video work. The toggles map to CSS
selectors in `extension/content.js` and the browser does the rest.

Settings live in `chrome.storage.sync`, so they follow the Chrome profile across
devices. The popup writes; the content script listens and reapplies. Nothing
else is stored, and nothing leaves the browser.

## Structure

```
extension/   the unpacked extension
site/        the landing page — hide.hey5.studio
```

Unknown paths redirect to the homepage (`site/_redirects`).

`popup.html` is the UI: the eight toggles and an on/off switch. `content.js` is
the mechanism. They only talk through storage.

## Permissions

`storage` for the toggles. `*://*.youtube.com/*` to run there. Nothing else —
no `tabs`, no `scripting`, no host access beyond YouTube.

## Maintenance

YouTube reshapes its DOM regularly. When an option stops working, a selector
went stale — the `RULES` object in `content.js` maps each toggle to the elements
it hides, and that's almost always the only place a fix is needed.

## Credits

Made with ♥ by Alex Ghit — <alex@hey5.studio>
