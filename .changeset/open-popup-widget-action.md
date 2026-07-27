---
"saleor-dashboard": patch
---

Widgets can now open a full-mode popup. A WIDGET extension can dispatch the new `openPopup` App Bridge action to open one of its app's POPUP extensions declared on the same page, passing an arbitrary JSON payload to it. This lets an app render a compact widget inline and let the user expand it into a larger popup view on demand. The popup always opens with a fresh access token and fills the full popup height.
