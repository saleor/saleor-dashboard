---
"saleor-dashboard": patch
---

Now the Dashboard fetches the signed-in user once instead of twice. Previously login (or the boot-time token refresh) returned the user, and then a separate `UserDetails` request fetched it again before the app could render. The auth mutations now return the full user and seed the Apollo cache, removing one round trip from every page load.
