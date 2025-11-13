---
"saleor-dashboard": patch
---

Metadata filter fields will now validate if `key` is provided. Previously users were able to enter data without `key` which resulted in an error. `value` is optional.
