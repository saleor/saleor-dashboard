---
"saleor-dashboard": patch
---

Fixed issue when filtering products by parameters depending on channel (e.g. price) - previously filters didn't work correctly and always returned an empty list. Now filters will work correctly by passing correct channel value.
