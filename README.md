# Hide for YouTube

A Chrome extension that hides the parts of YouTube you didn't ask for. Eight
toggles, no network requests, no tracking, no accounts.

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

The extension injects a stylesheet at `document_start`, so hidden elements never
paint. There is no JavaScript running against the page after that.

## Repo layout

```
extension/   the unpacked extension — load this in chrome://extensions
site/        the landing page, deployed to hide.hey5.studio
```

## Develop

No build step. No dependencies.

1. Open `chrome://extensions`
2. Enable Developer mode
3. Load unpacked → select `extension/`

Edit a file, hit reload on the extension card.

## Deploy the site

Cloudflare Pages, connected to this repo:

- Build command: *(none)*
- Build output directory: `site`

## Fonts

The popup names Geist and Geist Mono first, falling back to the system stack.
To ship the intended type, drop the `.woff2` files into `extension/fonts/`, add
an `@font-face` block, and link it from `popup.html`. Remote font URLs will not
work — extension CSP blocks them, and the extension makes no network requests by
design.

## Permissions

`storage` — saves your eight toggles via `chrome.storage.sync`, so they follow
your Chrome profile. Nothing else is stored, and nothing leaves the browser.

`*://*.youtube.com/*` — the content script only runs on YouTube.

## A note on selectors

YouTube changes its DOM regularly. When an option stops working, the fix is
almost always a selector in `extension/content.js` — the `RULES` object maps each
toggle to the elements it hides.

## Copyright

© 2026 Alex Ghit. All rights reserved.

This source is published so it can be read and verified. It is not licensed for
reuse, redistribution, or derivative works.
