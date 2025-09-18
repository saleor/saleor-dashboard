---
"saleor-dashboard": patch
---

Fix ProductCreatePage form showing "Leave without saving changes" dialog on successful submission.

The form was incorrectly marking itself as dirty after successful submission, causing the exit dialog to appear even when the form was successfully saved. This change clears the dirty state when submission succeeds and removes the automatic dirty state setting in the useEffect hook.
