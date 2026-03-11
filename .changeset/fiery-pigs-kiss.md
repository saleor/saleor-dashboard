---
"saleor-dashboard": patch
---

When App Store is not configured (env variable not set), Dashboard will not longer crash. Instead it will load
local catalog of apps and plugins to render them as a fallback
