import { FetchMoreProps } from "@saleor/types";

import { ResultSearchData } from "./makeTopLevelSearch";
import { CommonSearchOpts } from "./types";

export const getSearchFetchMoreProps = (
  { data, loading }: CommonSearchOpts,
  onFetchMore: any
): FetchMoreProps => ({
  hasMore: !!data?.search?.pageInfo?.hasNextPage,
  loading: !!loading,
  onFetchMore
});

export const getParsedSearchData = ({ data }: ResultSearchData) =>
  data?.search?.edges?.map(({ node }) => node) || [];
