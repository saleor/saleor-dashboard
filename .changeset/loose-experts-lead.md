---
"saleor-dashboard": patch
---

Fixed code splitting for `auth` and `configuration` chunks. Previously this code was included in the main bundle, skipping dynamic imports. Now it will only load when needed, which should improve performance.
