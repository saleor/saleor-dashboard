---
"saleor-dashboard": patch
---

Vouchers no longer save a partly entered schedule date or time. Previously, clearing one part of the end date removed the voucher's end date, a partly entered start date started the voucher immediately, a partly entered time was saved as midnight, and clearing the end date while "Set end date" was on removed it. Now Save is blocked, and the field shows "Enter a complete date.", "Enter a complete time." or "This field is required" until it is filled in or "Set end date" is turned off.
