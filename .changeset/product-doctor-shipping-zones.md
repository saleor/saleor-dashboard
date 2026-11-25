---
"saleor-dashboard": patch
---

The product availability panel no longer shows a false "No shipping zones" warning and "Reports stock, but no coverage" result on shops with more than 100 shipping zones. Before, it read only the first 100 zones in the shop, so channels whose zones came later looked uncovered. It now loads every zone linked to the product's channels.
