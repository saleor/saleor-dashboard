---
"saleor-dashboard": patch
---

Searching the promotions list while a filter is set no longer fails. Previously the list showed an error ("Cannot mix operators with other filter inputs.") instead of results whenever a search and any filter were combined.
