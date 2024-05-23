// @ts-nocheck

import L01128 from "./images/discounts-list.png"
import Z35191 from "./images/improved_refunds.png"
import X01588 from "./images/filters.png"
import O03408 from "./images/filters.png"

const discounts_rules = () => (<><p><img src={L01128} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const improved_refunds = () => (<><p><img src={Z35191} alt="Improved refunds"/></p>
<h3 id="enable-the-enhanced-refund-feature-to-streamline-your-refund-process">Enable the enhanced refund feature to streamline your refund process:</h3>
<ul>
<li><p>• Choose between automatic calculations based on selected items or enter refund amounts directly for overcharges and custom adjustments.</p>
</li>
<li><p>• Take advantage of separate permissions for drafting and finalizing refunds, enhancing control and security in the process.</p>
</li>
</ul>

</>)
const order_filters = () => (<><p><img src={X01588} alt="new filters"/></p>
<p>Experience the new look and enhanced abilities of new filtering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const product_filters = () => (<><p><img src={O03408} alt="new filters"/></p>
<p>Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)

export const AVAILABLE_FLAGS = [{
  name: "discounts_rules",
  displayName: "Discounts rules",
  component: discounts_rules,
  visible: true,
  content: {
    enabled: false,
    payload: "default",
  }
},{
  name: "improved_refunds",
  displayName: "Improved refunds",
  component: improved_refunds,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
},{
  name: "order_filters",
  displayName: "Orders filtering",
  component: order_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
},{
  name: "product_filters",
  displayName: "Products filtering",
  component: product_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
}] as const;
