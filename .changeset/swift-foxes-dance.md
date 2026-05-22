---
"saleor-dashboard": patch
---

Variant page: align channel-availability and stock copy with the Saleor 3.23 stock-availability modes.

- The "Availability" card subtitle on the variant detail page now reads "Listed in N of M channels", so it isn't misread as a statement about whether customers can buy the variant. It counts channel listings, not stock availability.
- The inventory section now shows a short footnote beneath the per-warehouse stock table explaining how the active stock-availability mode (legacy shipping-zone filtering vs. the new direct warehouse-channel link) determines whether a customer in a given channel actually sees this stock.
