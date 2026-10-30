---
"saleor-dashboard": patch
---

The payment pill in the order list and in search results now reflects the order's charges and refunds. Previously, orders paid through the Transactions API only showed "Unpaid", "Partially paid", or "Fully paid", even when a charge was pending or money had been refunded. They now also show "Pending", "Authorised", "Partially authorised", "Partially refunded", and "Fully refunded". The dashboard no longer queries the deprecated `Order.paymentStatus` field.
