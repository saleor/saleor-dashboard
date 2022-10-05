import { defineMessages } from "react-intl";

export const messages = defineMessages({
  allocationStrategy: {
    defaultMessage: "Allocation strategy",
    id: "FYfoiF",
    description: "section name",
  },
  allocationStrategyDescription: {
    defaultMessage:
      "Strategy defines the preference of warehouses for stock allocations and reservations.",
    id: "/DzBc6",
    description: "section description",
  },
  prioritizeBySortOrder: {
    defaultMessage: "Prioritize warehouses by sorting order",
    id: "FSOOH7",
    description: "option title",
  },
  prioritizeBySortOrderDescription: {
    defaultMessage:
      "Allocate stock in the first warehouse in the list assigned to this channel. If stock is insufficient, the remaining quantity is allocated in the next warehouse on the list and repeated if necessary.",
    id: "YiC3cn",
    description: "option description",
  },
  prioritizeByHighestStock: {
    defaultMessage: "Prioritize warehouses with highest stock",
    id: "423QsF",
    description: "option title",
  },
  prioritizeByHighestStockDescription: {
    defaultMessage:
      "Allocate order-line to a warehouse with the most stock. If not enough stock is available in a single warehouse, the remaining quantity is allocated in the next warehouse with the most stock and repeated if necessary.",
    id: "HN1Gvw",
    description: "option description",
  },
  allocaationMayOccur: {
    defaultMessage: "Stock allocations occur when:",
    description: "tooltip",
    id: "icb1fc",
  },
  allocaationMayOccurWithTrackInventory: {
    defaultMessage:
      'Order contains products that have "Track inventory" enabled.',
    description: "tooltip",
    id: "q5Lfp4",
  },
  allocaationMayOccurWithReservationTime: {
    defaultMessage:
      "Checkout reservation time threshold is enabled in settings.",
    description: "tooltip",
    id: "G5NKx6",
  },
});
