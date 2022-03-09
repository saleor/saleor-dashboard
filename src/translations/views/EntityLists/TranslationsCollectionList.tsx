import { useCollectionTranslationsQuery } from "@saleor/graphql";
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

const TranslationsCollectionList: React.FC<TranslationsEntityListProps> = ({
  params,
  variables
}) => {
  const navigate = useNavigator();
  const paginate = usePaginator();

  const { data, loading } = useCollectionTranslationsQuery({
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
          node.__typename === "CollectionTranslatableContent" && {
            completion: {
              current: sumCompleted([
                node.translation?.description,
                node.translation?.name,
                node.translation?.seoDescription,
                node.translation?.seoTitle
              ]),
              max: 4
            },
            id: node.collection.id,
            name: node.collection.name
          }
      )}
      onRowClick={id =>
        navigate(
          languageEntityUrl(
            variables.language,
            TranslatableEntities.collections,
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

export default TranslationsCollectionList;
