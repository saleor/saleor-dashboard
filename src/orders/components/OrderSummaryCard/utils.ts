import { subtractMoney } from "@saleor/components/Money";
import { OrderDetailsFragment } from "@saleor/graphql";
import { IMoney } from "@saleor/utils/intl";

export const extractOutstandingBalance = (
  order: OrderDetailsFragment,
): IMoney =>
  order?.totalCaptured &&
  order?.total?.gross &&
  subtractMoney(order.total.gross, order.totalCaptured);
