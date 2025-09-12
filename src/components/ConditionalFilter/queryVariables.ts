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
export type OrderQueryVars = OrderWhereInput;

export const createProductQueryVariables = (filterContainer: FilterContainer): ProductQueryVars => {
  const { topLevel, filters } = new FiltersQueryBuilder<ProductQueryVars, "channel">({
    apiType: QueryApiType.WHERE,
    filterContainer,
    topLevelKeys: ["channel"],
  }).build();

  return { ...filters, ...topLevel };
};

export const createDiscountsQueryVariables = (value: FilterContainer): PromotionWhereInput => {
  const { filters } = new FiltersQueryBuilder<PromotionWhereInput>({
    apiType: QueryApiType.WHERE,
    filterContainer: value,
  }).build();

  return filters;
};

// TODO: We should probably map fields based on query + field name, not using simple `canHandle` strategy
// E.g. Orders query uses DateTimeRangeInput for createdAt, updatedAt, but Product query uses DateTimeFilterInput for updatedAt
// Fields have the same name for both queries, but different input types
export const createOrderQueryVariables = (value: FilterContainer): OrderWhereInput => {
  const { filters } = new FiltersQueryBuilder<OrderWhereInput>({
    apiType: QueryApiType.WHERE,
    filterContainer: value,
    useAndWrapper: true, // Wrap all root-level fields into `AND` to avoid mixing operators
    filterDefinitionResolver: new FilterQueryVarsBuilderResolver([
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
    ]),
  }).build();

  return filters;
};

export const createVoucherQueryVariables = (
  value: FilterContainer,
): { filters: VoucherFilterInput; channel: string | undefined } => {
  const { filters, topLevel } = new FiltersQueryBuilder<VoucherQueryVars, "channel">({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
    topLevelKeys: ["channel"],
    filterDefinitionResolver: new FilterQueryVarsBuilderResolver([
      // VoucherPage expects channel to be a slug, not id
      new SlugChannelQueryVarsBuilder(),
      ...FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders(),
    ]),
  }).build();

  return {
    filters,
    channel: topLevel.channel,
  };
};

export const createPageQueryVariables = (value: FilterContainer): PageFilterInput => {
  const { filters } = new FiltersQueryBuilder<PageFilterInput>({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
  }).build();

  return filters;
};

export const createDraftOrderQueryVariables = (value: FilterContainer): OrderDraftFilterInput => {
  const { filters } = new FiltersQueryBuilder<OrderDraftFilterInput>({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
  }).build();

  return filters;
};

export const createGiftCardQueryVariables = (value: FilterContainer): GiftCardFilterInput => {
  const { filters } = new FiltersQueryBuilder<GiftCardFilterInput>({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
  }).build();

  return filters;
};

export const createCustomerQueryVariables = (value: FilterContainer): CustomerFilterInput => {
  const { filters } = new FiltersQueryBuilder<CustomerFilterInput>({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
  }).build();

  return filters;
};

export const createCollectionsQueryVariables = (
  value: FilterContainer,
): { filter: CollectionFilterInput; channel: string | undefined } => {
  const { topLevel, filters } = new FiltersQueryBuilder<CollectionQueryVars, "channel">({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
    topLevelKeys: ["channel"],
  }).build();

  return {
    channel: topLevel.channel,
    filter: filters,
  };
};

export const createProductTypesQueryVariables = (
  value: FilterContainer,
): ProductTypeFilterInput => {
  const { filters } = new FiltersQueryBuilder<ProductTypeFilterInput>({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
  }).build();

  return filters;
};

export const createStaffMembersQueryVariables = (value: FilterContainer): StaffUserInput => {
  const { filters } = new FiltersQueryBuilder<StaffUserInput>({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
  }).build();

  return filters;
};

export const createAttributesQueryVariables = (value: FilterContainer): AttributeFilterInput => {
  const { filters } = new FiltersQueryBuilder<AttributeFilterInput>({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
  }).build();

  return filters;
};
