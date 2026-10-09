---
"saleor-dashboard": patch
---

Creating or updating an attribute no longer fails on dashboard builds running against the staging schema (`FF_USE_STAGING_SCHEMA=true`). The dashboard sent `availableInGrid`, which Saleor 3.24 removed from the attribute inputs, so the API rejected the request. The field is now left out, together with `filterableInStorefront` and `storefrontSearchPosition`.
