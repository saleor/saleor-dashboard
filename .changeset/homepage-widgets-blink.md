---
"saleor-dashboard": patch
---

Fixed a flash on the homepage where an empty "Welcome" screen briefly appeared before the app extension tabs and widgets loaded on every page refresh. The homepage now caches the last-known extensions locally and renders their tabs immediately on load while refreshing in the background. On the very first load (before anything is cached) the page stays blank until extensions resolve, instead of flashing the "Welcome" message.
