---
"saleor-dashboard": patch
---

Fixed logging in with an external authentication plugin (OpenID Connect, "Login with Saleor Cloud") failing with "You don't have permission to login". The external login and external token refresh mutations asked for user data that only an already-authenticated request may read, so Saleor rejected them. They now request the same minimal user payload as before 3.23.33, and existing SSO sessions no longer get logged out on reload.
