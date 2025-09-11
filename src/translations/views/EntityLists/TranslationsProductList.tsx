// @ts-strict-ignore
import { useProductTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

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
              completion: {
                current: sumCompleted([
                  node.translation?.description,
                  node.translation?.name,
                  node.translation?.seoDescription,
                  node.translation?.seoTitle,
                  ...(node.attributeValues?.map(({ translation }) => translation?.richText) || []),
                ]),
                max: 4 + (node.attributeValues?.length || 0),
              },
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
