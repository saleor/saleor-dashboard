import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "vCt3/t",
    defaultMessage: "Finish setting up this channel",
    description: "channel setup card title",
  },
  subtitle: {
    id: "+2MvXa",
    defaultMessage:
      "Channels work like markets. Customers can’t check out until the required steps are done. Finish them now or come back later.",
    description: "channel setup card subtitle",
  },
  nextUp: {
    id: "Gm3fGD",
    defaultMessage: "Next up: {task}",
    description: "footer hint for the next required setup task",
  },
  nextUpDone: {
    id: "0hCh0t",
    defaultMessage: "Required steps are complete.",
    description: "footer when warehouse and shipping are done",
  },
  warehouseTitle: {
    id: "u6gp+Y",
    defaultMessage: "Add a stock location",
    description: "setup task title",
  },
  warehouseDescription: {
    id: "8Ai2Lr",
    defaultMessage:
      "Create a warehouse, or assign an existing one, so this channel can allocate inventory.",
    description: "setup task description",
  },
  warehouseDescriptionAssign: {
    id: "w2cy6v",
    defaultMessage: "Assign existing warehouses, or create a new one for this channel.",
    description: "setup task description when warehouses already exist in the shop",
  },
  warehouseCreate: {
    id: "szm4zm",
    defaultMessage: "Create warehouse",
    description: "setup task CTA",
  },
  warehouseAssign: {
    id: "PqLlpS",
    defaultMessage: "Assign warehouses",
    description: "setup task CTA when warehouses exist",
  },
  warehouseDone: {
    id: "JFbw16",
    defaultMessage: "{count} {count, plural, one {warehouse} other {warehouses}} assigned",
    description: "setup task complete",
  },
  warehousePermissionRequired: {
    id: "LSvab3",
    defaultMessage: "Missing permission to manage products",
    description: "badge when warehouse setup CTAs are unavailable",
  },
  warehouseDescriptionNoPermission: {
    id: "jt2Sm+",
    defaultMessage:
      "You need product permissions to create or assign a warehouse for this channel.",
    description: "setup task description when warehouse actions unavailable",
  },
  warehouseDetails: {
    id: "WvabuR",
    defaultMessage:
      "Inventory is tracked per warehouse. This channel can only reserve stock from warehouses you assign here—without one, checkout can’t allocate inventory for tracked products.",
    description:
      "Expanded help for warehouse setup. Based on Saleor stock allocation: stocks allocate only from warehouses available in the order channel.",
  },
  shippingTitle: {
    id: "LWlDC+",
    defaultMessage: "Set up shipping",
    description: "setup task title",
  },
  shippingDescription: {
    id: "OmrtHH",
    defaultMessage:
      "Create a shipping zone for your default country with a flat rate, or assign an existing zone.",
    description: "setup task description",
  },
  shippingDescriptionAssign: {
    id: "Y2dPyq",
    defaultMessage: "Assign existing shipping zones, or create a new zone with a flat rate.",
    description: "setup task description when shipping zones already exist",
  },
  shippingCreate: {
    id: "SWN9Jj",
    defaultMessage: "Create shipping",
    description: "setup task CTA",
  },
  shippingAssign: {
    id: "OZqeK6",
    defaultMessage: "Assign shipping zones",
    description: "setup task CTA when zones exist",
  },
  shippingRequiresWarehouse: {
    id: "TIQ1eV",
    defaultMessage: "Requires a stock location",
    description: "badge when shipping is locked until warehouse exists",
  },
  shippingPermissionRequired: {
    id: "1M0OKI",
    defaultMessage: "Missing permission to manage shipping",
    description: "badge when shipping setup CTAs are unavailable",
  },
  shippingDescriptionNoPermission: {
    id: "FbWSQs",
    defaultMessage: "You need shipping permissions to create or assign zones for this channel.",
    description: "setup task description when shipping actions unavailable",
  },
  shippingDone: {
    id: "k4j6EA",
    defaultMessage: "{count} shipping {count, plural, one {zone} other {zones}} assigned",
    description: "setup task complete",
  },
  shippingDetails: {
    id: "7CpvZg",
    defaultMessage:
      "Shipping zones define which countries you deliver to and which rates customers see at checkout. Assign this channel to a zone that covers your default country so shoppers can choose a shipping method.",
    description:
      "Expanded help for shipping setup. Based on Saleor shipping zones: zones set countries/methods and must be linked to the channel for checkout rates.",
  },
  tasksSectionTitle: {
    id: "Y6amBy",
    defaultMessage: "Required by checkout",
    description: "setup checklist required section title",
  },
  reviewSectionTitle: {
    id: "9Czafv",
    defaultMessage: "Worth reviewing",
    description: "setup checklist optional section title",
  },
  reviewSectionSubtitle: {
    id: "35Ix6Q",
    defaultMessage: "Review before activating",
    description: "setup checklist review section subtitle",
  },
  taxTitle: {
    id: "RZZAjR",
    defaultMessage: "Taxes",
    description: "setup review row title",
  },
  taxDescription: {
    id: "86CJVg",
    defaultMessage: "How tax is calculated for this channel.",
    description: "setup review row description",
  },
  taxStatusOff: {
    id: "atlZPe",
    defaultMessage: "Taxes off",
    description: "tax strategy status when not charging",
  },
  taxStatusFlatRates: {
    id: "LxGbUN",
    defaultMessage: "Flat rates",
    description: "tax strategy status for flat rates",
  },
  taxStatusApp: {
    id: "UjUw4+",
    defaultMessage: "Tax app",
    description: "tax strategy status when using a tax app",
  },
  paymentsTitle: {
    id: "Io6O//",
    defaultMessage: "Payment gateways",
    description: "setup review row title for installed payment apps",
  },
  paymentsDescription: {
    id: "b2Nzq4",
    defaultMessage: "Installed payment apps still need to be set up for checkout.",
    description: "setup review row description when payment apps are installed",
  },
  paymentsDescriptionNone: {
    id: "VWuT7A",
    defaultMessage: "Install a payment app so customers can pay at checkout.",
    description: "setup review row description when no payment apps",
  },
  paymentsStatusCount: {
    id: "fz0ZMN",
    defaultMessage: "{count} installed",
    description: "count of installed payment apps",
  },
  paymentsStatusNone: {
    id: "KwvZpP",
    defaultMessage: "No payment apps",
    description: "zero payment apps status",
  },
  catalogTitle: {
    id: "VseKVb",
    defaultMessage: "Products",
    description: "setup review row title",
  },
  catalogDescription: {
    id: "YmweRb",
    defaultMessage: "Products published to this channel, priced in its currency.",
    description: "setup review row description when warehouses are ready",
  },
  catalogDescriptionNoShopWarehouse: {
    id: "ISsHpV",
    defaultMessage:
      "Create a warehouse to set stock when adding products. You can still publish products and set prices.",
    description: "setup review row description when shop has no warehouses",
  },
  catalogDescriptionNoChannelWarehouse: {
    id: "BxHDRs",
    defaultMessage:
      "Add products and prices now. Assign a warehouse to this channel for checkout inventory.",
    description: "setup review row description when channel has no warehouses",
  },
  catalogStatusPublished: {
    id: "Gx+CaK",
    defaultMessage: "{published} of {total} published",
    description: "products published to channel vs shop total",
  },
  catalogStatusNoWarehouse: {
    id: "WrlaSD",
    defaultMessage: "No warehouse",
    description: "catalog setup status when shop has no warehouses",
  },
  catalogStatusAssignWarehouse: {
    id: "84XFds",
    defaultMessage: "Assign warehouse",
    description: "catalog setup status when channel has no warehouses",
  },
  dismiss: {
    id: "O6C+2E",
    defaultMessage: "Skip for now",
    description: "dismiss setup checklist while required steps remain",
  },
  dismissComplete: {
    id: "IrwpKJ",
    defaultMessage: "Dismiss",
    description: "dismiss setup checklist after required steps are done",
  },
  activateChannel: {
    id: "69M0SI",
    defaultMessage: "Activate channel",
    description: "setup checklist primary CTA to activate the channel",
  },
  allDone: {
    id: "up2u+U",
    defaultMessage:
      "Stock and shipping are ready. Review the steps below before you activate this channel.",
    description: "when warehouse and shipping tasks complete",
  },
});
