import { FulfillmentStatus } from "@dashboard/graphql";
import { MessageDescriptor } from "react-intl";

import { orderTitleMessages } from "./messages";
import { CardTitleStatus } from "./OrderCardTitle";

const STATUS_MESSAGE_MAP: Record<CardTitleStatus, MessageDescriptor> = {
  [FulfillmentStatus.CANCELED]: orderTitleMessages.canceled,
  [FulfillmentStatus.FULFILLED]: orderTitleMessages.fulfilled,
  [FulfillmentStatus.REFUNDED]: orderTitleMessages.refunded,
  [FulfillmentStatus.REFUNDED_AND_RETURNED]: orderTitleMessages.refundedAndReturned,
  [FulfillmentStatus.REPLACED]: orderTitleMessages.replaced,
  [FulfillmentStatus.RETURNED]: orderTitleMessages.returned,
  [FulfillmentStatus.WAITING_FOR_APPROVAL]: orderTitleMessages.waitingForApproval,
  unfulfilled: orderTitleMessages.unfulfilled,
};

export const getOrderTitleMessage = (status?: CardTitleStatus): MessageDescriptor =>
  status ? STATUS_MESSAGE_MAP[status] : orderTitleMessages.unfulfilled;
