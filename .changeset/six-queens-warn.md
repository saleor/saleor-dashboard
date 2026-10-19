---
"saleor-dashboard": patch
---

Fixed translation progress counters counting empty rich text blocks as translated fields. Empty text, lists, checklists, and table cells no longer count as completed translations. Image and embed blocks need a content URL. For example, a category with only an empty full description translation now shows 0 of 6 translated fields in lists and details.
