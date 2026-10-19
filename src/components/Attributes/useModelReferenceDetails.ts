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
const MODEL_DETAILS_PAGE_SIZE = 100;

export interface ModelReferenceDetails {
  icon: ModelTypeIcon;
  /** Models can share a name; merchants tell them apart by slug. */
  slug: string;
}

interface UseModelReferenceDetailsArgs {
  entityType: AttributeEntityTypeEnum | null | undefined;
  ids: string[] | null | undefined;
}

/**
 * A reference attribute value only carries the referenced id and its name, so the slug and the
 * icon configured on the referenced model's type have to be fetched separately — the entity query
 * cannot reach them. Reuses the reference search query, which already selects both, narrowed to
 * the assigned ids. Returns an empty map for every other entity type.
 *
 * Call it where the details are drawn, not on the row: a collapsed reference group does not mount
 * its list, so the request waits until the list is opened.
 */
export const useModelReferenceDetails = ({
  entityType,
  ids,
}: UseModelReferenceDetailsArgs): Map<string, ModelReferenceDetails> => {
  const requestedIds =
    entityType === AttributeEntityTypeEnum.PAGE
      ? stabilizeReferenceIds(ids ?? [], MODEL_DETAILS_PAGE_SIZE)
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
          { icon: getModelTypeIcon(page.pageType?.metadata), slug: page.slug },
        ]) ?? [],
      ),
    [data],
  );
};
