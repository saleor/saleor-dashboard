import { defineMessages } from "react-intl";

const messages = defineMessages({
  warehouseSettingsPublicStock: {
    defaultMessage: "Public Stock",
    description: "WarehouseSettings public stock label"
  },
  warehouseSettingsPublicStockDescription: {
    defaultMessage: "If enabled stock in this warehouse will be shown",
    description: "WarehouseSettings public stock description"
  },
  warehouseSettingsPrivateStock: {
    defaultMessage: "Private Stock",
    description: "WarehouseSettings private stock label"
  },
  warehouseSettingsPrivateStockDescription: {
    defaultMessage: "If enabled stock in this warehouse won't be shown",
    description: "WarehouseSettings private stock description"
  },
  warehouseSettingsDisabled: {
    defaultMessage: "Disabled",
    description: "WarehouseSettings disabled warehouse label"
  },
  warehouseSettingsDisabledDescription: {
    defaultMessage:
      "If selected customer won't be able to choose this warehouse as pickup point",
    description: "WarehouseSettings disabled warehouse description"
  },
  warehouseSettingsLocal: {
    defaultMessage: "Local stock only",
    description: "WarehouseSettings local warehouse label"
  },
  warehouseSettingsLocalDescription: {
    defaultMessage:
      "If selected customer will be able to choose this warehouse as pickup point. Ordered products will be only fulfilled from this warehouse stock",
    description: "WarehouseSettings local warehouse description"
  },
  warehouseSettingsAllWarehouses: {
    defaultMessage: "All warehouses",
    description: "WarehouseSettings all warehouses label"
  },
  warehouseSettingsAllWarehousesDescription: {
    defaultMessage:
      "If selected customer will be able to choose this warehouse as pickup point. Ordered products can be shipped here from a different warehouse",
    description: "WarehouseSettings all warehouses description"
  },
  warehouseSettingsTitle: {
    defaultMessage: "Settings",
    description: "WarehouseSettings title"
  },
  warehouseSettingsPickupTitle: {
    defaultMessage: "Pickup",
    description: "WarehouseSettings pickup title"
  },
  warehouseSettingsNoShippingZonesAssigned: {
    defaultMessage: "This warehouse has no shipping zones assigned.",
    description: "WarehouseSettings no shipping zones assigned"
  }
});

export default messages;
