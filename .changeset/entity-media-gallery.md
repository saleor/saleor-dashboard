---
"saleor-dashboard": patch
---

Categories, collections and models (pages) now have a media gallery, matching the one products already had: drag-and-drop upload, upload from URL, reordering, multi-select delete, and a media detail page for alt text and metadata.

The gallery is backed by the generic `mediaCreate`/`mediaUpdate`/`mediaDelete`/`mediaReorder` API added in Saleor 3.24, so it only shows up on builds running against the staging schema (`FF_USE_STAGING_SCHEMA=true`). Products keep using the existing `productMedia*` mutations.
