---
"saleor-dashboard": patch
---

Fixed an issue where the Return/Replace flow excluded order lines from the granted refund when their fulfillment was waiting for approval. Previously, only shipping costs were sent to the payment provider in such cases - now the refund correctly includes both the returned items and shipping.
