---
"saleor-dashboard": patch
---

Add in-context attribute creation on Model type and Product type detail pages. Instead of navigating to the global Attributes section, merchants can create and assign an attribute from a two-step modal wizard directly on the type page.

Reference attributes no longer require selecting product or model types in the modal — leaving that field empty allows referencing all items of the chosen entity type, matching the full attribute create page and API behavior.
