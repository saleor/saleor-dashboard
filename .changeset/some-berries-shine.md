---
"saleor-dashboard": patch
---

Replace event-based gift card amount calculation with `giftCardsApplied` field.

Gift card usage on orders is now sourced from the new `Order.giftCardsApplied` field, which directly provides each gift card's applied amount. 

Requires Saleor [3.22.X](https://github.com/saleor/saleor/releases/tag/3.22.X)