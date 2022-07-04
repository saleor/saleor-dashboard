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
  variantInPreorder: {
    id: "eAFU/E",
    defaultMessage: "Variant currently in preorder",
    description: "product inventory, checkbox",
  },
  trackInventory: {
    id: "TjGYna",
    defaultMessage: "Track Inventory",
    description: "product inventory, checkbox",
  },
  trackInventoryDescription: {
    id: "Wyl25+",
    defaultMessage:
      "Active inventory tracking will automatically calculate changes of stock",
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
    id: "taS/08",
    defaultMessage:
      "Assign this variant to a channel in the product channel manager to define warehouses allocation",
    description: "variant stocks section subtitle",
  },
  configureWarehouseForVariant: {
    id: "D8nsBc",
    defaultMessage:
      "There are no warehouses set up for your store. To add stock quantity to the variant please <a>configure a warehouse</a>",
    description: "no warehouses info",
  },
  configureWarehouseForProduct: {
    id: "RLBLPQ",
    defaultMessage:
      "There are no warehouses set up for your store. To add stock quantity to the product please <a>configure a warehouse</a>",
    description: "no warehouses info",
  },
  assignWarehouse: {
    id: "cBHRxx",
    defaultMessage: "Assign Warehouse",
    description: "button",
  },
});
