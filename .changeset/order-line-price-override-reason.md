---
"saleor-dashboard": patch
---

Order details now surface price overrides for order lines. A "Price override reason" column is available in the products table (list and matrix views, toggleable via the column picker). Opening a line's price breakdown now also works for overridden lines — even when no discount applies — and marks the base-price row as "Overridden" with the recorded reason. Lines with a breakdown (discounted or overridden) show a subtle dot on the price so they're discoverable.
