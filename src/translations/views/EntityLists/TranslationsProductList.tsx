// @ts-strict-ignore
import { useProductTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { type TranslationsEntityListProps } from "./types";
import { getProductTranslationCompletion } from "./utils";

const TranslationsProductList = ({ params, variables }: TranslationsEntityListProps) => {
  const { data, loading } = useProductTranslationsQuery({
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
        data-test-id="translation-list-view"
        disabled={loading}
        entities={mapEdgesToItems(data?.translations)?.map(
          node =>
            node.__typename === "ProductTranslatableContent" && {
              completion: getProductTranslationCompletion(node),
              id: node?.product?.id,
              name: node?.product?.name,
            },
        )}
        getRowHref={id => languageEntityUrl(variables.language, TranslatableEntities.products, id)}
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsProductList;
