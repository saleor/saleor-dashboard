// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useCollectionBulkDeleteMutation, useCollectionListQuery } from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { commonMessages } from "@dashboard/intl";
import { maybe } from "@dashboard/misc";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import React, { useCallback, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CollectionListPage from "../../components/CollectionListPage/CollectionListPage";
import {
  collectionListUrl,
  CollectionListUrlDialog,
  CollectionListUrlQueryParams,
} from "../../urls";
import { getFilterOpts, getFilterQueryParam, getFilterVariables, storageUtils } from "./filters";
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface CollectionListProps {
  params: CollectionListUrlQueryParams;
}

const CollectionList: React.FC<CollectionListProps> = ({ params }) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(ListViews.COLLECTION_LIST);

  usePaginationReset(collectionListUrl, params, settings.rowNumber);

  const { channel } = useAppChannel(false);
  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: collectionListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });
  const { availableChannels } = useAppChannel(false);
  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels, channel => channel.slug)
    : null;
  const selectedChannel = availableChannels.find(channel => channel.slug === params.channel);
  const {
    selectedPreset,
    presets,
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    setPresetIdToDelete,
    getPresetNameToDelete,
  } = useFilterPresets({
    params,
    reset: clearRowSelection,
    getUrl: collectionListUrl,
    storageUtils,
  });
  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
      channel: selectedChannel?.slug,
    }),
    [params, settings.rowNumber],
  );
  const { data, refetch } = useCollectionListQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const collections = mapEdgesToItems(data?.collections);
  const [collectionBulkDelete, collectionBulkDeleteOpts] = useCollectionBulkDeleteMutation({
    onCompleted: data => {
      if (data.collectionBulkDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        refetch();
        clearRowSelection();
        closeModal();
      }
    },
  });
  const filterOpts = getFilterOpts(params, channelOpts);

  useEffect(() => {
    if (!canBeSorted(params.sort, !!selectedChannel)) {
      navigate(
        collectionListUrl({
          ...params,
          sort: DEFAULT_SORT_KEY,
        }),
      );
    }
  }, [params]);

  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionListUrlDialog,
    CollectionListUrlQueryParams
  >(navigate, collectionListUrl, params);
  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.collections.pageInfo),
    paginationState,
    queryString: params,
  });
  const handleSort = createSortHandler(navigate, collectionListUrl, params);
  const handleSetSelectedCollectionIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!collections) {
        return;
      }

      const rowsIds = rows.map(row => collections[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [collections, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );
  const handleCollectionBulkDelete = useCallback(async () => {
    await collectionBulkDelete({
      variables: {
        ids: selectedRowIds,
      },
    });
    clearRowSelection();
  }, [selectedRowIds]);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <CollectionListPage
        currentTab={selectedPreset}
        currencySymbol={channel?.currencyCode}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onAll={resetFilters}
        onTabChange={onPresetChange}
        onTabDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onTabSave={() => openModal("save-search")}
        onTabUpdate={onPresetUpdate}
        tabs={presets.map(tab => tab.name)}
        loading={!data}
        disabled={!data}
        collections={collections}
        settings={settings}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        sort={getSortParams(params)}
        selectedChannelId={selectedChannel?.id}
        filterOpts={filterOpts}
        onFilterChange={changeFilters}
        selectedCollectionIds={selectedRowIds}
        onSelectCollectionIds={handleSetSelectedCollectionIds}
        hasPresetsChanged={hasPresetsChanged}
        onCollectionsDelete={() =>
          openModal("remove", {
            ids: selectedRowIds,
          })
        }
      />
      <ActionDialog
        open={params.action === "remove" && maybe(() => selectedRowIds.length > 0)}
        onClose={closeModal}
        confirmButtonState={collectionBulkDeleteOpts.status}
        onConfirm={handleCollectionBulkDelete}
        variant="delete"
        title={intl.formatMessage({
          id: "Ykw8k5",
          defaultMessage: "Delete collections",
          description: "dialog title",
        })}
      >
        <FormattedMessage
          id="yT5zvU"
          defaultMessage="{counter,plural,one{Are you sure you want to delete this collection?} other{Are you sure you want to delete {displayQuantity} collections?}}"
          values={{
            counter: maybe(() => selectedRowIds.length),
            displayQuantity: <strong>{maybe(() => selectedRowIds.length)}</strong>,
          }}
        />
      </ActionDialog>
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

export default CollectionList;
