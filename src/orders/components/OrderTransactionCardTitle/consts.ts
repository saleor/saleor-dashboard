import { TransactionActionEnum } from "@saleor/graphql";
import { MessageDescriptor } from "react-intl";

import { transactionActionMessages } from "./messages";

// Fix when Prettier gets updated to v2.x
// type TransactionActionUnion = Exclude<`${TransactionActionEnum}`, "REFUND">;
type TransactionActionUnion = TransactionActionEnum;

export const mapActionToMessage: Record<
  TransactionActionUnion,
  MessageDescriptor
> = {
  VOID: transactionActionMessages.void,
  CHARGE: transactionActionMessages.capture,
  REFUND: null,
  CANCEL: null,
};
