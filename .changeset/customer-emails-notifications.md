---
"saleor-dashboard": patch
---

Customer emails in Configuration → Notifications now open the Customer Emails app, where shopper messages can follow the language they checked out in. If this shop still has the older SMTP app installed, it appears on the same card, marked Deprecated, so you can open it or switch over.

Notification links and app redirects identify installed apps by their identifier, falling back to the manifest URL only when the identifier is missing. Apps with the same name or a conflicting identifier are no longer mistaken for the intended app.
