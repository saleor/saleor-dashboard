---
"saleor-dashboard": patch
---

The metadata dialogs of orders, order lines and fulfillments now load the current metadata every time they open, instead of showing what they loaded the last time. A load that fails never shows earlier values as if they were current, Retry shows that it's loading again, and the order line dialog no longer shows an empty order line above the error.
