---
"saleor-dashboard": patch
---

Webhook event picker: warn admins about Saleor 3.23 channel-scoped stock events.

The four `PRODUCT_VARIANT_BACK_IN_STOCK_*` / `PRODUCT_VARIANT_OUT_OF_STOCK_*` events introduced in Saleor 3.23 fire only when the shop has the legacy shipping-zone stock-availability setting disabled. They were already exposed in the picker (auto-derived from the schema), but admins on shops still in legacy mode could subscribe with no visual cue and silently never receive deliveries. Each of those four events now shows an advisory "Direct stock mode only" badge with a tooltip linking to the site-settings page where the flag is configured. Adds a regression test pinning the four events to the `PRODUCT_VARIANT` group, and a comment in `ExcludedDocumentKeys` documenting that the dry-run feature already covers them transitively via prefix matching.
