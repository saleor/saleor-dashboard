---
"saleor-dashboard": patch
---

App <iframe>s now enable pop-ups (`"allow-popups"`) which means App can use native links to open new tab, instead using AppBridge action. In the nutshell `<a target="_blank"` is now working. It's still recommended to use `rel="noreferrer"` due to security reasons.
