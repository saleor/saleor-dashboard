import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "4qe6hO",
    defaultMessage: "Inventory",
    description: "product stock, section header",
  },
  sku: {
    id: "SM+yG0",
    defaultMessage: "SKU (Stock Keeping Unit)",
    description: "input label",
  },
  stock: {
    id: "vuKrlW",
    defaultMessage: "Stock",
  },
  trackInventory: {
    id: "TjGYna",
    defaultMessage: "Track Inventory",
    description: "product inventory, checkbox",
  },
  trackInventoryDescription: {
    id: "Wyl25+",
    defaultMessage: "Active inventory tracking will automatically calculate changes of stock",
    description: "product inventory, checkbox description",
  },
  quantity: {
    id: "bp/i0x",
    defaultMessage: "Quantity",
    description: "header",
  },
  warehouseName: {
    id: "ErvPaM",
    defaultMessage: "Warehouse Name",
    description: "header",
  },
  allocated: {
    id: "/C//FB",
    defaultMessage: "Allocated",
    description: "header, allocated product quantity",
  },
  noChannelWarehousesAllocation: {
    id: "/+k9uY",
    defaultMessage: "Add channels in Pricing to define warehouse allocation",
    description: "variant stocks section subtitle",
  },
  configureWarehouseForVariant: {
    id: "NCp87D",
    defaultMessage:
      "There are no warehouses set up for this variant. To add stock quantity to the variant <a>configure a warehouse</a> or use existing one by clicking button below.",
    description: "no warehouses info",
  },
  configureWarehouseForProduct: {
    id: "BHr3fj",
    defaultMessage:
      "There are no warehouses set up for this product. To add stock quantity to the product <a>configure a warehouse</a> or use existing one by clicking button below.",
    description: "no warehouses info",
  },
  assignWarehouse: {
    id: "cBHRxx",
    defaultMessage: "Assign Warehouse",
    description: "button",
  },
  assignWarehouses: {
    id: "aRvO6i",
    defaultMessage: "Assign Warehouses",
    description: "button",
  },
  endDateCancel: {
    id: "bk2M4q",
    defaultMessage: "Cancel end date",
    description: "button",
  },
  endDateSetup: {
    id: "tqJwfo",
    defaultMessage: "Set end date",
    description: "button",
  },
  channelTreshold: {
    id: "MNZY28",
    defaultMessage: "Channel threshold",
    description: "table column header",
  },
  warehouseMessageVariantOnCreate: {
    id: "BaxGjT",
    defaultMessage: "Assigning the stocks will be possible after the variant is saved.",
    description: "variant stocks section subtitle",
  },
  warehouseMessageProductOnCreate: {
    id: "lhfPkc",
    defaultMessage: "Assigning the stocks will be possible after the product is saved.",
    description: "variant stocks section subtitle",
  },
  stockVisibilityHintDirect: {
    id: "Dh6A6J",
    defaultMessage:
      "Customers in a channel see this stock when the warehouse is assigned to that channel.",
    description:
      "Footnote shown beneath the per-warehouse stock table on the variant detail page when the shop has the new (direct) warehouse-channel stock-availability mode enabled.",
  },
  stockVisibilityHintLegacy: {
    id: "6cqHxE",
    defaultMessage:
      "Customers see this stock when the warehouse is assigned to a channel and covered by a shipping zone for the destination.",
    description:
      "Footnote shown beneath the per-warehouse stock table on the variant detail page when the shop is in legacy stock-availability mode (stock visibility filtered through shipping zones).",
  },
  stockPasteHint: {
    id: "QIe5rc",
    defaultMessage:
      "You can paste from a spreadsheet. Select a quantity field and paste a column of values to fill stock down the list.",
    description: "variant stock spreadsheet paste hint",
  },
});
