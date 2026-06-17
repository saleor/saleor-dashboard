---
"saleor-dashboard": patch
---

Model type tabs group by splitting model type names at a configurable separator (default ` - `), including when only one type matches. Prefix matching is case-insensitive, the grouped tab menu shows "{prefix} All" with "All" in italics, and the grouping settings include a help tooltip explaining how it works.
