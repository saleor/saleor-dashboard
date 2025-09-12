import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { useState } from "react";

export type RefundType = "standard" | "manual";

export const useOrderRefundDialog = () => {
  const [selectedRefundType, setSelected] = useState<RefundType>("standard");

  const userPermissions = useUserPermissions();
  const canCreateManualRefund = hasPermissions(userPermissions ?? [], [
    PermissionEnum.HANDLE_PAYMENTS,
  ]);
  const handleChangeRefundType = (val: string) => {
    if (val === "standard") {
      setSelected("standard");
    }

    if (val === "manual" && canCreateManualRefund) {
      setSelected("manual");
    }
  };

  return {
    selectedRefundType,
    handleChangeRefundType,
    canCreateManualRefund,
  };
};
