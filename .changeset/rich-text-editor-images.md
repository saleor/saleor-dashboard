---
"saleor-dashboard": patch
---

You can now add images to rich text fields (product, category and collection
descriptions, CMS pages, and rich text attributes). Drag and drop an image into
the editor, paste it from the clipboard, or use the image block from the toolbar
— the file is uploaded to your Saleor media storage and inserted inline.

Supported formats are AVIF, BMP, GIF, JPEG, PNG, TIFF and WEBP, up to 10 MB per
image (SVG is not allowed for security reasons).

Note: storefronts and other API clients that render rich text content need to
handle the new `image` block to display these images.
