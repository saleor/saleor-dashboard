---
"saleor-dashboard": patch
---

Fixed every attribute request failing against the 3.24 API. The Dashboard kept selecting
`availableInGrid`, `filterableInStorefront` and `storefrontSearchPosition`, which 3.24 removes
from `Attribute`, so attribute list, details and update all returned validation errors.

Those three fields are now marked as belonging to the 3.23 schema only and are dropped from the
request when the Dashboard is built against 3.24. On 3.23 the storefront faceted navigation
settings keep working unchanged. Sorting the attribute list by "Use in faceted search" falls back
to sorting by name on 3.24, where that sort field is gone too.
