---
"saleor-dashboard": patch
---

The voucher list's Started filter now uses your time zone. Previously the date and time you picked were read as UTC, so outside UTC "Started after" and "Started between" included or left out vouchers near the edges of the range. A "between" range with only one date entered also made the list fail to load; now it filters by the date you entered. Date ranges in other list filters, such as the order and customer date filters, no longer fail on a half-filled range either.
