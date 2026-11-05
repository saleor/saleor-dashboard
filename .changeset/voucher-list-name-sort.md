---
"saleor-dashboard": patch
---

Sorting the voucher list by Name now orders vouchers by their name. Previously the Name column asked the API to sort by the first code, an option the API no longer supports, so the rows didn't follow the names shown. The default voucher list order follows the Name column too.
