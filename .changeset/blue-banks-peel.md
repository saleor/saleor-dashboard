---
"saleor-dashboard": patch
---

Fixed a bug when user tried to use redirect from legacy routes (e.g. /pages -> /models) subpaths were not preserved. Now when user navigates to a deeply nested path, e.g. `/pages/<id>` they'll be redirected to `/models/<id>`.
