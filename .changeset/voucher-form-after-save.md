---
"saleor-dashboard": patch
---

After a voucher saves, its page shows what was saved and no longer reports unsaved changes. Previously, values the server didn't keep stayed on screen as unsaved changes, with Save still on and a "Leave without saving changes?" prompt. This happened with a minimal order value of 0, a cleared start date, or settings left in a requirement or end date that was switched off. Now the form reloads from the saved voucher.
