---
"saleor-dashboard": patch
---

The Docker image now serves the dashboard's HTML with `Cache-Control: no-cache`. Previously, after upgrading the image (for example in Saleor Core's `.devcontainer` setup), the browser could keep reusing the cached HTML of the previous release. It then requested files that no longer existed and crashed with "Unable to preload CSS". Now the browser checks for a new version on every load, so it always gets the current release.
