import { Pill } from "@dashboard/components/Pill";
import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";

interface OrderTransactionRefundStatusPillProps {
  status: OrderGrantedRefundStatusEnum;
  label?: string;
  size?: "small" | "medium";
}

const getStatusColor = (status: OrderGrantedRefundStatusEnum) => {
  switch (status) {
    case "SUCCESS":
      return "success";
    case "FAILURE":
      return "error";
    case "NONE":
      return "generic";
    case "PENDING":
      return "info";
    default:
      return "generic";
  }
};

export const OrderTransactionRefundStatusPill = ({
  status,
  label,
  size,
}: OrderTransactionRefundStatusPillProps) => {
  return <Pill color={getStatusColor(status)} label={label ?? status} size={size} />;
};
