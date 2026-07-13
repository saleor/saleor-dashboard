---
"saleor-dashboard": patch
---

Order details now open in a *Line matrix* view so you can work order line by order line. See fulfillment and refund progress for every item in one place, open a line's shipments when you need to, and start a return, refund, or fulfill from that same context. *Needs action* keeps focus on lines that still need approval or refund follow-up. Order-level refund drafts surface above the matrix with a compact notice. Deep links (`?lineId=`) open the matching line in matrix view. Refund issues are easier to spot and resolve, with the same refund flow whether you start from the matrix, a fulfillment, or elsewhere on the order.

The matrix adds *Replaced* and *Reason* columns, line-scoped fulfill, proportional transaction-refund amounts per line, canceled-shipment toggles in the expanded panel, and fulfillment metadata actions matching Timeline.

*Timeline* is still there for a shipment-by-shipment view.
