---
"saleor-dashboard": patch
---

Staff can now add, change, and remove a voucher on a draft order. Before, the draft order summary showed an applied voucher but gave no way to set one. The summary now has an "Add voucher" link that opens a dialog. Staff with the "Manage discounts" permission search active vouchers in the order's channel, and each voucher shows its discount, such as "10% off" or "Free shipping". The dialog then picks the voucher's first unused code, and staff can choose a different code or type one instead. Other staff type the code. Errors from the API, such as an invalid or inactive code, show in the dialog. When a voucher is applied, the summary shows its code with "Change" and "Remove".
