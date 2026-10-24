import { defineMessages } from "react-intl";

const messages = defineMessages({
  changeCustomer: {
    id: "kKxHG9",
    defaultMessage: "Change customer",
    description: "button to open change customer dialog on draft order",
  },
  pickupLocation: {
    id: "43uGpq",
    defaultMessage: "Pickup location",
    description: "customer card section title for a click-and-collect order's collection point",
  },
  pickupStockAll: {
    id: "CURJPX",
    defaultMessage: "Stock can come from any warehouse",
    description:
      "pickup order: items may be fulfilled from other warehouses and sent to the pickup location",
  },
  pickupStockLocal: {
    id: "7bDQUo",
    defaultMessage: "Uses this location's stock only",
    description: "pickup order: items are fulfilled only from the pickup location's own stock",
  },
  sameAsPickup: {
    id: "0igWMZ",
    defaultMessage: "Same as pickup",
    description: "billing address matches the pickup location",
  },
});

export { messages as orderCustomerMessages };
