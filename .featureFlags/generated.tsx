// @ts-nocheck

import L78751 from "./images/discounts-list.png"
import H47779 from "./images/improved_refunds.png"
import D04851 from "./images/page-filters.png"
import X74083 from "./images/vouchers-filters.png"

const discounts_rules = () => (<><p><img src={L78751} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const improved_refunds = () => (<><p><img src={H47779} alt="Improved refunds"/></p>
<h3 id="enable-the-enhanced-refund-feature-to-streamline-your-refund-process">Enable the enhanced refund feature to streamline your refund process:</h3>
<ul>
<li><p>• Choose between automatic calculations based on selected items or enter refund amounts directly for overcharges and custom adjustments.</p>
</li>
<li><p>• Take advantage of separate permissions for drafting and finalizing refunds, enhancing control and security in the process.</p>
</li>
</ul>

</>)
const pages_filters = () => (<><p><img src={D04851} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const vouchers_filters = () => (<><p><img src={X74083} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)

export const AVAILABLE_FLAGS = [{
  name: "discounts_rules",
  displayName: "Discounts rules",
  component: discounts_rules,
  visible: true,
  content: {
    enabled: true,
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
  name: "pages_filters",
  displayName: "Page filtering",
  component: pages_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
},{
  name: "vouchers_filters",
  displayName: "Vouchers filtering",
  component: vouchers_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
}] as const;
