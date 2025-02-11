import { ApolloQueryResult } from "@apollo/client";
import {
  _GetChannelOperandsQuery,
  _SearchAttributeOperandsQuery,
  _SearchCategoriesOperandsQuery,
  _SearchCollectionsOperandsQuery,
  _SearchPageTypesOperandsQuery,
  _SearchProductTypesOperandsQuery,
} from "@dashboard/graphql";

export type InitialAPIResponse = ApolloQueryResult<
  | _GetChannelOperandsQuery
  | _SearchCollectionsOperandsQuery
  | _SearchCategoriesOperandsQuery
  | _SearchProductTypesOperandsQuery
  | _SearchAttributeOperandsQuery
>;
export type InitialOrderAPIResponse = ApolloQueryResult<_GetChannelOperandsQuery>;

export type InitialVoucherAPIResponse = ApolloQueryResult<_GetChannelOperandsQuery>;

export type InitialPageAPIResponse = ApolloQueryResult<_SearchPageTypesOperandsQuery>;
