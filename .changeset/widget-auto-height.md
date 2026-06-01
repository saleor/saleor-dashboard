---
"saleor-dashboard": patch
---

Detail-page app widgets in the sidebar no longer sit in a fixed-height box. Apps can now report their content height so the iframe grows and shrinks to fit, letting multiple widgets stack naturally in the Apps panel. App developers can adopt this via the new widget auto-resize helpers in `@saleor/app-sdk` ([saleor/app-sdk#507](https://github.com/saleor/app-sdk/pull/507)). Apps that have not adopted this yet keep the previous default height.
