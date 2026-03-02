---
"saleor-dashboard": patch
---

Fixed filters that map to single-value fields (e.g. "Is published", boolean flags, date ranges) being added multiple times in the filter panel.
Duplicate rows silently overwrote each other, with only the last value taking effect. Single-value filters are now correctly limited to one occurrence, meaning they cannot be selected when adding new filter line.
