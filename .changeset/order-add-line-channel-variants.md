---
"saleor-dashboard": patch
---

Products can be added to an order again when their variants priced in the order's channel are not among the first 50 variants. Previously, the "Add products" dialog loaded only the first 50 variants of a product and hid the product entirely when none of them had a price in the channel, so those products could not be added at all. The dialog now loads the variants assigned to the order's channel for such products and shows them, with "Load more variants" fetching only channel variants. This is a temporary workaround until Saleor core can filter a product's variants by their channel listing; the dashboard will drop it once that exists.
