import { useQuery } from "@apollo/client";
import { type ModelTypeIcon } from "@dashboard/components/ModelTypeIcon/constants";
import { getModelTypeIcon } from "@dashboard/components/ModelTypeIcon/getModelTypeIcon";
import {
  AttributeEntityTypeEnum,
  SearchPagesDocument,
  type SearchPagesQuery,
  type SearchPagesQueryVariables,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo } from "react";

import { stabilizeReferenceIds } from "./stabilizeReferenceIds";

/** The API returns at most 100 nodes per page. */
const MODEL_ICONS_PAGE_SIZE = 100;

interface UseModelReferenceIconsArgs {
  entityType: AttributeEntityTypeEnum | null | undefined;
  ids: string[] | null | undefined;
}

/**
 * A reference attribute value only carries the referenced id and its name, so the icon configured
 * on the referenced model's type has to be fetched separately — the entity query cannot reach it.
 * Reuses the reference search query, which already selects `pageType.metadata`, narrowed to the
 * assigned ids. Returns an empty map for every other entity type.
 *
 * Call it where the icons are drawn, not on the row: a collapsed reference group does not mount
 * its list, so the request waits until the list is opened.
 */
export const useModelReferenceIcons = ({
  entityType,
  ids,
}: UseModelReferenceIconsArgs): Map<string, ModelTypeIcon> => {
  const requestedIds =
    entityType === AttributeEntityTypeEnum.PAGE
      ? stabilizeReferenceIds(ids ?? [], MODEL_ICONS_PAGE_SIZE)
      : [];

  const { data } = useQuery<SearchPagesQuery, SearchPagesQueryVariables>(SearchPagesDocument, {
    variables: { first: requestedIds.length, query: "", where: { ids: requestedIds } },
    skip: requestedIds.length === 0,
  });

  return useMemo(
    () =>
      new Map(
        mapEdgesToItems(data?.search)?.map(page => [
          page.id,
          getModelTypeIcon(page.pageType?.metadata),
        ]) ?? [],
      ),
    [data],
  );
};
