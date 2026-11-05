---
"saleor-dashboard": patch
---

Product, customer, collection, category, model, draft order, attribute, shipping zone and gift card lists now clear the row selection when the rows change. Previously, after selecting rows and then sorting, filtering, searching or refreshing, the selection stayed on the same row positions while different items moved into them. "Delete" then removed items you never picked. Now the selection clears whenever the items shown change. The voucher list already worked this way.
