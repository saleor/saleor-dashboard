import {
  AttributeFilterInput,
  CollectionFilterInput,
  CustomerFilterInput,
  DateRangeInput,
  DateTimeRangeInput,
  GiftCardFilterInput,
  OrderDraftFilterInput,
  OrderFilterInput,
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
import { SlugChannelQueryVarsBuilder } from "./FiltersQueryBuilder/queryVarsBuilders";

type ProductQueryVars = ProductWhereInput & { channel?: { eq: string } };
type VoucherQueryVars = VoucherFilterInput & { channel?: string };
type CollectionQueryVars = CollectionFilterInput & { channel?: string };
export type OrderQueryVars = ProductQueryVars & { created?: DateTimeRangeInput | DateRangeInput };

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

export const createOrderQueryVariables = (value: FilterContainer): OrderFilterInput => {
  const { filters } = new FiltersQueryBuilder<OrderFilterInput>({
    apiType: QueryApiType.FILTER,
    filterContainer: value,
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
