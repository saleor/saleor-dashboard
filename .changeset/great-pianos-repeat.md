---
"saleor-dashboard": patch
---

Product media images no longer require a page refresh when the thumbnail is still being generated. Previously, when Saleor was not yet ready to serve an image, the dashboard showed a permanent "Image could not be loaded" fallback until the page was refreshed manually. Now the image is retried automatically with exponential backoff and appears as soon as it becomes available.
