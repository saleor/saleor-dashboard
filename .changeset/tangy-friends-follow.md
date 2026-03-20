---
"saleor-dashboard": minor
---

Add password login mode setting to Site Settings, allowing administrators to control whether password-based authentication is enabled, restricted to customers only, or fully disabled. The Sign In page now respects this setting — when password login is disabled or restricted to customers only, the email/password form is hidden and only external authentication methods (e.g. SSO) are shown.
