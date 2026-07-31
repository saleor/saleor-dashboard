---
"saleor-dashboard": patch
---

Add a `SEARCH_ACTION` extension mount that surfaces app actions in the global command palette (Cmd+K).

Apps can register `SEARCH_ACTION` extensions to appear in the command bar with `POPUP`, `NEW_TAB`, or `APP_PAGE` targets (`WIDGET` is not supported). Actions can be scoped to specific pages via the new `options.views` manifest field (e.g. `["PRODUCT_DETAILS", "ORDER_DETAILS"]`); when omitted the action is available everywhere. When opened from an entity page, the current entity's context (e.g. product id, order id) is passed to the app just as it would be from that page's "more actions" menu. Actions are shown only when the current user holds the extension's required permissions.
