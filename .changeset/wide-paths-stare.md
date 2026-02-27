---
"saleor-dashboard": patch
---

Fix product attribute filters for `CATEGORY` and `COLLECTION` reference types showing empty dropdown.
Previously, filtering products by attributes that reference categories or collections would show no options in the value picker.
