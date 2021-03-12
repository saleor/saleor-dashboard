import { FetchMoreProps } from "@saleor/types";
import { CommonSearchOpts } from "./types";

export const getSearchFetchMoreProps = (
  { data, loading }: CommonSearchOpts,
  onFetchMore: any
): FetchMoreProps => ({
  hasMore: !!data?.search?.pageInfo?.hasNextPage,
  loading: !!loading,
  onFetchMore
});
