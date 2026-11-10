---
"saleor-dashboard": patch
---

The Active filter on the promotions list now includes promotions that have started and have no end date. They were shown as Active in the Status column, but the filter left them out, so a running promotion could be missed when looking for what's live. The Ended filter no longer includes a promotion that hasn't started yet, which the list shows as Scheduled.
