---
"saleor-dashboard": patch
---

Adjust the `CustomerDetailsPage` component to trigger a single mutation when metadata changes. This update ensures that only one `customerMetadataUpdated` webhook is generated, preventing duplication.
