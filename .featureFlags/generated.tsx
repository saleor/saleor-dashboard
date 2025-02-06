// @ts-nocheck

import O18650 from "./images/collection-list-filtering.jpg"
import A06283 from "./images/discounts-list.png"
import I81106 from "./images/improved_refunds.png"

const collection_list_new_filters = () => (<><p><img src={O18650} alt="new filters"/>
Experience the new look and enhanced abilities of new filtering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const discounts_rules = () => (<><p><img src={A06283} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const improved_refunds = () => (<><p><img src={I81106} alt="Improved refunds"/></p>
<h3 id="enable-the-enhanced-refund-feature-to-streamline-your-refund-process">Enable the enhanced refund feature to streamline your refund process:</h3>
<ul>
<li><p>• Choose between automatic calculations based on selected items or enter refund amounts directly for overcharges and custom adjustments.</p>
</li>
<li><p>• Take advantage of separate permissions for drafting and finalizing refunds, enhancing control and security in the process.</p>
</li>
</ul>

</>)

export const AVAILABLE_FLAGS = [{
  name: "collection_list_new_filters",
  displayName: "Collection list new filtering",
  component: collection_list_new_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
},{
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
}] as const;
