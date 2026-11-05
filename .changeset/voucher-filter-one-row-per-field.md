---
"saleor-dashboard": patch
---

The voucher list filters offer Status and Discount type once. Previously you could add a second row for the same field, and the list silently used only the last row instead of combining them. Now, once a field has a row, it isn't offered again; pick several values in that one row instead.
