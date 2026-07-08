---
"saleor-dashboard": patch
---

Removed the "Used by" column from the gift cards list and the "Used by" field from the gift card details page. These relied on the `GiftCard.usedBy` / `usedByEmail` API fields, which have been deprecated and no longer behave as intended since Saleor 3.14 — `usedBy` became mutable and points to the last usage rather than a reliable single user, so the displayed value was misleading. Filtering gift cards by the customer who used them is unaffected.
