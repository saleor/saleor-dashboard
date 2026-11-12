---
"saleor-dashboard": patch
---

The search box on the promotions list now says "Search by exact promotion name". The search only finds a promotion whose whole name you type, because Saleor can't match part of a name. Before, the box said "Search promotions...", so typing part of a name showed "No promotions found" with no hint why.
