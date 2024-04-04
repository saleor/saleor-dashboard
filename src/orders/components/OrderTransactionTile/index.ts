import { OrderTransactionTileEvent } from "./OrderTransactionTileEvent";
import { OrderTransactionTileEvents } from "./OrderTransactionTileEvents";
import { OrderTransactionTileHeader } from "./OrderTransactionTileHeader";
import { OrderTransactionTileRoot } from "./OrderTransactionTileRoot";

export const OrderTransactionTile = Object.assign(OrderTransactionTileRoot, {
  Header: OrderTransactionTileHeader,
  Event: OrderTransactionTileEvent,
  Events: OrderTransactionTileEvents,
});
