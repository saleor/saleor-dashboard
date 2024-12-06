// @ts-strict-ignore
import { useAttributeTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";

const TranslationsAttributeList = ({ params, variables }: TranslationsEntityListProps) => {
  const { data, loading } = useAttributeTranslationsQuery({
    displayLoader: true,
    variables,
  });
  const paginationValues = usePaginator({
    pageInfo: data?.translations?.pageInfo,
    paginationState: variables,
    queryString: params,
  });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <TranslationsEntitiesList
        disabled={loading}
        entities={mapEdgesToItems(data?.translations)?.map(
          node =>
            node.__typename === "AttributeTranslatableContent" && {
              completion: null,
              id: node?.attribute.id,
              name: node?.attribute.name,
            },
        )}
        getRowHref={id =>
          languageEntityUrl(variables.language, TranslatableEntities.attributes, id)
        }
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsAttributeList;
