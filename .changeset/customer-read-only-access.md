---
"saleor-dashboard": minor
---

Open the Customers section to read-only viewers with `MANAGE_ORDERS` or `MANAGE_STAFF`, matching the API's `Query.user` permission set (`MANAGE_USERS | MANAGE_ORDERS | MANAGE_STAFF`). Read-only viewers see customer details, addresses, and order history but have no editing affordances: the savebar swaps to a "Read-only" label, and the create button, bulk delete, address actions, account actions menu (activate/deactivate/delete), and metadata editor are hidden. The "View profile" link in Order details now follows the same broader gate. All write paths still require `MANAGE_USERS`, mirroring the server-side mutation permissions.
