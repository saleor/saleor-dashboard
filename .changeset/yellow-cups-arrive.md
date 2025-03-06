---
"saleor-dashboard": patch
---

Fixed issue in OrderLine metadata form dialog: when closing dialog, form state was preserved even when opened for different OrderLine.
Now form state will be cleared properly on dialog closure.
