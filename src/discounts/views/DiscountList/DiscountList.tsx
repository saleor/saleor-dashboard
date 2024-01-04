import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { creatDiscountsQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import DiscountListPage from "@dashboard/discounts/components/DiscountListPage/DiscountListPage";
import { PromotionFragment, usePromotionsListQuery } from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { commonMessages } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import {
  discountListUrl,
  DiscountListUrlDialog,
  DiscountListUrlQueryParams,
} from "../../discountsUrls";
import { storageUtils } from "./filters";
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

  const { valueProvider } = useConditionalFilterContext();
  const where = creatDiscountsQueryVariables(valueProvider.value);

  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      sort: getSortQueryVariables(params),
      where: {
        ...where,
        ...(params?.query && {
          name: { eq: params.query },
        }),
      },
    }),
    [params, settings.rowNumber],
  );

  const { data, loading } = usePromotionsListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const promotions: PromotionFragment[] =
    mapEdgesToItems(data?.promotions) ?? [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, resetFilters, handleSearchChange] = createFilterHandlers({
    createUrl: discountListUrl,
    getFilterQueryParam: () => 0,
    navigate,
    params,
    keepActiveTab: true,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    DiscountListUrlDialog,
    DiscountListUrlQueryParams
  >(navigate, discountListUrl, params);

  const {
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    getPresetNameToDelete,
    selectedPreset,
    presets,
    setPresetIdToDelete,
  } = useFilterPresets({
    getUrl: discountListUrl,
    params,
    storageUtils,
  });

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
        onFilterPresetDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onFilterPresetPresetSave={() => openModal("save-search")}
        onFilterPresetChange={onPresetChange}
        onFilterPresetUpdate={onPresetUpdate}
        onFilterPresetsAll={resetFilters}
        filterPresets={presets.map(preset => preset.name)}
        selectedFilterPreset={selectedPreset}
        hasPresetsChanged={hasPresetsChanged}
        onUpdateListSettings={updateListSettings}
        sort={getSortParams(params)}
        onSearchChange={handleSearchChange}
        initialSearch={params.query || ""}
      />

      <SaveFilterTabDialog
        open={params.action === "save-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetDelete}
        tabName={getPresetNameToDelete()}
      />
    </PaginatorContext.Provider>
  );
};
export default DiscountList;
