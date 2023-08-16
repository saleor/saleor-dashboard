// @ts-nocheck

import D64395 from "./images/filters.png"

const product_filters = () => (<><p><img src={D64395} alt="new filters"/></p>
<p>Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)

export const AVAILABLE_FLAGS = [{
  name: "product_filters",
  displayName: "Products filtering",
  component: product_filters,
  visible: true,
  content: {
    enabled: false,
    payload: "default",
  }
}]
