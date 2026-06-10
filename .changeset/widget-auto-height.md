---
"saleor-dashboard": patch
---

Detail-page app widgets in the sidebar no longer sit in a fixed-height box. Apps report content height via the `widgetResize` App Bridge action (`actions.WidgetResize` in `@saleor/app-sdk` ≥ 1.9.0); the Dashboard resizes the iframe and responds with `ok`. GET widgets use `useAppActions`; POST widgets handle the same action in `useWidgetIframeAutoHeight`. App developers can adopt `useWidgetAutoResize` / `reportWidgetHeightFromElement` ([saleor/app-sdk#507](https://github.com/saleor/app-sdk/pull/507)). Apps that have not adopted this yet keep the previous default height.

Bumps `@saleor/app-sdk` to `1.9.0`.
