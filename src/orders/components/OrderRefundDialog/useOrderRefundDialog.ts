import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { OrderDetailsFragment, PermissionEnum } from "@dashboard/graphql";
import React from "react";

import { calculateOrderLineRefundTotals, isEveryLineFullyRefunded } from "./utils";

export type RefundType = "standard" | "manual" | "none";

export const useOrderRefundDialog = (order: OrderDetailsFragment) => {
  const [selectedRefundType, setSelected] = React.useState<RefundType>("none");

  const userPermissions = useUserPermissions();
  const canCreateManualRefund = hasPermissions(userPermissions ?? [], [
    PermissionEnum.HANDLE_PAYMENTS,
  ]);
  const canCreateStandardRefund = !isEveryLineFullyRefunded(calculateOrderLineRefundTotals(order));
  const handleChangeRefundType = (val: string) => {
    if (val === "standard" && canCreateStandardRefund) {
      setSelected("standard");
    }

    if (val === "manual" && canCreateManualRefund) {
      setSelected("manual");
    }
  };

  React.useEffect(() => {
    if (canCreateStandardRefund) {
      setSelected("standard");

      return;
    }

    if (canCreateManualRefund) {
      setSelected("manual");

      return;
    }

    setSelected("none");
  }, [canCreateStandardRefund, canCreateManualRefund]);

  return {
    selectedRefundType,
    handleChangeRefundType,
    canCreateManualRefund,
    canCreateStandardRefund,
  };
};
