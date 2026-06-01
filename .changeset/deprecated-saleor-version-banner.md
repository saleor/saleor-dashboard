---
"saleor-dashboard": patch
---

Added a deprecation banner in the sidebar that warns when the connected Saleor instance runs a deprecated version. When the connected version is the same or older than the configured `DEPRECATED_SALEOR_VERSION` (compared on major and minor), a banner appears below the Saleor logo informing users that the instance will be automatically upgraded on the date set in `DEPRECATED_SALEOR_VERSION_TIMESTAMP`. The banner is shown only when both environment variables are set and valid.
