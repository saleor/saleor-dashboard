---
"saleor-dashboard": patch
---

Changing the type of a new promotion no longer removes the rules you added without asking. Before, switching from Catalog to Order deleted every rule, and switching back didn't bring them back. Now the dashboard asks first: Cancel keeps the type and the rules, and Change type removes them, because Catalog and Order rules can't move to the other type. With no rules added, the type changes right away.
