---
"saleor-dashboard": patch
---

Lists no longer crash when rows stay selected while the list shrinks.

Selecting rows and then lowering "rows per page", bulk-deleting, or refetching fewer records could take the whole view down with "We've encountered an unexpected error". Glide tracks its row selection by index, independently of the data, so the grid reported indices that no longer pointed at a row and the list resolved them straight onto its own data. Products, collections, models, draft orders, shipping zones and gift cards were affected. Attribute and voucher lists did not crash but could put undefined entries into the selection that bulk actions run on.
