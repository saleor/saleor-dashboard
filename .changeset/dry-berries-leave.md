---
"saleor-dashboard": patch
---

Added local-frontend validation of a subset of App Manifest fields during installation. Installing apps will be now more liberal, some errors initially thrown on the API level will be now warnings that don't block app installation.
