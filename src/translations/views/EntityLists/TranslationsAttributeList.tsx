import { useAttributeTranslationsQuery } from "@saleor/graphql";
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

const TranslationsAttributeList: React.FC<TranslationsEntityListProps> = ({
  params,
  variables
}) => {
  const navigate = useNavigator();
  const paginate = usePaginator();

  const { data, loading } = useAttributeTranslationsQuery({
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
          node.__typename === "AttributeTranslatableContent" && {
            completion: null,
            id: node?.attribute.id,
            name: node?.attribute.name
          }
      )}
      onRowClick={id =>
        navigate(
          languageEntityUrl(
            variables.language,
            TranslatableEntities.attributes,
            id
          )
        )
      }
      onNextPage={loadNextPage}
      onPreviousPage={loadPreviousPage}
      pageInfo={pageInfo}
    />
  );
};

export default TranslationsAttributeList;
