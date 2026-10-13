---
"saleor-dashboard": patch
---

Discounted unit prices and totals in the order line grids no longer overlap the currency code. The crossed-out original price is now always shown, in a smaller muted font, and currency codes in price cells use the same secondary style. The price columns are a bit wider by default, and when a cell is still too narrow the currency code moves onto the price as a symbol (for example `$10,450.00`) so both prices stay readable.
