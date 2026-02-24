// @ts-strict-ignore
import {
  AppsListDocument,
  type AppsListQuery,
  type AppsListQueryVariables,
  AttributeListDocument,
  type AttributeListQuery,
  type AttributeListQueryVariables,
  type CategoryDetailsQuery,
  type CategoryDetailsQueryVariables,
  CheckoutListDocument,
  type CheckoutListQuery,
  type CheckoutListQueryVariables,
  CollectionListDocument,
  type CollectionListQuery,
  type CollectionListQueryVariables,
  type CustomerAddressesQuery,
  type CustomerAddressesQueryVariables,
  type CustomerDetailsQuery,
  type CustomerDetailsQueryVariables,
  GiftCardListDocument,
  type GiftCardListQuery,
  type GiftCardListQueryVariables,
  ListCustomersDocument,
  type ListCustomersQuery,
  type ListCustomersQueryVariables,
  MenuListDocument,
  type MenuListQuery,
  type MenuListQueryVariables,
  type OrderFulfillDataQuery,
  type OrderFulfillDataQueryVariables,
  OrderListDocument,
  type OrderListQuery,
  type OrderListQueryVariables,
  PageListDocument,
  type PageListQuery,
  type PageListQueryVariables,
  ProductListDocument,
  type ProductListQuery,
  type ProductListQueryVariables,
  type ProductVariantListQuery,
  type ProductVariantListQueryVariables,
  RootCategoriesDocument,
  type RootCategoriesQuery,
  type RootCategoriesQueryVariables,
  SaleListDocument,
  type SaleListQuery,
  type SaleListQueryVariables,
  ShippingZonesDocument,
  StaffListDocument,
  type StaffListQuery,
  type StaffListQueryVariables,
  VoucherListDocument,
  type VoucherListQuery,
  type VoucherListQueryVariables,
  WarehouseListDocument,
  type WarehouseListQuery,
  type WarehouseListQueryVariables,
} from "@dashboard/graphql";
import { type DocumentNode } from "graphql";

const DefaultVariables = {
  first: 100,
};

export type TData =
  | ProductListQuery
  | OrderListQuery
  | GiftCardListQuery
  | CustomerAddressesQuery
  | AppsListQuery
  | AttributeListQuery
  | CategoryDetailsQuery
  | CheckoutListQuery
  | GiftCardListQuery
  | CollectionListQuery
  | CustomerDetailsQuery
  | OrderFulfillDataQuery
  | ListCustomersQuery
  | MenuListQuery
  | OrderListQuery
  | PageListQuery
  | ProductListQuery
  | ProductVariantListQuery
  | RootCategoriesQuery
  | SaleListQuery
  | StaffListQuery
  | VoucherListQuery
  | WarehouseListQuery;

export type TVariables =
  | ProductListQueryVariables
  | OrderListQueryVariables
  | GiftCardListQueryVariables
  | CustomerAddressesQueryVariables
  | AppsListQueryVariables
  | AttributeListQueryVariables
  | CategoryDetailsQueryVariables
  | ListCustomersQueryVariables
  | CheckoutListQueryVariables
  | GiftCardListQueryVariables
  | CollectionListQueryVariables
  | CustomerDetailsQueryVariables
  | OrderFulfillDataQueryVariables
  | MenuListQueryVariables
  | OrderListQueryVariables
  | PageListQueryVariables
  | ProductListQueryVariables
  | ProductVariantListQueryVariables
  | RootCategoriesQueryVariables
  | SaleListQueryVariables
  | StaffListQueryVariables
  | VoucherListQueryVariables
  | WarehouseListQueryVariables;

interface Document {
  document: DocumentNode;
  variables: TVariables;
  collection?: string;
  displayedAttribute?: string;
}

export const DocumentMap: Record<string, Document> = {
  APP: {
    document: AppsListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  ATTRIBUTE: {
    document: AttributeListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  CATEGORY: {
    document: RootCategoriesDocument,
    variables: DefaultVariables,
    collection: "categories",
    displayedAttribute: "name",
  },
  GIFT_CARD: {
    document: GiftCardListDocument,
    variables: DefaultVariables,
    displayedAttribute: "last4CodeChars",
  },
  CHECKOUT: {
    document: CheckoutListDocument,
    variables: DefaultVariables,
    displayedAttribute: "id",
  },
  COLLECTION: {
    document: CollectionListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  CUSTOMER: {
    document: ListCustomersDocument,
    variables: DefaultVariables,
    displayedAttribute: "email",
    // TODO inverted name
  },
  MENU: {
    document: MenuListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  ORDER: {
    document: OrderListDocument,
    variables: DefaultVariables,
    displayedAttribute: "number",
  },
  PAGE: {
    document: PageListDocument,
    variables: DefaultVariables,
    displayedAttribute: "title",
  },
  PRODUCT: {
    document: ProductListDocument,
    variables: {
      first: 100,
      hasChannel: true,
      includeCategories: false,
      includeCollections: false,
    },
    displayedAttribute: "name",
  },
  SALE: {
    document: SaleListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  SHIPPING_PRICE: {
    document: ShippingZonesDocument,
    variables: DefaultVariables,
    collection: "shippingZones",
    displayedAttribute: "name",
  },
  SHIPPING_ZONE: {
    document: ShippingZonesDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  STAFF: {
    document: StaffListDocument,
    variables: DefaultVariables,
    collection: "staffUsers",
    displayedAttribute: "email",
  },
  VOUCHER: {
    document: VoucherListDocument,
    variables: DefaultVariables,
    displayedAttribute: "code",
  },
  WAREHOUSE: {
    document: WarehouseListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
};

// Documents which require parent object or can't be handled ATM
//
export const ExcludedDocumentKeys = [
  // USER ID REQUIRED
  "ADDRESS",
  // it's not a countable collection
  "CHANNEL",
  // ORDER ID REQUIRED
  "FULFILLMENT",
  // PRODUCT ID REQUIRED
  "PRODUCT_VARIANT",
  "PRODUCT_EXPORT_COMPLETED",
  "PRODUCT_MEDIA_CREATED",
  "PRODUCT_MEDIA_DELETED",
  "PRODUCT_MEDIA_UPDATED",
  "PRODUCT_VARIANT_BACK_IN_STOCK",
  "PRODUCT_VARIANT_CREATED",
  "PRODUCT_VARIANT_DELETED",
  "PRODUCT_VARIANT_METADATA_UPDATED",
  "PRODUCT_VARIANT_OUT_OF_STOCK",
  "PRODUCT_VARIANT_STOCK_UPDATED",
  "PRODUCT_VARIANT_UPDATED",
  "VOUCHER_CODES_CREATED",
  "VOUCHER_CODES_DELETED",
  "VOUCHER_CODE_EXPORT_COMPLETED",
  "ORDER_BULK_CREATED",
  "TRANSLATION",
];
