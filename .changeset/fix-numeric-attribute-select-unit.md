---
"saleor-dashboard": patch
---

Fix the "Select unit" checkbox on numeric attribute detail pages. Toggling it stopped working because its state was derived from form data that normalized the "checked but no unit chosen" state away, so the box could never appear checked. The checkbox now tracks its own state correctly.

The control was also restyled to match the checkboxes in the sidebar properties: the divider above it was removed, it gained a helper caption explaining what selecting a unit does, and spacing was adjusted.
