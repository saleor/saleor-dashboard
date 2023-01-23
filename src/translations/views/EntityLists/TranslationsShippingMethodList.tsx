import { useShippingMethodTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import {
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsShippingMethodList: React.FC<TranslationsEntityListProps> = ({
  params,
  variables,
}) => {
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
        entities={mapEdgesToItems(data?.translations)?.map(
          node =>
            node.__typename === "ShippingMethodTranslatableContent" && {
              completion: {
                current: sumCompleted([
                  node.translation?.name,
                  node.translation?.description,
                ]),
                max: 2,
              },
              id: node?.shippingMethod.id,
              name: node?.name,
            },
        )}
        getRowHref={id =>
          languageEntityUrl(
            variables.language,
            TranslatableEntities.shippingMethods,
            id,
          )
        }
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsShippingMethodList;
