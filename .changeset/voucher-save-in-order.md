---
"saleor-dashboard": patch
---

Saving a voucher no longer reports success when the save failed, and a rejected voucher update no longer lets the rest of the save go through. Previously a request the API rejected as a whole (for example an emptied usage limit) showed "Voucher updated" without saving anything, and replacing a code with one that already exists deleted the voucher's original code even though the save failed. Now the voucher's details are saved first, and channel values, code removals and catalogue changes are saved only after that succeeds. A rejected request shows "Couldn't save voucher". If the details are saved but a later part is rejected, the toast says "Some changes weren't saved", the Savebar lists what is still unsaved, and saving again doesn't resend codes that were already added.
