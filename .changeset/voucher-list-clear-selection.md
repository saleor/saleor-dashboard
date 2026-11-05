---
"saleor-dashboard": patch
---

Changing the voucher list's filters now clears the row selection. Previously the selection stayed on the same row position while the rows changed, so a different voucher became selected and "Delete vouchers" would delete a voucher you never picked. Now the selection clears whenever the vouchers in the list change, after a filter, search, sort or page change or a refresh that reorders them, and opening the delete dialog keeps it.
