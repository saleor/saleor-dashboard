---
"saleor-dashboard": patch
---

When adding products to a channel with the bulk publish wizard, leaving the price blank now keeps each product’s current prices instead of requiring a new price for every product.

That means you can update stock or visibility for products already in the channel without overwriting variant prices. The review step shows current prices as placeholders, marks rows that will change, and warns before a single price would flatten different variant prices or leave unpriced variants unlisted. New products still need a price so they can be listed in the channel.
