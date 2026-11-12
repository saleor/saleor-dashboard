---
"saleor-dashboard": patch
---

When saving a voucher gets no answer from Saleor, a server error, or an answer the dashboard can't read, the error message now says "Saleor didn't confirm the save. Check whether it went through before trying again." instead of "Try again.", because the voucher may have been saved anyway and trying again could create it twice.
