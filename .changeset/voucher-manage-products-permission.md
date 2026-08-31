---
"saleor-dashboard": patch
---

Vouchers no longer demand the MANAGE_PRODUCTS permission. Staff who could only manage discounts were met with a stack of "you need one of the following permissions: MANAGE_PRODUCTS" errors as soon as a voucher opened.

Two things caused it. The voucher page ran the assign-product and assign-variant picker searches on page load, with every picker closed — those searches now wait until their dialog is opened. And product channel availability, which does require MANAGE_PRODUCTS, was requested unconditionally — it is now requested only when the signed-in user can actually read it.

Staff without MANAGE_PRODUCTS see the Eligible products list without its Availability column, and the assign-product picker no longer filters by voucher channels, since it cannot know which channels a product is in. Nothing changes for staff who do have the permission.

Opening a voucher is also lighter: four catalog searches no longer fire on every page load.
