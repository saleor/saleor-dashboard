---
"saleor-dashboard": patch
---

Products list can now be filtered based on Product's attribute value, when the attribute's `inputType` is `REFERENCE`.
Users will be able to search through all possible values (e.g. Products, Product variants, Pages) using input with search.
Previously REFERENCE attributes couldn't be selected for filtering products.
