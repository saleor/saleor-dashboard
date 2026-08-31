---
"saleor-dashboard": patch
---

Fixed SSO login hanging on a loading screen when running the Dashboard from a local development
build. The OAuth callback was exchanging its single-use authorization code twice, and the losing
request came back without a user — which reported "no permissions", logged the session out, and
then blocked the successful login that arrived moments later.

The code is now exchanged once per callback. Deployed builds were never affected.
