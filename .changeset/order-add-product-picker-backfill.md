---
"saleor-dashboard": patch
---

Adding a product to an order no longer dead-ends on "No products are available in the channel assigned to this order." Products with no priced variant in the order's channel are hidden after being fetched, so on a channel with sparse pricing a whole page of results could disappear and leave the dialog looking empty while priced products sat on later pages. The picker now keeps loading until it has products to show, and offers a **Load more products** button instead.

Voucher assign pickers also now know about every product, category and collection already on the voucher rather than only the tab page on screen, so already-assigned items no longer show up as assignable.
