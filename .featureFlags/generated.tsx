// @ts-nocheck

import S50182 from "./images/discounts-list.png"
import J75860 from "./images/extensions.png"

const discounts_rules = () => (<><p><img src={S50182} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const extensions = () => (<><p><img src={J75860} alt="Extensions"/></p>
<p>We are standardizing the extensibility model in Saleor by consolidating plugins, webhooks, and apps under a unified concept: extensions. For now, this change is reflected only in the user interface, providing a simplified and more cohesive way to manage extensions.</p>
</>)
const new_filters = () => (<><p>Experience the new look and enhanced abilities of new filtering mechanism.
Combine any criteria you want, and quickly browse their values.
New filters have been added to the following pages:</p>
<ul>
<li>Collection list</li>
<li>Customers list</li>
<li>Vouchers list</li>
<li>Draft orders list</li>
<li>Gift cards list</li>
<li>Content list</li>
<li>Product types list</li>
<li>Staff members list</li>
</ul>
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
  name: "extensions",
  displayName: "New extensions view",
  component: extensions,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
},{
  name: "new_filters",
  displayName: "New filtering",
  component: new_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
}] as const;
