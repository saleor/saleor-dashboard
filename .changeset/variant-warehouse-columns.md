---
"saleor-dashboard": patch
---

Any warehouse can now be added as a stock column on the product variants grid.

The column picker on the product page only searched and paged through the first 50 warehouses, so stores with more warehouses could not add the remaining ones as columns at all. The picker now searches and pages through all warehouses on the server, and a warehouse picked from a later page shows its name as the column heading.
