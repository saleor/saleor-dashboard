---
"saleor-dashboard": patch
---

Added views for managing custom extensions (aka custom apps) to `/extensions` route:

- `/extensions/custom/<id>` - details view
- `/extensions/custom/<id>/webhook` - webhook create view
- `/extensions/custom/<id>/webhook/<webhook_id>` - webhook edit view

