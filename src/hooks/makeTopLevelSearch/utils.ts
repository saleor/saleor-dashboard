import { FetchMoreProps } from "@saleor/types";
import { mapEdgesToItems } from "@saleor/utils/maps";

import { ResultSearchData } from "./makeTopLevelSearch";
import { CommonSearchOpts } from "./types";

export const getSearchFetchMoreProps = (
  { data, loading }: CommonSearchOpts,
  onFetchMore: any,
): FetchMoreProps => ({
  hasMore: !!data?.search?.pageInfo?.hasNextPage,
  totalCount: data?.search?.totalCount,
  loading: !!loading,
  onFetchMore,
});

export const getParsedSearchData = ({ data }: ResultSearchData) =>
  mapEdgesToItems(data?.search) || [];
