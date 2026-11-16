---
"saleor-dashboard": patch
---

Rich text editors (product, category, collection and page descriptions) have a new "Open in new tab" button in the formatting toolbar. Select a link and click it to make the link open in a new tab; click it again to turn that off. The button is greyed out when the selection is not a link. Saleor saves the setting from the version that allows `target="_blank"` on rich text links.
