// @ts-strict-ignore
import { useVoucherTranslationsQuery } from "@dashboard/graphql";
import usePaginator, { PaginatorContext } from "@dashboard/hooks/usePaginator";
import TranslationsEntitiesList from "@dashboard/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsVoucherList = ({ params, variables }: TranslationsEntityListProps) => {
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
        getRowHref={id => languageEntityUrl(variables.language, TranslatableEntities.vouchers, id)}
      />
    </PaginatorContext.Provider>
  );
};

export default TranslationsVoucherList;
