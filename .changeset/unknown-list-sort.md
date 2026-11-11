---
"saleor-dashboard": patch
---

Lists no longer crash when the URL names a sort they don't have. Opening a hand-edited or outdated link such as `/discounts/sales?sort=status` or `/collections?sort=bogus` showed the unexpected-error page; the list now opens in its default order.
