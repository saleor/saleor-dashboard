---
"saleor-dashboard": patch
---

The Eligible products lists on Create voucher can now be paged. Previously Next and Previous were always disabled, so with more assigned items than fit on one page only the first page could be seen. Moving to another page now clears the row selection, so Unassign only removes rows you can see. Removing the only item on the last page, of Eligible products or of the voucher codes, now goes back to the previous page instead of leaving an empty list with no pager.
