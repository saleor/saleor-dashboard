import { Pill } from "@dashboard/components/Pill";
import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import React from "react";

interface OrderTransactionRefundStatusPillProps {
  status: OrderGrantedRefundStatusEnum;
  label?: string;
  size?: "small" | "medium";
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
      return "info";
    default:
      return "generic";
  }
};

export const OrderTransactionRefundStatusPill: React.FC<OrderTransactionRefundStatusPillProps> = ({
  status,
  label,
  size,
}) => {
  return <Pill color={getStatusColor(status)} label={label ?? status} size={size} />;
};
