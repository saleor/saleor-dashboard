---
"saleor-dashboard": patch
---

Voucher lists keep their pager when the last page is emptied. Previously, unassigning the only category, collection, product or variant on the last page, or deleting the last codes on the last page of codes, removed the pager along with the rows, and the other pages couldn't be reached from there. Now the pager stays, so you can go back to them. After saving removed codes, the code list starts again from its first page.
