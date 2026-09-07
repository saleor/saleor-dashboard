---
"saleor-dashboard": patch
---

Now "Open product details" in order lines opens a working link when the Dashboard is mounted under a sub-path (e.g. `/dashboard/`). Previously the new tab dropped the mount point and landed on a 404. The same fix applies to the channel catalog "view products" links.
