---
"saleor-dashboard": patch
---

Preorder is no longer part of the Dashboard UI. The preorder API is deprecated in Saleor Core and will be removed, so the Dashboard no longer reads or writes any preorder field: variant forms no longer send preorder settings or per-channel preorder thresholds, the "End preorder" dialog is gone, and order fulfillment and return screens no longer show the "still in preorder" warning. Preorder variants created through the API keep working — Core still blocks fulfilling them, and the Dashboard now surfaces that as an error message. To model pre-sales, create the planned quantity in a warehouse or turn off `trackInventory` to sell without a stock limit.
