---
"saleor-dashboard": patch
---

A voucher whose usage limit is used up now shows "Used up" instead of "Active". Previously the voucher list and the voucher page looked only at the dates, so a voucher that could no longer be redeemed was labeled Active, and the Redemptions card said it was redeemable now, although the Expired filter listed it. Now the list, the voucher header, the Schedule card and each channel show "Used up", and the Redemptions card says the usage limit is reached. A voucher that hasn't started yet still shows as Scheduled, and an ended one as Ended, as in the Status filter. A saved usage limit of 0 now shows as a limit of 0, not as no limit.
