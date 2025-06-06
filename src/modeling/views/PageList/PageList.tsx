// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createPageQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { useFlag } from "@dashboard/featureFlags";
import {
  usePageBulkPublishMutation,
  usePageBulkRemoveMutation,
  usePageListQuery,
} from "@dashboard/graphql";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
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
import PageTypePickerDialog from "@dashboard/modeling/components/PageTypePickerDialog";
import usePageTypeSearch from "@dashboard/searches/usePageTypeSearch";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageListPage from "../../components/PageListPage/PageListPage";
import { pageCreateUrl, pageListUrl, PageListUrlDialog, PageListUrlQueryParams } from "../../urls";
import { getFilterOpts, getFilterQueryParam, storageUtils } from "./filters";
import { getFilterVariables, getSortQueryVariables } from "./sort";

interface PageListProps {
  params: PageListUrlQueryParams;
}

export const PageList: React.FC<PageListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.PAGES_LIST);
  const { enabled: isPageFiltersEnabled } = useFlag("new_filters");
  const { valueProvider } = useConditionalFilterContext();
  const filter = createPageQueryVariables(valueProvider.value);

  usePaginationReset(pageListUrl, params, settings.rowNumber);

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: pageListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });
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
    getUrl: pageListUrl,
    storageUtils,
  });
  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const newQueryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: {
        ...filter,
        search: params.query,
      },
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber, valueProvider.value],
  );
  const { data, refetch } = usePageListQuery({
    displayLoader: true,
    variables: isPageFiltersEnabled ? newQueryVariables : queryVariables,
  });
  const pages = mapEdgesToItems(data?.pages);
  const paginationValues = usePaginator({
    pageInfo: data?.pages?.pageInfo,
    paginationState,
    queryString: params,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    PageListUrlDialog,
    PageListUrlQueryParams
  >(navigate, pageListUrl, params);
  const [bulkPageRemove, bulkPageRemoveOpts] = usePageBulkRemoveMutation({
    onCompleted: data => {
      if (data.pageBulkDelete?.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "vwA9Fq",
            defaultMessage: "Selected models were deleted.",
            description: "notification",
          }),
        });
        clearRowSelection();
        refetch();
      }
    },
  });
  const [bulkPagePublish, bulkPagePublishOpts] = usePageBulkPublishMutation({
    onCompleted: data => {
      if (data.pageBulkPublish?.errors.length === 0) {
        closeModal();
        clearRowSelection();
        refetch();
      }
    },
  });

  const handlePublish = async (selectedRowIds: string[]) => {
    await bulkPagePublish({
      variables: {
        ids: selectedRowIds,
        isPublished: true,
      },
    });

    notify({
      status: "success",
      text: intl.formatMessage({
        id: "AUaL7R",
        defaultMessage: "Selected models were published.",
        description: "notification",
      }),
    });
  };

  const handleUnpublish = async (selectedRowIds: string[]) => {
    await bulkPagePublish({
      variables: {
        ids: selectedRowIds,
        isPublished: false,
      },
    });

    notify({
      status: "success",
      text: intl.formatMessage({
        id: "bnMF4j",
        defaultMessage: "Selected models were unpublished.",
        description: "notification",
      }),
    });
  };

  const handleSort = createSortHandler(navigate, pageListUrl, params);
  const {
    loadMore: loadMoreDialogPageTypes,
    search: searchDialogPageTypes,
    result: searchDialogPageTypesOpts,
  } = usePageTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const fetchMoreDialogPageTypes = {
    hasMore: searchDialogPageTypesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchDialogPageTypesOpts.loading,
    onFetchMore: loadMoreDialogPageTypes,
  };
  const filterOpts = getFilterOpts({
    params,
    pageTypes: mapEdgesToItems(searchDialogPageTypesOpts?.data?.search),
    pageTypesProps: {
      ...getSearchFetchMoreProps(searchDialogPageTypesOpts, loadMoreDialogPageTypes),
      onSearchChange: searchDialogPageTypes,
    },
  });
  const handleSetSelectedPageIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!pages) {
        return;
      }

      const rowsIds = rows.map(row => pages[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [pages, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <PageListPage
        disabled={!data}
        loading={!data}
        settings={settings}
        pages={pages}
        onUpdateListSettings={updateListSettings}
        onPageCreate={() => openModal("create-page")}
        onSort={handleSort}
        sort={getSortParams(params)}
        selectedPageIds={selectedRowIds}
        onPagesDelete={() => openModal("remove", { ids: selectedRowIds })}
        onPagesPublish={() => openModal("publish", { ids: selectedRowIds })}
        onPagesUnpublish={() => openModal("unpublish", { ids: selectedRowIds })}
        onSelectPageIds={handleSetSelectedPageIds}
        filterOpts={filterOpts}
        onFilterChange={changeFilters}
        initialSearch={params?.query ?? ""}
        onSearchChange={handleSearchChange}
        onFilterPresetChange={onPresetChange}
        onFilterPresetDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onFilterPresetUpdate={onPresetUpdate}
        onFilterPresetPresetSave={() => openModal("save-search")}
        selectedFilterPreset={selectedPreset}
        filterPresets={presets.map(preset => preset.name)}
        hasPresetsChanged={hasPresetsChanged}
        onFilterPresetsAll={resetFilters}
      />
      <ActionDialog
        open={params.action === "publish"}
        onClose={closeModal}
        confirmButtonState={bulkPagePublishOpts.status}
        onConfirm={() => handlePublish(selectedRowIds)}
        title={intl.formatMessage({
          id: "q/FMPM",
          defaultMessage: "Publish models",
          description: "dialog header",
        })}
      >
        <FormattedMessage
          id="8y4+0a"
          defaultMessage="{counter,plural,one{Are you sure you want to publish this model?} other{Are you sure you want to publish {displayQuantity} models?}}"
          description="dialog content"
          values={{
            counter: selectedRowIds.length,
            displayQuantity: <strong>{selectedRowIds.length}</strong>,
          }}
        />
      </ActionDialog>
      <ActionDialog
        open={params.action === "unpublish"}
        onClose={closeModal}
        confirmButtonState={bulkPagePublishOpts.status}
        onConfirm={() => handleUnpublish(selectedRowIds)}
        title={intl.formatMessage({
          id: "kG44rx",
          defaultMessage: "Unpublish models",
          description: "dialog header",
        })}
      >
        <FormattedMessage
          id="8LWaFr"
          defaultMessage="{counter,plural,one{Are you sure you want to unpublish this model?} other{Are you sure you want to unpublish {displayQuantity} models?}}"
          description="dialog content"
          values={{
            counter: selectedRowIds.length,
            displayQuantity: <strong>{selectedRowIds.length}</strong>,
          }}
        />
      </ActionDialog>
      <ActionDialog
        open={params.action === "remove"}
        onClose={closeModal}
        confirmButtonState={bulkPageRemoveOpts.status}
        onConfirm={() =>
          bulkPageRemove({
            variables: {
              ids: selectedRowIds,
            },
          })
        }
        variant="delete"
        title={intl.formatMessage({
          id: "AgHhjW",
          defaultMessage: "Delete models",
          description: "dialog header",
        })}
      >
        <FormattedMessage
          id="8a4uf/"
          defaultMessage="{counter,plural,one{Are you sure you want to delete this model?} other{Are you sure you want to delete {displayQuantity} models?}}"
          description="dialog content"
          values={{
            counter: selectedRowIds.length,
            displayQuantity: <strong>{selectedRowIds.length}</strong>,
          }}
        />
      </ActionDialog>
      <PageTypePickerDialog
        confirmButtonState="success"
        open={params.action === "create-page"}
        pageTypes={mapNodeToChoice(mapEdgesToItems(searchDialogPageTypesOpts?.data?.search))}
        fetchPageTypes={searchDialogPageTypes}
        fetchMorePageTypes={fetchMoreDialogPageTypes}
        onClose={closeModal}
        onConfirm={pageTypeId =>
          navigate(
            pageCreateUrl({
              "page-type-id": pageTypeId,
            }),
          )
        }
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

export default PageList;
