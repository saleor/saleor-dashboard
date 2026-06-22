---
"saleor-dashboard": patch
---

**Attribute detail page – Save fixes**

- Saving an attribute no longer leaves the form in a "dirty" state, so the "you have unsaved changes" warning is no longer shown after a successful save.
- The Save button now disables immediately on the first click, preventing accidental double submits.
- The Save button keeps its primary appearance while saving and while showing the success checkmark (no more switching to the disabled/grey look on hover), and can no longer be clicked again until it returns to its idle state.
