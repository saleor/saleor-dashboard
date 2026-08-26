---
"saleor-dashboard": patch
---

Fixed every attribute request failing against the 3.24 API. The Dashboard kept selecting
`availableInGrid`, `filterableInStorefront` and `storefrontSearchPosition`, which 3.24 removes
from `Attribute`, so attribute list, details and update all returned validation errors.

The documents that need those fields now exist per schema version: the 3.23 variants still select
them and the storefront faceted navigation settings keep working unchanged, while the 3.24
variants omit them. Sorting the attribute list by "Use in faceted search" also falls back to
sorting by name on 3.24, where that sort field is gone too.
