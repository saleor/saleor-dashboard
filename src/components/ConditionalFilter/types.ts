import { type InitialAttributesStateResponse } from "./API/initialState/attributes/InitialAttributesState";
import { type InitialAttributesAPIState } from "./API/initialState/attributes/useInitialAttributesState";
import { type InitialCategoryStateResponse } from "./API/initialState/category/InitialCategoryState";
import { type InitialCategoryAPIState } from "./API/initialState/category/useInitialCategoryState";
import { type InitialCollectionStateResponse } from "./API/initialState/collections/InitialCollectionState";
import { type InitialCollectionAPIState } from "./API/initialState/collections/useInitialCollectionsState";
import { type InitialGiftCardsStateResponse } from "./API/initialState/giftCards/InitialGiftCardsState";
import { type InitialGiftCardsAPIState } from "./API/initialState/giftCards/useInitialGiftCardsState";
import { type InitialOrderStateResponse } from "./API/initialState/orders/InitialOrderState";
import { type InitialOrderAPIState } from "./API/initialState/orders/useInitialOrderState";
import { type InitialPageStateResponse } from "./API/initialState/page/InitialPageState";
import { type InitialPageAPIState } from "./API/initialState/page/useInitialPageState";
import { type InitialProductStateResponse } from "./API/initialState/product/InitialProductStateResponse";
import { type InitialProductAPIState } from "./API/initialState/product/useProductInitialAPIState";
import { type InitialProductTypesStateResponse } from "./API/initialState/productTypes/InitialProductTypesState";
import { type InitialProductTypesAPIState } from "./API/initialState/productTypes/useInitialProdutTypesState";
import { type InitialStaffMembersStateResponse } from "./API/initialState/staffMembers/InitialStaffMembersState";
import { type InitialStaffMembersAPIState } from "./API/initialState/staffMembers/useInitialStaffMemebersState";
import { type InitialVouchersStateResponse } from "./API/initialState/vouchers/InitialVouchersState";
import { type InitialVoucherAPIState } from "./API/initialState/vouchers/useInitialVouchersState";

export type InitialResponseType =
  | InitialProductStateResponse
  | InitialOrderStateResponse
  | InitialCollectionStateResponse
  | InitialVouchersStateResponse
  | InitialPageStateResponse
  | InitialProductTypesStateResponse
  | InitialGiftCardsStateResponse
  | InitialStaffMembersStateResponse
  | InitialAttributesStateResponse
  | InitialCategoryStateResponse;

export type InitialAPIState =
  | InitialProductAPIState
  | InitialOrderAPIState
  | InitialVoucherAPIState
  | InitialPageAPIState
  | InitialGiftCardsAPIState
  | InitialCollectionAPIState
  | InitialProductTypesAPIState
  | InitialStaffMembersAPIState
  | InitialAttributesAPIState
  | InitialCategoryAPIState;

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
  | "attributes"
  | "category";
