---
"saleor-dashboard": patch
---

Improved product media and file attribute uploads:

- Dropping or selecting images shows upload previews immediately, including on an empty gallery
- Multiple uploads report one summary notification instead of a toast per file
- Product media can be selected and deleted in bulk
- Reordering media is smoother, with clearer drag feedback; reordering is blocked while uploads are still in progress
- Invalid or oversized files are rejected before upload, with a clear warning
- File attributes (for example images on products and models) support drag and drop to upload or replace, and show a thumbnail when the file is an image
