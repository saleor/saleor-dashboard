import { type FetchMoreProps } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { type ResultSearchData } from "./makeTopLevelSearch";
import { type CommonSearchOpts } from "./types";

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
