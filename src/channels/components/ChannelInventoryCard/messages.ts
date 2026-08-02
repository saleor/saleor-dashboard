import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "I5/gU5",
    defaultMessage: "Inventory",
    description: "channel inventory card title",
  },
  assignedCount: {
    id: "NF3w7I",
    defaultMessage: "{count} assigned",
    description: "channel inventory card header count",
  },
  requiredToSell: {
    id: "UC5nF0",
    defaultMessage: "Required to sell",
    description: "channel inventory card header when no warehouses",
  },
  description: {
    id: "QgQ0NB",
    defaultMessage:
      "Warehouses this channel can reserve stock from. Without at least one, checkout can't allocate inventory for tracked products.",
    description: "channel inventory card description",
  },
  emptyTitle: {
    id: "7aZkUK",
    defaultMessage: "No warehouses assigned",
    description: "channel inventory empty state title",
  },
  emptyDescription: {
    id: "BYWrlO",
    defaultMessage:
      "This channel can't sell tracked products until it can draw stock from somewhere.",
    description: "channel inventory empty state description",
  },
  assignWarehouse: {
    id: "8F9Nsz",
    defaultMessage: "Assign",
    description: "channel inventory assign CTA short label",
  },
  createWarehouse: {
    id: "yvdudc",
    defaultMessage: "Create warehouse",
    description: "channel inventory create dropdown item",
  },
  reorderHint: {
    id: "EfF28c",
    defaultMessage: "Drag the handles to reorder.",
    description: "channel inventory reorder hint",
  },
  allocationTitle: {
    id: "oj6EqD",
    defaultMessage: "Allocation strategy",
    description: "channel inventory allocation section title",
  },
  allocationDescription: {
    id: "HupwkE",
    defaultMessage: "How stock is drawn when an order can be filled from more than one warehouse.",
    description: "channel inventory allocation description with warehouses",
  },
  allocationDescriptionWaiting: {
    id: "gWUWig",
    defaultMessage: "Applies once more than one warehouse is assigned.",
    description: "channel inventory allocation description when fewer than two",
  },
  followListOrder: {
    id: "2Sq3eY",
    defaultMessage: "Follow the list order",
    description: "channel inventory allocation option",
  },
  followListOrderDescription: {
    id: "/n3uYt",
    defaultMessage:
      "Take stock from the first warehouse above, then fall through the list. Use when one location should always ship first.",
    description: "channel inventory allocation option description",
  },
  highestStockFirst: {
    id: "bBSnYv",
    defaultMessage: "Highest stock first",
    description: "channel inventory allocation option",
  },
  highestStockFirstDescription: {
    id: "l4zYVm",
    defaultMessage:
      "Take stock from whichever warehouse holds the most, ignoring the order above. Use to keep stock levels even.",
    description: "channel inventory allocation option description",
  },
});
