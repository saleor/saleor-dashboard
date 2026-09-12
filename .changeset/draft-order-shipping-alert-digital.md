---
"saleor-dashboard": patch
---

Draft orders that don't need shipping no longer warn about missing shipping methods.

A draft made up entirely of non-shippable products (digital goods, for instance) has no shipping methods to offer, so the draft page warned that the destination country was unavailable for the channel and listed it under "You will not be able to finalize this draft because:". Finalizing such an order never checks shipping at all, so the warning named a blocker that did not exist. The alert is now limited to drafts that actually require shipping; the inactive-channel and no-products alerts are unchanged.
