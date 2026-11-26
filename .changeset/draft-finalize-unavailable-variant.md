---
"saleor-dashboard": patch
---

Finalizing a draft order that contains a variant not available in the order's channel now marks that line in the order lines list with "Not available for sale this channel". Previously the only feedback was a generic "Cannot add lines with unavailable variants." error that didn't say which line to remove.
