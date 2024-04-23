import { Pill } from "@dashboard/components/Pill";
import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import React from "react";

interface OrderTransactionRefundStatusPillProps {
  status: OrderGrantedRefundStatusEnum;
}

const getStatusColor = (status: OrderGrantedRefundStatusEnum) => {
  switch (status) {
    case OrderGrantedRefundStatusEnum.SUCCESS:
      return "success";
    case OrderGrantedRefundStatusEnum.FAILURE:
      return "error";
    case OrderGrantedRefundStatusEnum.NONE:
      return "generic";
    case OrderGrantedRefundStatusEnum.PENDING:
      return "warning";
    default:
      return "generic";
  }
};

export const OrderTransactionRefundStatusPill: React.FC<
  OrderTransactionRefundStatusPillProps
> = ({ status }) => {
  return <Pill color={getStatusColor(status)} label={status} />;
};
