---
"saleor-dashboard": patch
---

The "Filterable in storefront" attribute setting is now marked as deprecated. A `DEPRECATED` badge next to the setting explains, on hover, that the field will be removed in Saleor 3.24 and that attribute metadata should be used instead.

Dashboard builds running against the staging schema (`FF_USE_STAGING_SCHEMA=true`) already drop the setting entirely: the toggle and its "Position in faceted navigation" field, the "Use in faceted search" column in the attribute list, and the "Filterable in Storefront" filter are hidden, and neither `filterableInStorefront` nor `storefrontSearchPosition` is sent when creating or updating an attribute.
