---
"saleor-dashboard": patch
---

The app install page now shows the whole manifest before you install: identifier, version, author, every domain the app will receive data on, permissions, Dashboard extensions, and webhooks. Apps whose manifest and endpoints are all on the Saleor app domain are marked as official Saleor apps. Any other app is marked as external and shows a warning, and you must confirm that you trust its domains before you can install it. A domain that differs from the manifest's, such as an auth token sent to another host, is flagged. Manifest validation issues and an unsupported Saleor version are also shown.
