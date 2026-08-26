---
"saleor-dashboard": patch
---

Discount rule reward values now keep their decimal part.

Typing `12.55` into a rule's reward value stored `12` — the field parsed input with `parseInt`, so everything after the decimal point was dropped without any feedback. Fractional rewards below `1`, such as a `0.5%` discount, were also rejected with "Rule reward value is required". Both now work, for fixed-amount and percentage rewards alike.
