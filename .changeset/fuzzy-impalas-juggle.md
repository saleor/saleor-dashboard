---
"saleor-dashboard": patch
---

Now we login accounts before playwright jobs are being started. This means playwright shards only consume account files, skipping the authentication part, it avoids account suspending by the API due to multiple attempnts in the same time
