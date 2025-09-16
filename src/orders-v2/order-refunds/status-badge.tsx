import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";

import { StatusPill } from "../status-pill";

const getStatusConfig = (status: OrderGrantedRefundStatusEnum) => {
  switch (status) {
    case OrderGrantedRefundStatusEnum.FAILURE:
      return {
        label: "Failure",
        status: "error",
      } as const;
    case OrderGrantedRefundStatusEnum.SUCCESS:
      return {
        label: "Success",
        status: "success",
      } as const;
    case OrderGrantedRefundStatusEnum.PENDING:
      return {
        status: "warning",
        label: "Pending",
      } as const;
    case OrderGrantedRefundStatusEnum.NONE:
    default:
      return {
        status: "warning",
        label: "Draft",
      } as const;
  }
};

export const StatusBadge = ({ status }: { status: OrderGrantedRefundStatusEnum }) => {
  const config = getStatusConfig(status);

  return <StatusPill status={config.status}>{config.label}</StatusPill>;
};
