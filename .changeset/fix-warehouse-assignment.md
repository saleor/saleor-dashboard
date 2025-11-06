---
"saleor-dashboard": patch
---

Fix warehouse assignment modal: prevent duplicates and enable proper deselection. Previously, when selecting warehouses in the assignment modal, deselecting an option would still add it to the list, resulting in duplicate entries on submit.
