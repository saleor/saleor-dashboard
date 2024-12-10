// @ts-strict-ignore
import { useCategoryTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsCategoryList = ({ params, variables }: TranslationsEntityListProps) => {
  const { data, loading } = useCategoryTranslationsQuery({
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
            node.__typename === "CategoryTranslatableContent" && {
              completion: {
                current: sumCompleted([
                  node.translation?.description,
                  node.translation?.name,
                  node.translation?.seoDescription,
                  node.translation?.seoTitle,
                ]),
                max: 4,
              },
              id: node?.category?.id,
              name: node?.category?.name,
            },
        )}
        getRowHref={id =>
          languageEntityUrl(variables.language, TranslatableEntities.categories, id)
        }
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsCategoryList;
