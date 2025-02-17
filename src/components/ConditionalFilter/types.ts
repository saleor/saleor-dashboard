import { InitialAttributesStateResponse } from "./API/initialState/attributes/InitialAttributesState";
import { InitialAttributesAPIState } from "./API/initialState/attributes/useInitialAttributesState";
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
import { InitialProductTypesStateResponse } from "./API/initialState/productTypes/InitialProductTypesState";
import { InitialProductTypesAPIState } from "./API/initialState/productTypes/useInitialProdutTypesState";
import { InitialStaffMembersStateResponse } from "./API/initialState/staffMembers/InitialStaffMembersState";
import { InitialStaffMembersAPIState } from "./API/initialState/staffMembers/useInitialStaffMemebersState";
import { InitialVouchersStateResponse } from "./API/initialState/vouchers/InitialVouchersState";
import { InitialVoucherAPIState } from "./API/initialState/vouchers/useInitialVouchersState";

export type InitialResponseType =
  | InitialProductStateResponse
  | InitialOrderStateResponse
  | InitialCollectionStateResponse
  | InitialVouchersStateResponse
  | InitialPageStateResponse
  | InitialProductTypesStateResponse
  | InitialGiftCardsStateResponse
  | InitialStaffMembersStateResponse
  | InitialAttributesStateResponse;

export type InitialAPIState =
  | InitialProductAPIState
  | InitialOrderAPIState
  | InitialVoucherAPIState
  | InitialPageAPIState
  | InitialGiftCardsAPIState
  | InitialCollectionAPIState
  | InitialProductTypesAPIState
  | InitialStaffMembersAPIState
  | InitialAttributesAPIState;

export type FilterProviderType =
  | "product"
  | "order"
  | "discount"
  | "customer"
  | "voucher"
  | "page"
  | "draft-order"
  | "gift-cards"
  | "collection"
  | "product-types"
  | "staff-members"
  | "attributes";
