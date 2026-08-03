---
"saleor-dashboard": patch
---

Assign pickers no longer dead-end on "nothing found" once enough items are assigned. These dialogs hide already-assigned rows after fetching them, so on large catalogs a page of results could be filtered away entirely and the dialog looked empty even though thousands of assignable items remained — and it got worse with every item assigned. Pickers now keep loading until they have assignable rows to show, and offer a **Load more** button instead of claiming there is nothing left.

Fixed for: collection products, voucher products/categories/collections, reference attribute values (products, models, categories, collections), and product stock warehouses.

The collection and voucher product pickers also gained **Select all visible products**, so assigning a large filtered set no longer means clicking every row.
