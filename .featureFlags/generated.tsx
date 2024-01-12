// @ts-nocheck

import L10838 from "./images/discounts-list.png"
import W33914 from "./images/filters.png"

const discounts_rules = () => (<><p><img src={L10838} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const product_filters = () => (<><p><img src={W33914} alt="new filters"/></p>
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
  name: "product_filters",
  displayName: "Products filtering",
  component: product_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
}] as const;
