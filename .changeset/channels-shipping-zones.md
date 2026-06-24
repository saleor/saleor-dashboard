---
"saleor-dashboard": patch
---

Improve channels and shipping zones management:

- Assigned shipping zones on the channel details page are now clickable links that open the shipping zone settings.
- Redesigned the countries section on shipping zone and voucher pages with clearer summaries, a richer empty state, and styling aligned with shipping rate items.
- Fixed shipping method translations opening with empty source content when navigating from a shipping zone.
- Redesigned the shipping rate page with inline per-channel pricing and a channel availability summary, reworked the postal codes and excluded products sections, and moved shipping method metadata into a header dialog.
- The shipping rate Save button now reflects whether there are real unsaved changes, and leaving the page with unsaved changes (including postal code edits) now correctly shows the "leave without saving" warning.
- Fixed changing a shipping rate's postal code mode (include/exclude) not being saved.
- Fixed shipping zone detail page dirty state: Save stays disabled until name, description, warehouses, or channels are actually changed, and the leave-without-saving prompt no longer fires incorrectly after load.
