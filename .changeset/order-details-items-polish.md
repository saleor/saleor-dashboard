---
"saleor-dashboard": patch
---

*Timeline* now matches line matrix for day-to-day work: order-level refund callout, *Fulfill* and *Return* in the items section header, per-line row actions, and return/replace reasons on unfulfilled lines when present. *Return* and *Fulfill* on a timeline row apply only within that shipment's context — not on already returned, refunded, or replaced fulfillments.

Reorganized the order details cog menu: extension actions and GraphiQL (with icons) first, *Cancel order* last as the destructive action. *Return / Replace order* is in the items section header only.

Draft orders: deleting a draft no longer shows Internal Server Error notification. The *Select a channel* confirm button in *Create order* shows a loading state while the draft is created.
