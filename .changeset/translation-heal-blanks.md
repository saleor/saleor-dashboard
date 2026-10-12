---
"saleor-dashboard": patch
---

Translation fields saved as empty now show a hint that your storefront may display a blank instead of the original. In bulk edit, Save is available whenever an item has such fields and resets them along with your edits, so the storefront shows the original language again. Leaving bulk edit without saving keeps them as they were and does not warn about unsaved changes. Fields that can't be reset to the original yet (variant names, menu item names, media alt text, attribute names, and attribute value names) show a warning when they are saved as empty or about to be saved empty, until the API supports resetting them.
