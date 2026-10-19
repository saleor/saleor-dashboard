---
"saleor-dashboard": patch
---

Clearing a translated field and saving it now resets the field to untranslated, so storefronts fall back to the original language. Previously the field was saved as an empty value, and storefronts showed a blank instead of the original text. This applies to product, category, collection, sale, voucher, and shipping method names, page titles, SEO fields, slugs, and the text of text attribute values on product, variant, and page translations. Translations already saved as blank can be reset the same way: click Edit on the field and save it without typing. Attribute names, attribute value names, variant names, menu item names, and media alt text still save as empty values because the API cannot remove them yet.
