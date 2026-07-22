---
"saleor-dashboard": patch
---

Removed the hardcoded 10 MB client-side product media size check. Upload size limits are configured on Saleor Core (`MAX_IMAGE_FILE_SIZE`) and can differ by environment, so the Dashboard no longer rejects files the API would accept. Non-image files are still filtered before upload.
