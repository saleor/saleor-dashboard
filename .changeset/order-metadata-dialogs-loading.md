---
"saleor-dashboard": patch
---

The metadata dialogs of orders, order lines and fulfillments now load the current metadata every time they open, instead of showing what they loaded the last time. When the metadata can't be loaded, they say "Couldn't load metadata" with Retry instead of showing earlier values or loading forever, Retry shows that it's loading again, and the order line dialog no longer shows an empty order line above the error.
