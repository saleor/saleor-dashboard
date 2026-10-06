import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { type MessageDescriptor } from "react-intl";

import { messages } from "./messages";

export const warehousePickupListLabel = (
  option: WarehouseClickAndCollectOptionEnum,
): MessageDescriptor => {
  switch (option) {
    case WarehouseClickAndCollectOptionEnum.LOCAL:
      return messages.pickupBadgeLocal;
    case WarehouseClickAndCollectOptionEnum.ALL:
      return messages.pickupBadgeAll;
    default:
      return messages.pickupBadgeOff;
  }
};
