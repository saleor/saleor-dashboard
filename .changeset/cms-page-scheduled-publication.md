---
"saleor-dashboard": patch
---

Fixed scheduling future publication of CMS pages (models). Previously, setting an availability date on a page sent `isPublished: false` to the API, so the page stayed hidden from storefront visitors even after the scheduled date passed. Now setting a publication date sends `isPublished: true` together with the date, so the page automatically becomes visible once the scheduled time is reached. Pages waiting for a future publication date are now also correctly shown as "Hidden" with the scheduled date in the visibility card.
