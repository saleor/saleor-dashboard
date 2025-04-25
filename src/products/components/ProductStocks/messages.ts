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
  preorderEndDateSetup: {
    id: "REVk27",
    defaultMessage:
      "Set up an end date of preorder. When end date will be reached product will be automatically taken from preorder to standard selling",
    description: "info text",
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
  preorderProductsAvailability: {
    id: "Gz+4CI",
    defaultMessage:
      "Preordered products will be available in all warehouses. You can set a threshold for sold quantity. Leaving input blank will be interpreted as no limit to sale. Sold items will be allocated at the warehouse assigned to chosen shipping zone.",
    description: "info text",
  },
  preorderTresholdLabel: {
    id: "/iijFq",
    defaultMessage: "Global threshold",
    description: "input label",
  },
  preorderTresholdDescription: {
    id: "HYC6cH",
    defaultMessage:
      "Threshold that cannot be exceeded even if per channel thresholds are still available",
    description: "input description",
  },
  preorderTresholdUnitsLeft: {
    id: "JkO0jp",
    defaultMessage: "{unitsLeft} units left",
    description: "input description",
  },
  preorderTresholdUnlimited: {
    id: "tlGXkh",
    defaultMessage: "Unlimited",
    description: "input description",
  },
  soldUnits: {
    id: "HcQEUk",
    defaultMessage: "Sold units",
    description: "table column header, sold units preorder quantity",
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
});
