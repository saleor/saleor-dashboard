---
"saleor-dashboard": patch
---

Category details now follow the same entity-detail layout as collections: general info and background image in one settings card, products in the main column using the same membership table as collections (assign/unassign, type, availability), subcategories in the right sidebar using the existing category tree datagrid, SEO last, metadata edited from the header, and delete moved into the actions menu. Save only enables when there are unsaved changes, with a short hint of what will persist.

Creating a category (from the list or as a subcategory) or a collection now opens a small modal for name and description instead of a full create page. After create, you land on the new entity’s detail page to finish channels, SEO, media, and metadata.

Collection (and shipping rate) availability empty states now use the same dashed sidebar empty pattern as inventory and delivery, with clearer guidance to assign channels.
