import { defineMessages } from "react-intl";

export const messages = defineMessages({
  headerOrder: {
    defaultMessage: "Order",
    description: "page header"
  },
  headerOrderNumber: {
    defaultMessage: "Order #{orderNumber}",
    description: "page header"
  },
  headerOrderNumberAddFulfillment: {
    defaultMessage: "Order no. {orderNumber} - Add Fulfillment",
    description: "page header"
  },
  submitFulfillment: {
    defaultMessage: "Fulfill",
    description: "fulfill order, button"
  },
  submitPrepareFulfillment: {
    defaultMessage: "Prepare fulfillment",
    description: "prepare order fulfillment, button"
  },
  itemsReadyToShip: {
    defaultMessage: "Items ready to ship",
    description: "header"
  },
  productName: {
    defaultMessage: "Product name",
    description: "name"
  },
  sku: {
    defaultMessage: "SKU",
    description: "product's sku"
  },
  quantityToFulfill: {
    defaultMessage: "Quantity to fulfill",
    description: "quantity of fulfilled products"
  },
  noStock: {
    defaultMessage: "No Stock",
    description: "no variant stock in warehouse"
  },
  sentShipmentDetails: {
    defaultMessage: "Send shipment details to customer",
    description: "checkbox label"
  }
});
