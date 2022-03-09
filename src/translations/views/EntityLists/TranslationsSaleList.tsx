import { useSaleTranslationsQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import usePaginator from "@saleor/hooks/usePaginator";
import TranslationsEntitiesList from "@saleor/translations/components/TranslationsEntitiesList";
import {
  languageEntityUrl,
  TranslatableEntities
} from "@saleor/translations/urls";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsSaleList: React.FC<TranslationsEntityListProps> = ({
  params,
  variables
}) => {
  const navigate = useNavigator();
  const paginate = usePaginator();

  const { data, loading } = useSaleTranslationsQuery({
    displayLoader: true,
    variables
  });

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.translations?.pageInfo,
    variables,
    params
  );

  return (
    <TranslationsEntitiesList
      disabled={loading}
      entities={mapEdgesToItems(data?.translations)?.map(
        node =>
          node.__typename === "SaleTranslatableContent" && {
            completion: {
              current: sumCompleted([node.translation?.name]),
              max: 1
            },
            id: node.sale?.id,
            name: node.sale?.name
          }
      )}
      onRowClick={id =>
        navigate(
          languageEntityUrl(variables.language, TranslatableEntities.sales, id)
        )
      }
      onNextPage={loadNextPage}
      onPreviousPage={loadPreviousPage}
      pageInfo={pageInfo}
    />
  );
};

export default TranslationsSaleList;
