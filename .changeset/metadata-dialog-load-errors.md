---
"saleor-dashboard": patch
---

When the metadata dialog of an order, an order line or a fulfillment can't load the metadata, it now says "Couldn't load metadata" with a Retry button, and Save stays disabled. Before, the order and fulfillment dialogs kept showing loading placeholders with no explanation. The order line dialog showed empty editors instead, and saving them reported "Metadata updated" although nothing was saved.
