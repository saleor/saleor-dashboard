---
"saleor-dashboard": patch
---

- Model type and product type metadata now opens from a header button on the detail page, in a dedicated dialog — matching attribute, product, and model detail pages. Metadata is saved separately from the main type form. Create flows still use the inline metadata card until the type is saved.

- Model type and product type detail pages now expose Delete in the header cogs menu (with icon and destructive styling), alongside GraphiQL and extension actions. Delete remains in the save bar for discoverability.

- Product type and model type pages now use a consistent layout: attribute schema in the main column, and type identity plus configuration (name, kind, shipping, taxes) in the sidebar. The variant attributes toggle stays in the main column because it controls the attribute schema below it.

- Product type and model type create/update forms no longer show duplicate error toasts when validation errors are already displayed inline on the affected fields.

- Product type and model type delete dialogs now follow the standard delete modal pattern: description in the header, Back + Delete actions, and consistent destructive button styling.

- Type delete dialogs link "View products" / "View models" to lists filtered by the type being deleted, use model-type terminology consistently, and open immediately without a blocking loading spinner.
