---
"saleor-dashboard": patch
---

Improved handling of long reference attribute lists in the Product Create, the Product Edit, and the Page Details views:
- Reference attributes (like product references, page references, etc.) with more than 5 items now display a "Show more" button when collapsed and a "Show less" button when expanded
- Users can toggle between collapsed view (showing first 5 items) and expanded view (showing all items)
- Makes working with products and pages that have many reference attributes more manageable
