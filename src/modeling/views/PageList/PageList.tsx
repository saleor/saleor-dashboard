// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  usePageBulkPublishMutation,
  usePageBulkRemoveMutation,
  usePageListQuery,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { computeVisibleTypes } from "@dashboard/modeling/components/PageListPage/ModelTypeTabs/computeVisibleTypes";
import PageTypePickerDialog from "@dashboard/modeling/components/PageTypePickerDialog";
import { useActiveModelType } from "@dashboard/modeling/hooks/useActiveModelType";
import { useLastUsedModelType } from "@dashboard/modeling/hooks/useLastUsedModelType";
import { useModelTypeCountsFor } from "@dashboard/modeling/hooks/useModelTypeCountsFor";
import { useModelTypes } from "@dashboard/modeling/hooks/useModelTypes";
import { usePinnedModelTypes } from "@dashboard/modeling/hooks/usePinnedModelTypes";
import usePageTypeSearch from "@dashboard/searches/usePageTypeSearch";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TAB_VISIBLE_SLOTS = 6;

import { FormattedMessage, useIntl } from "react-intl";

import PageListPage from "../../components/PageListPage/PageListPage";
import {
  pageCreateUrl,
  pageListUrl,
  type PageListUrlDialog,
  type PageListUrlQueryParams,
} from "../../urls";
import { getSortQueryVariables } from "./sort";

interface PageListProps {
  params: PageListUrlQueryParams;
}

const PageList = ({ params }: PageListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.PAGES_LIST);

  usePaginationReset(pageListUrl, params, settings.rowNumber);

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);
  const {
    types: modelTypes,
    totalCount: modelTypesTotalCount,
    loading: modelTypesLoading,
  } = useModelTypes();
  const { activeType, setActive } = useActiveModelType({ params });
  const { lastUsedTypeId, rememberLastUsed } = useLastUsedModelType();
  const { pinnedTypeIds, togglePin } = usePinnedModelTypes();
  // Lazy counts: only fetch numbers for types the user can see right now.
  // Visible row = pinned ∪ alphabetical-fillers ∪ promoted-active. Once the
  // user opens the More dropdown we also fetch the overflow set; Apollo's
  // normalized cache means we never re-fetch ids we've already counted.
  const [includeOverflowCounts, setIncludeOverflowCounts] = useState(false);
  const { allVisibleTypes, overflowTypes } = useMemo(
    () =>
      computeVisibleTypes({
        types: modelTypes,
        pinnedTypeIds,
        activeTypeId: activeType,
        visibleSlots: TAB_VISIBLE_SLOTS,
      }),
    [modelTypes, pinnedTypeIds, activeType],
  );
  const countsRequestIds = useMemo(() => {
    const visible = allVisibleTypes.map(t => t.id);

    return includeOverflowCounts ? [...visible, ...overflowTypes.map(t => t.id)] : visible;
  }, [allVisibleTypes, overflowTypes, includeOverflowCounts]);
  const { counts: modelTypeCounts } = useModelTypeCountsFor(countsRequestIds);
  const handleOverflowOpen = useCallback(() => {
    // One-way switch: once the user explored the long tail we keep counting it
    // so subsequent opens are instant. Apollo cache prevents network re-fetches.
    setIncludeOverflowCounts(true);
  }, []);

  // Latest-callback ref so the bulk-selection-clearing effect below stays
  // pinned to `activeType` changes only. `clearRowSelection` is rebuilt on
  // every render of `useRowSelection`, so depending on it directly would
  // wipe the selection on every keystroke / pagination tick.
  const clearRowSelectionRef = useRef(clearRowSelection);

  useEffect(
    function trackLatestClearRowSelection() {
      clearRowSelectionRef.current = clearRowSelection;
    },
    [clearRowSelection],
  );
  useEffect(
    function clearBulkSelectionOnActiveTypeChange() {
      clearRowSelectionRef.current();
    },
    [activeType],
  );
  useEffect(
    function fallBackWhenActiveTypeWasDeleted() {
      if (modelTypesLoading || !activeType) {
        return;
      }

      if (!modelTypes.some(t => t.id === activeType)) {
        setActive(null);
      }
    },
    [activeType, modelTypes, modelTypesLoading, setActive],
  );

  const handleActiveTypeChange = useCallback(
    (typeId: string | null) => {
      setActive(typeId);
    },
    [setActive],
  );
  const handleSearchChange = useCallback(
    (query: string) => {
      clearRowSelection();

      const trimmed = query?.trim() ?? "";

      navigate(
        pageListUrl({
          ...params,
          after: undefined,
          before: undefined,
          query: trimmed !== "" ? trimmed : undefined,
        }),
      );
    },
    [clearRowSelection, navigate, params],
  );
  const paginationState = createPaginationState(settings.rowNumber, params);
  const newQueryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: {
        ...(activeType ? { pageTypes: [activeType] } : {}),
        search: params.query,
      },
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber, activeType],
  );
  const { data, refetch } = usePageListQuery({
    displayLoader: true,
    variables: newQueryVariables,
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
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "7JPV5U",
            defaultMessage: "Pages published",
          }),
        });
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
  // The Create-page dialog's type picker keeps using the standalone search hook;
  // it lets users pick a Model Type when starting a new entry.
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
  // Sort the picker options alphabetically (A→Z) so they match the Model Type tabs above.
  // The backend search query doesn't currently expose `sortBy`, so we sort client-side here.
  const sortedDialogPageTypeOptions = useMemo(
    () =>
      mapNodeToChoice(mapEdgesToItems(searchDialogPageTypesOpts?.data?.search) ?? []).sort((a, b) =>
        a.label.localeCompare(b.label),
      ),
    [searchDialogPageTypesOpts?.data?.search],
  );
  // Default selection in the "Create model" picker:
  //   1. The active tab's Model Type, if any (most contextual signal).
  //   2. Otherwise the user's most-recently-used type (if it still exists).
  //   3. Otherwise the alphabetically first type (deterministic; we no longer
  //      have all per-type counts available — see useModelTypeCountsFor).
  const defaultCreateTypeId = useMemo(() => {
    if (activeType) {
      return activeType;
    }

    if (lastUsedTypeId && modelTypes.some(t => t.id === lastUsedTypeId)) {
      return lastUsedTypeId;
    }

    if (modelTypes.length === 0) {
      return undefined;
    }

    const alphabetical = [...modelTypes].sort((a, b) => a.name.localeCompare(b.name));

    return alphabetical[0]?.id;
  }, [activeType, lastUsedTypeId, modelTypes]);
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
        modelTypes={modelTypes}
        modelTypeCounts={modelTypeCounts}
        modelTypesTotalCount={modelTypesTotalCount}
        modelTypesLoading={modelTypesLoading}
        activeModelType={activeType}
        pinnedModelTypeIds={pinnedTypeIds}
        onActiveModelTypeChange={handleActiveTypeChange}
        onTogglePinnedModelType={togglePin}
        onModelTypeOverflowOpen={handleOverflowOpen}
        onUpdateListSettings={updateListSettings}
        onPageCreate={() => openModal("create-page")}
        onSort={handleSort}
        sort={getSortParams(params)}
        selectedPageIds={selectedRowIds}
        onPagesDelete={() => openModal("remove", { ids: selectedRowIds })}
        onPagesPublish={() => openModal("publish", { ids: selectedRowIds })}
        onPagesUnpublish={() => openModal("unpublish", { ids: selectedRowIds })}
        onSelectPageIds={handleSetSelectedPageIds}
        initialSearch={params?.query ?? ""}
        onSearchChange={handleSearchChange}
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
        pageTypes={sortedDialogPageTypeOptions}
        defaultPageTypeId={defaultCreateTypeId}
        fetchPageTypes={searchDialogPageTypes}
        fetchMorePageTypes={fetchMoreDialogPageTypes}
        onClose={closeModal}
        onConfirm={pageTypeId => {
          rememberLastUsed(pageTypeId);
          navigate(
            pageCreateUrl({
              "page-type-id": pageTypeId,
            }),
          );
        }}
      />
    </PaginatorContext.Provider>
  );
};

export default PageList;
