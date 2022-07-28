import { defineMessages } from "react-intl";

const messages = defineMessages({
  warehouseSettingsPublicStock: {
    id: "86pLaG",
    defaultMessage: "Public Stock",
    description: "WarehouseSettings public stock label",
  },
  warehouseSettingsPublicStockDescription: {
    id: "Ff+Gsm",
    defaultMessage: "If enabled stock in this warehouse will be shown",
    description: "WarehouseSettings public stock description",
  },
  warehouseSettingsPrivateStock: {
    id: "wpli4O",
    defaultMessage: "Private Stock",
    description: "WarehouseSettings private stock label",
  },
  warehouseSettingsPrivateStockDescription: {
    id: "XlPKAR",
    defaultMessage: "If enabled stock in this warehouse won't be shown",
    description: "WarehouseSettings private stock description",
  },
  warehouseSettingsDisabled: {
    id: "OBQ+th",
    defaultMessage: "Disabled",
    description: "WarehouseSettings disabled warehouse label",
  },
  warehouseSettingsDisabledDescription: {
    id: "M8z5WZ",
    defaultMessage:
      "If selected customer won't be able to choose this warehouse as pickup point",
    description: "WarehouseSettings disabled warehouse description",
  },
  warehouseSettingsLocal: {
    id: "tVybuM",
    defaultMessage: "Local stock only",
    description: "WarehouseSettings local warehouse label",
  },
  warehouseSettingsLocalDescription: {
    id: "6G41zU",
    defaultMessage:
      "If selected customer will be able to choose this warehouse as pickup point. Ordered products will be only fulfilled from this warehouse stock",
    description: "WarehouseSettings local warehouse description",
  },
  warehouseSettingsAllWarehouses: {
    id: "16PGt9",
    defaultMessage: "All warehouses",
    description: "WarehouseSettings all warehouses label",
  },
  warehouseSettingsAllWarehousesDescription: {
    id: "LEZZkK",
    defaultMessage:
      "If selected customer will be able to choose this warehouse as pickup point. Ordered products can be shipped here from a different warehouse",
    description: "WarehouseSettings all warehouses description",
  },
  warehouseSettingsTitle: {
    id: "//iaFx",
    defaultMessage: "Settings",
    description: "WarehouseSettings title",
  },
  warehouseSettingsPickupTitle: {
    id: "MIC9W7",
    defaultMessage: "Pickup",
    description: "WarehouseSettings pickup title",
  },
  warehouseSettingsNoShippingZonesAssigned: {
    id: "cdiRSf",
    defaultMessage: "This warehouse has no shipping zones assigned.",
    description: "WarehouseSettings no shipping zones assigned",
  },
});

export default messages;
