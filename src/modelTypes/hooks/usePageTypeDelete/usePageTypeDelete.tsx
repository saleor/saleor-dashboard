// @ts-strict-ignore
import { PageCountQueryVariables, usePageCountQuery } from "@dashboard/graphql";
import { pageListUrl } from "@dashboard/modeling/urls";
import { PageTypeListUrlQueryParams, PageTypeUrlQueryParams } from "@dashboard/modelTypes/urls";
import { useMemo } from "react";

import * as messages from "./messages";
import { UseTypeDeleteData, UseTypeDeleteProps } from "./types";

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
  const selectedPagesAssignedToDeleteUrl = pageListUrl({
    pageTypes,
  });
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
