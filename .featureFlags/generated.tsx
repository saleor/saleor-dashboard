// @ts-nocheck

import A57372 from "./images/collection-list-filtering.jpg"
import F96761 from "./images/customers-filters.png"
import D50013 from "./images/discounts-list.png"
import W72891 from "./images/draft-orders-filters.png"
import P04017 from "./images/gift-cards-filters.png"
import I80684 from "./images/improved_refunds.png"
import W65601 from "./images/page-filters.png"
import T54430 from "./images/vouchers-filters.png"

const collection_list_new_filters = () => (<><p><img src={A57372} alt="new filters"/>
Experience the new look and enhanced abilities of new filtering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const customers_filters = () => (<><p><img src={F96761} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const discounts_rules = () => (<><p><img src={D50013} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const draft_orders_filters = () => (<><p><img src={W72891} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const gift_cards_filters = () => (<><p><img src={P04017} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const improved_refunds = () => (<><p><img src={I80684} alt="Improved refunds"/></p>
<h3 id="enable-the-enhanced-refund-feature-to-streamline-your-refund-process">Enable the enhanced refund feature to streamline your refund process:</h3>
<ul>
<li><p>• Choose between automatic calculations based on selected items or enter refund amounts directly for overcharges and custom adjustments.</p>
</li>
<li><p>• Take advantage of separate permissions for drafting and finalizing refunds, enhancing control and security in the process.</p>
</li>
</ul>

</>)
const pages_filters = () => (<><p><img src={W65601} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const vouchers_filters = () => (<><p><img src={T54430} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
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
  name: "customers_filters",
  displayName: "Customers filtering",
  component: customers_filters,
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
  name: "draft_orders_filters",
  displayName: "Draft orders filtering",
  component: draft_orders_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
},{
  name: "gift_cards_filters",
  displayName: "Gift cards filtering",
  component: gift_cards_filters,
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
