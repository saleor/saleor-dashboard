// @ts-nocheck

import N61234 from "./images/app-alerts.jpg"
import Z40416 from "./images/attributes-filters.png"
import W28550 from "./images/collection-filters.jpg"
import M69269 from "./images/customers-filters.png"
import O68624 from "./images/discounts-list.png"
import B24355 from "./images/draft-orders-filters.png"
import A63120 from "./images/gift-cards-filters.png"
import F60192 from "./images/improved_refunds.png"
import X93874 from "./images/page-filters.png"
import M83183 from "./images/product-types-filters.png"
import H34896 from "./images/staff-members-filters.png"
import P36365 from "./images/vouchers-filters.png"

const app_alerts = () => (<><p><img src={N61234} alt="new filters"/>
Experience new notifications displaying alerts for apps in the Dashboard. 
Get meaningful information when Saleor detects issues with an app.</p>
</>)
const attributes_filters = () => (<><p><img src={Z40416} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const collection_filters = () => (<><p><img src={W28550} alt="new filters"/>
Experience the new look and enhanced abilities of new filtering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const customers_filters = () => (<><p><img src={M69269} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const discounts_rules = () => (<><p><img src={O68624} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const draft_orders_filters = () => (<><p><img src={B24355} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const gift_cards_filters = () => (<><p><img src={A63120} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const improved_refunds = () => (<><p><img src={F60192} alt="Improved refunds"/></p>
<h3 id="enable-the-enhanced-refund-feature-to-streamline-your-refund-process">Enable the enhanced refund feature to streamline your refund process:</h3>
<ul>
<li><p>• Choose between automatic calculations based on selected items or enter refund amounts directly for overcharges and custom adjustments.</p>
</li>
<li><p>• Take advantage of separate permissions for drafting and finalizing refunds, enhancing control and security in the process.</p>
</li>
</ul>

</>)
const pages_filters = () => (<><p><img src={X93874} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const product_types_filters = () => (<><p><img src={M83183} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const staff_members_filters = () => (<><p><img src={H34896} alt="new filters"/>
Experience the new look and enhanced abilities of new filtering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)
const vouchers_filters = () => (<><p><img src={P36365} alt="new filters"/>
Experience the new look and enhanced abilities of new fitering mechanism.
Easily combine any criteria you want, and quickly browse their values.</p>
</>)

export const AVAILABLE_FLAGS = [{
  name: "app_alerts",
  displayName: "App alerts",
  component: app_alerts,
  visible: false,
  content: {
    enabled: false,
    payload: "default",
  }
},{
  name: "attributes_filters",
  displayName: "Attributes filtering",
  component: attributes_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
},{
  name: "collection_filters",
  displayName: "Collection filtering",
  component: collection_filters,
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
  name: "product_types_filters",
  displayName: "Product types filtering",
  component: product_types_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
},{
  name: "staff_members_filters",
  displayName: "Staff members filtering",
  component: staff_members_filters,
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
