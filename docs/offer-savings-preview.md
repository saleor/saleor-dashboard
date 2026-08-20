# Offer savings preview

The promotion detail page includes a read-only offer savings preview for hiring campaigns. The
preview is requested only when an operator selects **Preview offer**, and the request always uses
the latest campaign rules and channel pricing from Saleor Core.

The dashboard renders the `Promotion.offerSavingsPreview` response without calculating or rounding
prices in the browser. Each result shows the job advertisement, publication channel, standard
listing price, campaign price, and employer savings. An empty result explains that the campaign has
no matching job advertisements; request failures can be retried with the same button.

The preview query is deliberately separate from the normal promotion detail query so clients that
do not request the additive field retain their existing behavior.
