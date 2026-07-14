---
"saleor-dashboard": patch
---

Order details *Line matrix* is the default view for working order lines in one place — see fulfillment and refund progress, expand a line to manage shipments, and start fulfill, return, or refund from row actions. Deep links (`?lineId=`) open the matching line in matrix view.

*Timeline* keeps the shipment-by-shipment layout and now shares the same line row actions, order-level refund callout, and Fulfill/Return header buttons. Unfulfilled lines show return/replace reasons when present. Return and Fulfill shortcuts on timeline rows match the shipment bucket — not on returned or refunded shipments.

Removed the *Needs action* filter from line matrix.
