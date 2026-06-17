---
"saleor-dashboard": patch
---

Model type tabs can group related types by splitting names at configurable separators. The settings popover accepts a comma-separated list (default: `- `, `—`, and `:`), matches the leftmost separator, and ignores letter case when bucketing prefixes. Clearing the field disables splitting; unchecking "Group similar model types" shows every type as its own tab.
