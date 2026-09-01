---
"saleor-dashboard": patch
---

Fixed the browser freezing when adding a value inline to a swatch attribute. The inline add row
handed its colour picker a fresh empty error object on every render, and the picker keys an
effect on that object — so each render wrote the colour back into the form, which triggered
another render, in an unbounded loop. The error object is now stable.
