---
"saleor-dashboard": patch
---

The "Manage app" page now shows what is installed in the same layout as the install page: an overview with the version and installation date, every URL the app is reached at grouped by domain (app URL, manifest, webhooks with their events, extensions), and the granted permissions. Webhook deliveries moved to their own tab. Hovering a connection shows a button that copies its URL. Webhooks also get a GraphQL button that copies the subscription query as formatted GraphQL, decoding queries that were saved JSON-escaped.
