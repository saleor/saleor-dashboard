---
"saleor-dashboard": patch
---

Attribute dropdowns on products, variants, and models now keep their own option lists.

Opening one field no longer empties or swaps another field’s values, and the list stays put after blur. Typing filters immediately; the network request stays debounced. Creating a value shows a plus so it reads as an action, not another choice.
