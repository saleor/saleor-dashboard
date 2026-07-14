import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";

import { type OrderLineLifecycle } from "./buildOrderLineLifecycle";

export const lineNeedsAction = (lifecycle: OrderLineLifecycle): boolean => {
  if (lifecycle.pendingApproval > 0) {
    return true;
  }

  return lifecycle.grantedRefundEntries.some(
    entry =>
      entry.status === OrderGrantedRefundStatusEnum.FAILURE ||
      entry.status === OrderGrantedRefundStatusEnum.NONE,
  );
};
