---
"saleor-dashboard": patch
---

Now the Dashboard fetches the signed-in user once when you log in, instead of twice. Previously `tokenCreate` returned the user and then a separate `UserDetails` request fetched the same user again before the app could render. The login mutations now return the full user and seed the Apollo cache, removing one round trip from the login path.
