// @ts-nocheck

import R48846 from "./images/filters.png"

const discounts_rules = () => (<><p>New discount rules base on new promotion API</p>
</>)
const product_filters = () => (<><p><img src={R48846} alt="new filters"/></p>
<p>Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)

export const AVAILABLE_FLAGS = [{
  name: "discounts_rules",
  displayName: "Discounts rules",
  component: discounts_rules,
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
