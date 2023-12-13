import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
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
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import {
  saleListUrl,
  SaleListUrlDialog,
  SaleListUrlQueryParams,
} from "../../urls";
import { getFilterOpts, getFilterQueryParam, storageUtils } from "./filters";
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface DiscountListProps {
  params: SaleListUrlQueryParams;
}

export const DiscountList: React.FC<DiscountListProps> = ({ params }) => {
  const navigate = useNavigator();
  const { updateListSettings, settings } = useListSettings(
    ListViews.SALES_LIST,
  );

  usePaginationReset(saleListUrl, params, settings.rowNumber);

  const intl = useIntl();
  const { availableChannels } = useAppChannel(false);
  const selectedChannel = availableChannels.find(
    channel => channel.slug === params.channel,
  );
  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels, channel => channel.slug)
    : [];

  const [openModal, closeModal] = createDialogActionHandlers<
    SaleListUrlDialog,
    SaleListUrlQueryParams
  >(navigate, saleListUrl, params);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      sort: getSortQueryVariables(params),
      channel: params.channel,
    }),
    [params, settings.rowNumber],
  );
  const { data, loading } = usePromotionsListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const promotions: PromotionFragment[] =
    mapEdgesToItems(data?.promotions) ?? [];

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
    getUrl: saleListUrl,
    params,
    storageUtils,
  });

  const [changeFilters, resetFilters, handleSearchChange] =
    createFilterHandlers({
      createUrl: saleListUrl,
      getFilterQueryParam,
      navigate,
      params,
      keepActiveTab: true,
    });

  useEffect(() => {
    if (!canBeSorted(params?.sort, !!selectedChannel)) {
      navigate(
        saleListUrl({
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

  const handleSort = createSortHandler(navigate, saleListUrl, params);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <DiscountListPage
        currencySymbol={selectedChannel?.currencyCode}
        filterOpts={getFilterOpts(params, channelOpts)}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={filter => changeFilters(filter)}
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
        promotions={promotions}
        settings={settings}
        disabled={loading}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        sort={getSortParams(params)}
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
