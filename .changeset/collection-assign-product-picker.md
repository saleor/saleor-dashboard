---
"saleor-dashboard": patch
---

Assign pickers no longer dead-end on an empty list. These dialogs hide rows you have already used up — products already assigned, warehouses already stocked, products with no price in the order's channel — but they did so only after fetching a page, so a page could be emptied entirely and the picker would claim nothing was left while thousands of items sat on later pages.

Pickers now keep loading until they have rows to show. This covers collection products, voucher products/categories/collections, reference attribute values, product stock warehouses, and adding products to an order. Product pickers also gained **Select all visible products**.
