---
"saleor-dashboard": patch
---

Fixed a 404 when opening the set/new password link (`/new-password`) while already signed in. Users authenticated via OIDC can now follow the link to set a password instead of hitting a "page not found" screen — the page is now reachable whether you're logged in or out.
