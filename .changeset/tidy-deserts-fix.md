---
"saleor-dashboard": patch
---

Fixed data-fetching in Order details page. Now when line items are changed, order summary (total, shipping price, etc.) are updated. Previously these values were not updated and displayed stale data.
