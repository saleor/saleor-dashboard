---
"saleor-dashboard": patch
---

Fixed shipping weight field not appearing when editing simple products. The weight field now displays correctly on the product edit page and updates are properly saved to the backend. Users can now also clear the weight by setting it to an empty string, which sends null to the backend. Weight handling is now consistent across product creation, product updates, and variant updates.
