---
"saleor-dashboard": patch
---

Fixed error when bulk operations on large number of items (over 20) caused runtime error - for example selecting 100 items to be unassigned from collecton, caused page to crash. Now limit is set to 100
