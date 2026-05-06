// @ts-strict-ignore
import { type PageCountQueryVariables, usePageCountQuery } from "@dashboard/graphql";
import { pageListUrl } from "@dashboard/modeling/urls";
import {
  type PageTypeListUrlQueryParams,
  type PageTypeUrlQueryParams,
} from "@dashboard/modelTypes/urls";
import { useMemo } from "react";

import * as messages from "./messages";
import { type UseTypeDeleteData, type UseTypeDeleteProps } from "./types";

type UsePageTypeDeleteProps<T = PageTypeListUrlQueryParams | PageTypeUrlQueryParams> =
  UseTypeDeleteProps<T>;

function usePageTypeDelete({
  singleId,
  params,
  selectedTypes,
}: UsePageTypeDeleteProps): UseTypeDeleteData {
  const pageTypes = selectedTypes || [singleId];
  const isDeleteDialogOpen = params.action === "remove";
  const pagesAssignedToSelectedTypesQueryVars = useMemo<PageCountQueryVariables>(
    () => ({
      filter: {
        pageTypes,
      },
    }),
    [pageTypes],
  );
  const shouldSkipPageListQuery = !pageTypes.length || !isDeleteDialogOpen;
  const { data: pagesAssignedToSelectedTypesData, loading: loadingPagesAssignedToSelectedTypes } =
    usePageCountQuery({
      variables: pagesAssignedToSelectedTypesQueryVars,
      skip: shouldSkipPageListQuery,
    });
  // The Modeling list groups entries by Model Type tabs. When a single type is being deleted,
  // jump straight into its tab so the user sees only the assigned entries; for multi-delete we
  // fall back to the unfiltered "All" tab.
  const selectedPagesAssignedToDeleteUrl = pageListUrl(
    pageTypes.length === 1 ? { activeType: pageTypes[0] } : {},
  );
  const assignedItemsCount = pagesAssignedToSelectedTypesData?.pages?.totalCount;

  return {
    ...messages,
    isOpen: isDeleteDialogOpen,
    assignedItemsCount,
    viewAssignedItemsUrl: selectedPagesAssignedToDeleteUrl,
    isLoading: loadingPagesAssignedToSelectedTypes,
    typesToDelete: pageTypes,
  };
}

export default usePageTypeDelete;
