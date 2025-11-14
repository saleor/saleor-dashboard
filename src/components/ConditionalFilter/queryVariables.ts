import {
  AttributeFilterInput,
  CollectionFilterInput,
  CustomerFilterInput,
  GiftCardFilterInput,
  OrderDraftFilterInput,
  OrderWhereInput,
  PageFilterInput,
  ProductTypeFilterInput,
  ProductWhereInput,
  PromotionWhereInput,
  StaffUserInput,
  VoucherFilterInput,
} from "@dashboard/graphql";

import { FilterContainer } from "./FilterElement";
import { FiltersQueryBuilder, QueryApiType } from "./FiltersQueryBuilder";
import { FilterQueryVarsBuilderResolver } from "./FiltersQueryBuilder/FilterQueryVarsBuilderResolver";
import { AddressFieldQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/AddressFieldQueryVarsBuilder";
import { ArrayMetadataQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/ArrayMetadataQueryVarsBuilder";
import { ArrayNestedFieldQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/ArrayNestedFieldQueryVarsBuilder";
import { DateTimeRangeQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/DateTimeRangeQueryVarsBuilder";
import { FulfillmentStatusQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/FulfillmentStatusQueryVarsBuilder";
import { FulfillmentWarehouseQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/FulfillmentWarehouseQueryVarsBuilder";
import { IntFilterQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/IntFilterQueryVarsBuilder";
import { MetadataFilterInputQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/MetadataFilterInputQueryVarsBuilder";
import { OrderChannelQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/OrderChannelQueryVarsBuilder";
import { OrderCustomerIdQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/OrderCustomerIdQueryVarsBuilder";
import { OrderIdQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/OrderIdQueryVarsBuilder";
import { OrderInvoiceDateQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/OrderInvoiceDateQueryVarsBuilder";
import { PriceFilterQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/PriceFilterQueryVarsBuilder";
import { SlugChannelQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders/SlugChannelQueryVarsBuilder";

type ProductQueryVars = ProductWhereInput & { channel?: { eq: string } };
type VoucherQueryVars = VoucherFilterInput & { channel?: string };
type CollectionQueryVars = CollectionFilterInput & { channel?: string };

// Single source of truth for API types used across all filter pages
export const QUERY_API_TYPES = {
  PRODUCT: QueryApiType.WHERE,
  DISCOUNT: QueryApiType.WHERE,
  ORDER: QueryApiType.WHERE,
  VOUCHER: QueryApiType.FILTER,
  PAGE: QueryApiType.FILTER,
  DRAFT_ORDER: QueryApiType.FILTER,
  GIFT_CARD: QueryApiType.FILTER,
  CUSTOMER: QueryApiType.FILTER,
  COLLECTION: QueryApiType.FILTER,
  PRODUCT_TYPE: QueryApiType.FILTER,
  STAFF_MEMBER: QueryApiType.FILTER,
  ATTRIBUTE: QueryApiType.FILTER,
} as const;

export const createProductQueryVariables = (filterContainer: FilterContainer): ProductQueryVars => {
  const builder = new FiltersQueryBuilder<ProductQueryVars, "channel">({
    apiType: QUERY_API_TYPES.PRODUCT,
    filterContainer,
    topLevelKeys: ["channel"],
  });
  const { topLevel, filters } = builder.build();

  return { ...filters, ...topLevel };
};

export const createDiscountsQueryVariables = (value: FilterContainer): PromotionWhereInput => {
  const builder = new FiltersQueryBuilder<PromotionWhereInput>({
    apiType: QUERY_API_TYPES.DISCOUNT,
    filterContainer: value,
  });
  const { filters } = builder.build();

  return filters;
};

// TODO: We should probably map fields based on query + field name, not using simple `canHandle` strategy
// E.g. Orders query uses DateTimeRangeInput for createdAt, updatedAt, but Product query uses DateTimeFilterInput for updatedAt
// Fields have the same name for both queries, but different input types
const orderFilterDefinitionResolver = new FilterQueryVarsBuilderResolver([
  new OrderChannelQueryVarsBuilder(), // Map channels -> channelId
  new OrderCustomerIdQueryVarsBuilder(), // Map customer -> user
  new OrderIdQueryVarsBuilder(), // Handle ids as plain arrays
  new OrderInvoiceDateQueryVarsBuilder(), // Handle invoice date filtering
  new AddressFieldQueryVarsBuilder(), // Handle address fields (billing/shipping phone/country)
  new ArrayNestedFieldQueryVarsBuilder(), // Handle nested fields in transactions (payment type/card brand)
  new ArrayMetadataQueryVarsBuilder(), // Handle metadata in arrays (lines, transactions, fulfillments)
  new FulfillmentStatusQueryVarsBuilder(), // Handle fulfillment status nested in arrays
  new FulfillmentWarehouseQueryVarsBuilder(), // Handle fulfillment warehouse nested in arrays
  new IntFilterQueryVarsBuilder(), // Orders query use IntFilterInput, not IntRangeInput
  new PriceFilterQueryVarsBuilder(), // Handle price/amount fields
  new DateTimeRangeQueryVarsBuilder(), // Orders query use DateTimeRangeInput, not DateTimeFilterInput
  new MetadataFilterInputQueryVarsBuilder(), // Orders query uses MetadataFilterInput, not MetadataInput
  ...FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders(),
]);

export const createOrderQueryVariables = (value: FilterContainer): OrderWhereInput => {
  const builder = new FiltersQueryBuilder<OrderWhereInput>({
    apiType: QUERY_API_TYPES.ORDER,
    filterContainer: value,
    useAndWrapper: true,
    filterDefinitionResolver: orderFilterDefinitionResolver,
  });
  const { filters } = builder.build();

  return filters;
};

const voucherFilterDefinitionResolver = new FilterQueryVarsBuilderResolver([
  // VoucherPage expects channel to be a slug, not id
  new SlugChannelQueryVarsBuilder(),
  ...FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders(),
]);

export const createVoucherQueryVariables = (
  value: FilterContainer,
): { filters: VoucherFilterInput; channel: string | undefined } => {
  const builder = new FiltersQueryBuilder<VoucherQueryVars, "channel">({
    apiType: QUERY_API_TYPES.VOUCHER,
    filterContainer: value,
    topLevelKeys: ["channel"],
    filterDefinitionResolver: voucherFilterDefinitionResolver,
  });
  const { filters, topLevel } = builder.build();

  return {
    filters,
    channel: topLevel.channel,
  };
};

export const createPageQueryVariables = (value: FilterContainer): PageFilterInput => {
  const builder = new FiltersQueryBuilder<PageFilterInput>({
    apiType: QUERY_API_TYPES.PAGE,
    filterContainer: value,
  });
  const { filters } = builder.build();

  return filters;
};

export const createDraftOrderQueryVariables = (value: FilterContainer): OrderDraftFilterInput => {
  const builder = new FiltersQueryBuilder<OrderDraftFilterInput>({
    apiType: QUERY_API_TYPES.DRAFT_ORDER,
    filterContainer: value,
  });
  const { filters } = builder.build();

  return filters;
};

export const createGiftCardQueryVariables = (value: FilterContainer): GiftCardFilterInput => {
  const builder = new FiltersQueryBuilder<GiftCardFilterInput>({
    apiType: QUERY_API_TYPES.GIFT_CARD,
    filterContainer: value,
  });
  const { filters } = builder.build();

  return filters;
};

export const createCustomerQueryVariables = (value: FilterContainer): CustomerFilterInput => {
  const builder = new FiltersQueryBuilder<CustomerFilterInput>({
    apiType: QUERY_API_TYPES.CUSTOMER,
    filterContainer: value,
  });
  const { filters } = builder.build();

  return filters;
};

export const createCollectionsQueryVariables = (
  value: FilterContainer,
): { filter: CollectionFilterInput; channel: string | undefined } => {
  const builder = new FiltersQueryBuilder<CollectionQueryVars, "channel">({
    apiType: QUERY_API_TYPES.COLLECTION,
    filterContainer: value,
    topLevelKeys: ["channel"],
  });
  const { topLevel, filters } = builder.build();

  return {
    channel: topLevel.channel,
    filter: filters,
  };
};

export const createProductTypesQueryVariables = (
  value: FilterContainer,
): ProductTypeFilterInput => {
  const builder = new FiltersQueryBuilder<ProductTypeFilterInput>({
    apiType: QUERY_API_TYPES.PRODUCT_TYPE,
    filterContainer: value,
  });
  const { filters } = builder.build();

  return filters;
};

export const createStaffMembersQueryVariables = (value: FilterContainer): StaffUserInput => {
  const builder = new FiltersQueryBuilder<StaffUserInput>({
    apiType: QUERY_API_TYPES.STAFF_MEMBER,
    filterContainer: value,
  });
  const { filters } = builder.build();

  return filters;
};

export const createAttributesQueryVariables = (value: FilterContainer): AttributeFilterInput => {
  const builder = new FiltersQueryBuilder<AttributeFilterInput>({
    apiType: QUERY_API_TYPES.ATTRIBUTE,
    filterContainer: value,
  });
  const { filters } = builder.build();

  return filters;
};
