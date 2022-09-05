import { TransactionActionEnum } from "@saleor/graphql";
import { MessageDescriptor } from "react-intl";

import { transactionActionMessages } from "./messages";

type TransactionActionUnion = Exclude<`${TransactionActionEnum}`, "REFUND">;

export const mapActionToMessage: Record<
  TransactionActionUnion,
  MessageDescriptor
> = {
  VOID: transactionActionMessages.void,
  CHARGE: transactionActionMessages.capture,
};
