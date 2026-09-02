---
"saleor-dashboard": patch
---

Model types can now carry an icon and a colour, so they are recognisable at a glance instead of being told apart by name alone.

Pick one from the icon control next to the name on a model type's edit page: search the full Lucide set, choose one of six colours, and save with the rest of the form. "Reset" clears it again.

The icon then follows the model type everywhere it appears — sidebar pins and the pin manager, the model list tabs and its "Type" column, the model type list, the type picker and pin dialogs, and the chips of model references on other entities. Model types without an icon render a neutral fallback, so nothing shifts when one is configured.

Storage is public metadata on `PageType`, under `dashboard-icon-name` and `dashboard-icon-color`.
