import { defineMessages } from "react-intl";

const messages = defineMessages({
  changeCustomer: {
    id: "kKxHG9",
    defaultMessage: "Change customer",
    description: "button to open change customer dialog on draft order",
  },
  orderCustomerFulfillmentAll: {
    id: "R98JLZ",
    defaultMessage: "Fulfill from All Warehouses",
    description: "OrderCustomer Fulfillment from All Warehouses",
  },
  orderCustomerFulfillmentLocal: {
    id: "/w919H",
    defaultMessage: "Fulfill from Local Stock",
    description: "OrderCustomer Fulfillment from Local Warehouse",
  },
});

export default messages;

export { messages as orderCustomerMessages };
