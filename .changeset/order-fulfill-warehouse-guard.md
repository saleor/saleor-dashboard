---
"saleor-dashboard": patch
---

Fixed order fulfillment crashing when fulfilling a single line from a multi-line order. The fulfill page now uses consistent quantity and warehouse controls, disables warehouse selection for zero-quantity lines, pre-selects a warehouse from stock when no allocation exists, and truncates long variant details with a tooltip.
