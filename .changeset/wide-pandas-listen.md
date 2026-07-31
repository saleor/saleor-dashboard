---
"saleor-dashboard": patch
---

Configuration → Store settings now has an **API access** section with an **Allow storefront traffic** toggle, sitting between Customer accounts and Advanced.

When the toggle is on (the default), anonymous clients and signed-in customers can call the GraphQL API directly. Turning it off restricts the API to apps and staff users — every other request is rejected with HTTP 401. Turning it off also shows what stops working: customer login and password reset, anonymous browsing and guest checkout, and schema introspection without app or staff credentials. Requires Saleor 3.23.
