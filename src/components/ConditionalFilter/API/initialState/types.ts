import { type ApolloQueryResult } from "@apollo/client";
import {
  type _GetChannelOperandsQuery,
  type _SearchAttributeOperandsQuery,
  type _SearchCategoriesOperandsQuery,
  type _SearchCollectionsOperandsQuery,
  type _SearchCustomersOperandsQuery,
  type _SearchPageTypesOperandsQuery,
  type _SearchProductOperandsQuery,
  type _SearchProductTypesOperandsQuery,
  type _SearchWarehouseOperandsQuery,
  type ChannelCurrenciesQuery,
} from "@dashboard/graphql";

export type InitialProductAPIResponse = ApolloQueryResult<
  | _GetChannelOperandsQuery
  | _SearchCollectionsOperandsQuery
  | _SearchCategoriesOperandsQuery
  | _SearchProductTypesOperandsQuery
  | _SearchAttributeOperandsQuery
>;
export type InitialOrderAPIResponse = ApolloQueryResult<
  _GetChannelOperandsQuery | _SearchWarehouseOperandsQuery
>;

export type InitialVoucherAPIResponse = ApolloQueryResult<_GetChannelOperandsQuery>;

export type InitialPageAPIResponse = ApolloQueryResult<_SearchPageTypesOperandsQuery>;

export type InitialGiftCardsAPIResponse = ApolloQueryResult<
  _SearchProductOperandsQuery | _SearchCustomersOperandsQuery | ChannelCurrenciesQuery
>;

export type InitialCollectionAPIResponse = ApolloQueryResult<_GetChannelOperandsQuery>;

export type InitialAttributesAPIResponse = ApolloQueryResult<_GetChannelOperandsQuery>;
