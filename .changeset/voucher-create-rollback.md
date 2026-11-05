---
"saleor-dashboard": patch
---

Creating a voucher no longer leaves a half-made voucher behind. Previously, when the API rejected the channel discount values after the voucher itself was created, the voucher stayed live with its codes and no discount, and trying again failed because the codes were already taken. Now that voucher is deleted again, Create voucher shows "Couldn't create voucher" with the rejected values highlighted, and saving again after fixing them creates the voucher. If the voucher can't be deleted, the dashboard opens it and says its discount values weren't saved. When a save is rejected, on Create voucher or on a saved voucher, the page now scrolls to the section with the problem, and a failure that no field shows stays on screen until dismissed.
