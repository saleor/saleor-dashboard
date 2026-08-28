---
"saleor-dashboard": patch
---

Fixed replacing or clearing a file attribute value failing with a permission
error for users without attribute-management permissions. The dashboard no
longer calls `attributeValueDelete` before saving products, variants, and
models — TODO - concrete Saleor 3.23.x version and maybe 3.22.x too cleans up the detached file value as part of the update
itself, and on older versions the update still succeeds.
