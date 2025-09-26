// @ts-strict-ignore
import { useSaleTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsSaleList = ({ params, variables }: TranslationsEntityListProps) => {
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
        getRowHref={id => languageEntityUrl(variables.language, TranslatableEntities.sales, id)}
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsSaleList;
