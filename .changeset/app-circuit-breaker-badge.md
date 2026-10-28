---
"saleor-dashboard": patch
---

The installed extensions list now shows when Saleor's circuit breaker has stopped or is limiting an app's synchronous webhooks. Apps with paused webhooks get a red "Webhooks paused" badge, and apps being checked after failures get an orange "Webhooks recovering" badge. Hover or focus a badge to see what it means and when the state started. Healthy apps show no badge.
