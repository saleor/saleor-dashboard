---
"saleor-dashboard": patch
---

Assigning products to a collection no longer dead-ends on "No products found". On large catalogs, the picker used to hide products already in the collection after fetching them, so once the first page of results was fully assigned the dialog looked empty even though thousands of assignable products remained — and it got worse with every product assigned. The picker now keeps loading until it has assignable products to show, fetches more per request, and offers a **Load more products** button instead of claiming the catalog is empty.

The collection product picker also gained **Select all visible products**, so assigning a large filtered set no longer means clicking every row.
