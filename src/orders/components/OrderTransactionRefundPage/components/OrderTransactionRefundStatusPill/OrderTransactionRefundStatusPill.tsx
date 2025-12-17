import { Pill } from "@dashboard/components/Pill";
import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";

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
      return "neutral";
    case OrderGrantedRefundStatusEnum.PENDING:
      return "info";
    default:
      return "neutral";
  }
};

export const OrderTransactionRefundStatusPill = ({
  status,
  label,
  size,
}: OrderTransactionRefundStatusPillProps) => {
  return <Pill color={getStatusColor(status)} label={label ?? status} size={size} />;
};
