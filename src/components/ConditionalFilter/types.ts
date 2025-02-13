import { InitialCollectionStateResponse } from "./API/initialState/collections/InitialCollectionState";
import { InitialCollectionAPIState } from "./API/initialState/collections/useInitialCollectionsState";
import { InitialGiftCardsStateResponse } from "./API/initialState/giftCards/InitialGiftCardsState";
import { InitialGiftCardsAPIState } from "./API/initialState/giftCards/useInitialGiftCardsState";
import { InitialOrderStateResponse } from "./API/initialState/orders/InitialOrderState";
import { InitialOrderAPIState } from "./API/initialState/orders/useInitialOrderState";
import { InitialPageStateResponse } from "./API/initialState/page/InitialPageState";
import { InitialPageAPIState } from "./API/initialState/page/useInitialPageState";
import { InitialProductStateResponse } from "./API/initialState/product/InitialProductStateResponse";
import { InitialProductAPIState } from "./API/initialState/product/useProductInitialAPIState";
import { InitialVouchersStateResponse } from "./API/initialState/vouchers/InitialVouchersState";
import { InitialVoucherAPIState } from "./API/initialState/vouchers/useInitialVouchersState";

export type InitialResponseType =
  | InitialProductStateResponse
  | InitialOrderStateResponse
  | InitialCollectionStateResponse
  | InitialVouchersStateResponse
  | InitialPageStateResponse
  | InitialGiftCardsStateResponse;

export type InitialAPIState =
  | InitialProductAPIState
  | InitialOrderAPIState
  | InitialVoucherAPIState
  | InitialPageAPIState
  | InitialGiftCardsAPIState
  | InitialCollectionAPIState;

export type FilterProviderType =
  | "product"
  | "order"
  | "discount"
  | "customer"
  | "voucher"
  | "page"
  | "draft-order"
  | "gift-cards"
  | "collection";
