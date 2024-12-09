import { useShippingMethodTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";

import { TranslationsEntityListProps } from "./types";
import { mapTranslationsToEntities } from "./utils";

const TranslationsShippingMethodList = ({ params, variables }: TranslationsEntityListProps) => {
  const { data, loading } = useShippingMethodTranslationsQuery({
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
        entities={mapTranslationsToEntities(data)}
        getRowHref={id =>
          languageEntityUrl(variables.language, TranslatableEntities.shippingMethods, id)
        }
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsShippingMethodList;
