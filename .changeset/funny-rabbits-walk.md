---
"saleor-dashboard": patch
---

Add "ResizeObserver loop limit exceeded" to ignored in Sentry. Error is thrown only during Cypress tests that will be soon migrated and we could remove error from igrnored.
