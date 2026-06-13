// @ts-strict-ignore
import { usePageTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { type TranslationsEntityListProps } from "./types";
import { getPageTranslationCompletion } from "./utils";

const TranslationsPageList = ({ params, variables }: TranslationsEntityListProps) => {
  const { data, loading } = usePageTranslationsQuery({
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
            node.__typename === "PageTranslatableContent" && {
              completion: getPageTranslationCompletion(node.translation),
              id: node?.page.id,
              name: node?.page.title,
            },
        )}
        getRowHref={id => languageEntityUrl(variables.language, TranslatableEntities.pages, id)}
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsPageList;
