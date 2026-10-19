---
"saleor-dashboard": patch
---

You can now make a product variant unavailable for purchase in a single channel without losing its prices. The variant Pricing card (on both the variant details and create pages) has an "Available for purchase" toggle for each channel. Channels where the variant is unavailable show an "Unavailable for purchase" status.

In the product variants datagrid, the per-channel "Available" checkbox now sets this flag. Before, unticking it deleted the variant's channel listing and its prices, and ticking it again recreated the listing at price 0. Now unticking hides the variant from customers and keeps its prices, which are shown muted. To remove a variant from a channel completely, use "Manage channels" on the variant page.

Requires Saleor 3.23.42 or later.
