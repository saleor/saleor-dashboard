---
"saleor-dashboard": patch
---

General update of the main lists filtering component.

Filters on product, customer, and other lists now open as a foldable panel. Search uses the same bordered field, with syntax hints where Saleor supports them.

Product and variant reference filters show chips with thumbnails; variant choices are grouped under their product. Color (swatch) attributes use a color preview instead of a plain list.

Also fixes applying color together with reference filters, and filter drafts that did not reset cleanly.
