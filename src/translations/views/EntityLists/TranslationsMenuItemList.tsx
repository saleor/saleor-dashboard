// @ts-strict-ignore
import { useMenuItemTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsMenuItemList = ({ params, variables }: TranslationsEntityListProps) => {
  const { data, loading } = useMenuItemTranslationsQuery({
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
            node.__typename === "MenuItemTranslatableContent" && {
              completion: {
                current: sumCompleted([node.translation?.name]),
                max: 1,
              },
              id: node?.menuItem.id,
              name: node?.menuItem.name,
            },
        )}
        getRowHref={id => languageEntityUrl(variables.language, TranslatableEntities.menuItems, id)}
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsMenuItemList;
