// @ts-nocheck

import E60240 from "./images/discounts-list.png"
import T97919 from "./images/filters.png"

const discounts_rules = () => (<><p><img src={E60240} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const improved_refunds = () => (<><p>Experience new refund flow supporting multiple transactions.</p>

</>)
const product_filters = () => (<><p><img src={T97919} alt="new filters"/></p>
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
  visible: false,
  content: {
    enabled: false,
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
