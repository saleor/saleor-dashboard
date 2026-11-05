---
"saleor-dashboard": patch
---

A voucher whose usage limit is used up now shows "Used up" instead of "Active". Previously the voucher list and the voucher header looked only at the dates, so a voucher that could no longer be redeemed was labeled Active, and the Redemptions card said it was redeemable now, although the Expired filter listed it. Now the list, the header and each channel show "Used up", and the Redemptions card says the usage limit is reached, until the limit is raised or the voucher's end date passes. A saved usage limit of 0 now shows as a limit of 0, not as no limit.
