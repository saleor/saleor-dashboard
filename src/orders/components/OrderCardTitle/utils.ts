import { FulfillmentStatus } from "@dashboard/graphql";
import { MessageDescriptor } from "react-intl";

import { orderTitleMessages } from "./messages";
import { CardTitleStatus } from "./OrderCardTitle";

const STATUS_MESSAGE_MAP: Record<CardTitleStatus, MessageDescriptor> = {
  ["CANCELED"]: orderTitleMessages.canceled,
  ["FULFILLED"]: orderTitleMessages.fulfilled,
  ["REFUNDED"]: orderTitleMessages.refunded,
  ["REFUNDED_AND_RETURNED"]: orderTitleMessages.refundedAndReturned,
  ["REPLACED"]: orderTitleMessages.replaced,
  ["RETURNED"]: orderTitleMessages.returned,
  ["WAITING_FOR_APPROVAL"]: orderTitleMessages.waitingForApproval,
  unfulfilled: orderTitleMessages.unfulfilled,
};

export const getOrderTitleMessage = (status?: CardTitleStatus): MessageDescriptor =>
  status ? STATUS_MESSAGE_MAP[status] : orderTitleMessages.unfulfilled;
