---
"saleor-dashboard": patch
---

Vouchers now check discount values, usage limits and minimum quantities before saving, and show the problem next to the field. Previously a percentage above 100 could be saved after switching from a fixed amount, a very small percentage was saved as 0%, fractional limits and quantities were silently rounded down, a usage limit of 0 was accepted, and a value the API rejected could leave a half-saved voucher behind. Now percentages must be above 0 and at most 100 with up to 3 decimal places, fixed amounts must be above 0, and usage limits and minimum quantities must be whole numbers of 1 or more.
