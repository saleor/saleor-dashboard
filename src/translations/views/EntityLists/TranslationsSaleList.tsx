import { useSaleTranslationsQuery } from "@saleor/graphql";
import usePaginator, { PaginatorContext } from "@saleor/hooks/usePaginator";
import TranslationsEntitiesList from "@saleor/translations/components/TranslationsEntitiesList";
import {
  languageEntityUrl,
  TranslatableEntities,
} from "@saleor/translations/urls";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsSaleList: React.FC<TranslationsEntityListProps> = ({
  params,
  variables,
}) => {
  const { data, loading } = useSaleTranslationsQuery({
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
            node.__typename === "SaleTranslatableContent" && {
              completion: {
                current: sumCompleted([node.translation?.name]),
                max: 1,
              },
              id: node.sale?.id,
              name: node.sale?.name,
            },
        )}
        getRowHref={id =>
          languageEntityUrl(variables.language, TranslatableEntities.sales, id)
        }
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsSaleList;
