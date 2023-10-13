// @ts-nocheck

import O81816 from "./images/filters.png"

const product_filters = () => (<><p><img src={O81816} alt="new filters"/></p>
<p>Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const voucher_codes = () => (<><p>Allow to generat multple codes per single voucher</p>
</>)

export const AVAILABLE_FLAGS = [{
  name: "product_filters",
  displayName: "Products filtering",
  component: product_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
},{
  name: "voucher_codes",
  displayName: "Voucher codes",
  component: voucher_codes,
  visible: false,
  content: {
    enabled: false,
    payload: "default",
  }
}] as const;
