// @ts-nocheck

import V92679 from "./images/discounts-list.png"
import Z34507 from "./images/draft-orders-filters.png"
import R14220 from "./images/improved_refunds.png"
import T12026 from "./images/page-filters.png"
import Q15387 from "./images/vouchers-filters.png"

const discounts_rules = () => (<><p><img src={V92679} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const draft_orders_filters = () => (<><p><img src={Z34507} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const improved_refunds = () => (<><p><img src={R14220} alt="Improved refunds"/></p>
<h3 id="enable-the-enhanced-refund-feature-to-streamline-your-refund-process">Enable the enhanced refund feature to streamline your refund process:</h3>
<ul>
<li><p>• Choose between automatic calculations based on selected items or enter refund amounts directly for overcharges and custom adjustments.</p>
</li>
<li><p>• Take advantage of separate permissions for drafting and finalizing refunds, enhancing control and security in the process.</p>
</li>
</ul>

</>)
const pages_filters = () => (<><p><img src={T12026} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const vouchers_filters = () => (<><p><img src={Q15387} alt="new filters"/>
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
  name: "draft_orders_filters",
  displayName: "Draft orders filtering",
  component: draft_orders_filters,
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
