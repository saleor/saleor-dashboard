---
"saleor-dashboard": patch
---

Amounts are now hidden on Transaction events list for CHARGE_REQUST, CHARGE_SUCCESS and CHARGE_FAILURE events. These events don't support providing amounts and they were always displayed as 0, which was misleading.
