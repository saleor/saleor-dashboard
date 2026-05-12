---
"saleor-dashboard": patch
---

Fixed crashes and blank screens when third-party apps are installed without an `appUrl`. Apps that contribute only background functionality (webhooks) or extensions now show a manage screen with a clear "no configuration screen" notice instead of failing.
