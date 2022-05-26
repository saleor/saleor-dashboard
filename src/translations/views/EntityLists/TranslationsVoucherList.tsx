import { useVoucherTranslationsQuery } from "@saleor/graphql";
import usePaginator, { PaginatorContext } from "@saleor/hooks/usePaginator";
import TranslationsEntitiesList from "@saleor/translations/components/TranslationsEntitiesList";
import {
  languageEntityUrl,
  TranslatableEntities,
} from "@saleor/translations/urls";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsVoucherList: React.FC<TranslationsEntityListProps> = ({
  params,
  variables,
}) => {
  const { data, loading } = useVoucherTranslationsQuery({
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
            node.__typename === "VoucherTranslatableContent" && {
              completion: {
                current: sumCompleted([node.translation?.name]),
                max: 1,
              },
              id: node.voucher?.id,
              name: node.voucher?.name || "-",
            },
        )}
        getRowHref={id =>
          languageEntityUrl(
            variables.language,
            TranslatableEntities.vouchers,
            id,
          )
        }
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsVoucherList;
