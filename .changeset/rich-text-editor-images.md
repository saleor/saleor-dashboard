---
"saleor-dashboard": patch
---

Rich text fields (product, category and collection descriptions, CMS pages, and
rich text attributes) now support images. Pick "Image" from the editor toolbar
and paste a link to an externally hosted image, or paste the link straight into
the editor.

Uploading files to Saleor media storage is not supported yet, so dragging,
dropping or pasting an image file does nothing.

Note: storefronts and other API clients that render rich text content need to
handle the `image` block to display these images.
