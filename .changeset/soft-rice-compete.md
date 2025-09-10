---
"saleor-dashboard": patch
---

Fixed product stocks section for variant details:

- After this change searching for warehouses to assign won't trigger re-rendering of stocks section.
- Added empty state message if there is no warehouses left to choose.
- Assign warehouse button is now hidden if product stocks section is rendered in product variant create page.
