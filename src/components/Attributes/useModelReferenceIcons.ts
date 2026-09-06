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

import { type AttributeInput } from "./Attributes";

/**
 * A reference attribute value only carries the referenced id and its name, so the icon configured
 * on the referenced model's type has to be fetched separately — the entity query cannot reach it.
 * Reuses the reference search query, which already selects `pageType.metadata`, narrowed to the
 * assigned ids. Returns an empty map for every other entity type.
 */
export const useModelReferenceIcons = (attribute: AttributeInput): Map<string, ModelTypeIcon> => {
  const ids =
    attribute.data.entityType === AttributeEntityTypeEnum.PAGE ? (attribute.value ?? []) : [];

  const { data } = useQuery<SearchPagesQuery, SearchPagesQueryVariables>(SearchPagesDocument, {
    variables: { first: ids.length, query: "", where: { ids } },
    skip: ids.length === 0,
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
