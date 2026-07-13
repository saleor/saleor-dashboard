// @ts-strict-ignore
import { type PageCountQueryVariables, usePageCountQuery } from "@dashboard/graphql";
import { pageListUrlWithPageTypes } from "@dashboard/modeling/urls";
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
  const pageTypes = useMemo(() => {
    if (selectedTypes?.length) {
      return selectedTypes.filter(Boolean);
    }

    return singleId ? [singleId] : [];
  }, [selectedTypes, singleId]);
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
  const { data: pagesAssignedToSelectedTypesData } = usePageCountQuery({
    variables: pagesAssignedToSelectedTypesQueryVars,
    skip: shouldSkipPageListQuery,
  });
  const viewAssignedItemsUrl = pageListUrlWithPageTypes(pageTypes);
  const assignedItemsCount = pagesAssignedToSelectedTypesData?.pages?.totalCount;

  return {
    ...messages,
    isOpen: isDeleteDialogOpen,
    assignedItemsCount: assignedItemsCount ?? undefined,
    viewAssignedItemsUrl,
    typesToDelete: pageTypes,
  };
}

export default usePageTypeDelete;
