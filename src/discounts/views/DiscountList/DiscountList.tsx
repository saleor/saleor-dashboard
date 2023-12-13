import { WindowTitle } from "@dashboard/components/WindowTitle";
import DiscountListPage from "@dashboard/discounts/components/DiscountListPage/DiscountListPage";
import { PromotionFragment, usePromotionsListQuery } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { commonMessages } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import {
  discountListUrl,
  DiscountListUrlQueryParams,
} from "../../discountsUrls";
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface DiscountListProps {
  params: DiscountListUrlQueryParams;
}

export const DiscountList: React.FC<DiscountListProps> = ({ params }) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const { updateListSettings, settings } = useListSettings(
    ListViews.DISCOUNTS_LIST,
  );

  usePaginationReset(discountListUrl, params, settings.rowNumber);
  const paginationState = createPaginationState(settings.rowNumber, params);

  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );

  const { data, loading } = usePromotionsListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const promotions: PromotionFragment[] =
    mapEdgesToItems(data?.promotions) ?? [];

  useEffect(() => {
    if (!canBeSorted(params?.sort)) {
      navigate(
        discountListUrl({
          ...params,
          sort: DEFAULT_SORT_KEY,
        }),
      );
    }
  }, [params]);

  const paginationValues = usePaginator({
    pageInfo: data?.promotions?.pageInfo,
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, discountListUrl, params);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountListPage
        promotions={promotions}
        settings={settings}
        disabled={loading}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        sort={getSortParams(params)}
      />
    </PaginatorContext.Provider>
  );
};
export default DiscountList;
