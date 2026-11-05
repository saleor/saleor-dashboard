---
"saleor-dashboard": patch
---

Staff with a single permission no longer hit permission errors on the pages they can open. The dashboard now asks only for data the user may read:

- Staff with only MANAGE_ORDERS can open a customer's details. Before, the page showed "not found".
- The Cmd+K navigator searches only the resources the user can manage, so its results load without errors.
- The attribute list shows "Visible in storefront" and "Filterable in storefront" only when the user may read them for every attribute type listed.
- The customer list is empty, without errors, for staff who can open customer profiles but not list customers (MANAGE_STAFF only).
- Menu details and the translation variant switcher use the selected channel for staff without MANAGE_PRODUCTS, so linked collections and variants load in multi-channel stores.
- Product Doctor, the product type, staff, gift card, order fulfillment, channel and shipping rate pages no longer request fields that need another permission.

Saving store settings no longer fails with "country is required" when the shop has no address and the address fields are empty.
