// @ts-nocheck

import B90576 from "./images/app-alerts.jpg"
import S32086 from "./images/discounts-list.png"
import B37609 from "./images/extensions.png"
import S26171 from "./images/improved_refunds.png"

const app_alerts = () => (<><p><img src={B90576} alt="new filters"/>
Benefit from new notifications in your Dashboard that alert you to issues with webhooks for your apps, helping you stay informed about potential problems.
We’re continuously working to expand this feature to provide more insights for your apps.</p>
</>)
const discounts_rules = () => (<><p><img src={S32086} alt="Discount rules"/></p>
<p>Apply the new discounts rules to narrow your promotions audience.
Set up conditions and channels that must be fulfilled to apply defined reward.</p>
</>)
const extensions_dev = () => (<></>)
const extensions = () => (<><p><img src={B37609} alt="Extensions"/></p>
<p>Experience the new interface for browsing and installing extensions in the ‘Explore’ view</p>
</>)
const improved_refunds = () => (<><p><img src={S26171} alt="Improved refunds"/></p>
<h3 id="enable-the-enhanced-refund-feature-to-streamline-your-refund-process">Enable the enhanced refund feature to streamline your refund process:</h3>
<ul>
<li><p>• Choose between automatic calculations based on selected items or enter refund amounts directly for overcharges and custom adjustments.</p>
</li>
<li><p>• Take advantage of separate permissions for drafting and finalizing refunds, enhancing control and security in the process.</p>
</li>
</ul>

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
  name: "app_alerts",
  displayName: "App alerts",
  component: app_alerts,
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
  name: "extensions_dev",
  displayName: "Extensions dev flag",
  component: extensions_dev,
  visible: false,
  content: {
    enabled: false,
    payload: "default",
  }
},{
  name: "extensions",
  displayName: "New Explore view",
  component: extensions,
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
  name: "new_filters",
  displayName: "New filtering",
  component: new_filters,
  visible: true,
  content: {
    enabled: true,
    payload: "default",
  }
}] as const;
