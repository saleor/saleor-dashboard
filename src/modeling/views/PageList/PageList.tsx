// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  OrderDirection,
  PageTypeSortField,
  usePageBulkPublishMutation,
  usePageBulkRemoveMutation,
  usePageListQuery,
  usePageTypeListQuery,
} from "@dashboard/graphql";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import { useLastCreatedEntityTypeStorage } from "@dashboard/hooks/useLastCreatedEntityTypeStorage";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
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
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import {
  ALL_MODELS_TAB_ID,
  type ModelTypeTabCount,
} from "../../components/ModelTypeTabs/ModelTypeTabs";
import PageListPage from "../../components/PageListPage/PageListPage";
import {
  pageCreateUrl,
  pageListUrl,
  type PageListUrlDialog,
  type PageListUrlQueryParams,
} from "../../urls";
import { getSortQueryVariables } from "./sort";
import { usePageTypeTabCounts } from "./usePageTypeTabCounts";

interface PageListProps {
  params: PageListUrlQueryParams;
}

const normalizePageTypes = (value: string | string[] | undefined): string[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value.filter(Boolean) : [value];
};

const PageList = ({ params }: PageListProps) => {
  const navigate = useNavigator();
  const location = useLocation();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.PAGES_LIST);

  const selectedPageTypes = normalizePageTypes(params.pageTypes);
  const activeTabId = selectedPageTypes[0] ?? ALL_MODELS_TAB_ID;

  usePaginationReset(pageListUrl, params, settings.rowNumber);

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);

  const handleTabChange = useCallback(
    (id: string) => {
      clearRowSelection();
      navigate(
        pageListUrl({
          pageTypes: id === ALL_MODELS_TAB_ID ? undefined : [id],
          asc: params.asc,
          sort: params.sort,
        }),
      );
    },
    [clearRowSelection, navigate, params.asc, params.sort],
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
  const activeFilter = useMemo(
    () => ({
      pageTypes: activeTabId === ALL_MODELS_TAB_ID ? undefined : [activeTabId],
      search: params.query,
    }),
    [activeTabId, params.query],
  );

  const activeQueryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: activeFilter,
      sort: getSortQueryVariables(params),
    }),
    [paginationState, activeFilter, params.sort, params.asc],
  );

  const { data, refetch } = usePageListQuery({
    displayLoader: true,
    variables: activeQueryVariables,
  });
  const pages = mapEdgesToItems(data?.pages);

  const { data: pageTypesData, loading: pageTypesLoading } = usePageTypeListQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      first: 100,
      sort: { field: PageTypeSortField.NAME, direction: OrderDirection.ASC },
    },
  });
  const pageTypes = useMemo(
    () => mapEdgesToItems(pageTypesData?.pageTypes) ?? undefined,
    [pageTypesData],
  );

  // Fall back to "All" if URL references an unknown page type.
  useEffect(() => {
    if (
      activeTabId !== ALL_MODELS_TAB_ID &&
      pageTypes &&
      !pageTypesLoading &&
      !pageTypes.some(pt => pt.id === activeTabId)
    ) {
      navigate(
        pageListUrl({
          asc: params.asc,
          sort: params.sort,
        }),
        { replace: true },
      );
    }
  }, [activeTabId, pageTypes, pageTypesLoading, navigate, params.asc, params.sort]);

  const { counts, setCount, fetchers } = usePageTypeTabCounts({
    pageTypes,
    activeTabId,
    allTabId: ALL_MODELS_TAB_ID,
    pageSize: settings.rowNumber,
  });

  // Active tab badge comes from the active query, not a cache-first fetcher.
  const activeCount: ModelTypeTabCount | undefined = data?.pages
    ? {
        value: data.pages.edges.length,
        hasMore: !!data.pages.pageInfo.hasNextPage,
      }
    : undefined;

  useEffect(() => {
    if (activeCount) {
      setCount(activeTabId, activeCount);
    }
  }, [activeCount?.value, activeCount?.hasMore, activeTabId, setCount]);

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

  const handlePageCreate = useCallback(() => {
    if (activeTabId !== ALL_MODELS_TAB_ID) {
      navigate(pageCreateUrl({ "page-type-id": activeTabId }), {
        state: getPrevLocationState(location),
      });

      return;
    }

    openModal("create-page");
  }, [activeTabId, navigate, openModal, location]);

  const activePageType = useMemo(
    () => pageTypes?.find(pt => pt.id === activeTabId),
    [pageTypes, activeTabId],
  );

  const [lastCreatedModelTypeId] = useLastCreatedEntityTypeStorage("MODEL");
  const defaultPickerOption = useMemo(() => {
    if (!lastCreatedModelTypeId || !pageTypes) {
      return null;
    }

    const match = pageTypes.find(pt => pt.id === lastCreatedModelTypeId);

    return match ? { value: match.id, label: match.name } : null;
  }, [lastCreatedModelTypeId, pageTypes]);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      {fetchers}
      <PageListPage
        disabled={!data}
        loading={!data}
        settings={settings}
        pages={pages}
        onUpdateListSettings={updateListSettings}
        onPageCreate={handlePageCreate}
        activePageTypeName={activePageType?.name}
        onSort={handleSort}
        sort={getSortParams(params)}
        selectedPageIds={selectedRowIds}
        onPagesDelete={() => openModal("remove", { ids: selectedRowIds })}
        onPagesPublish={() => openModal("publish", { ids: selectedRowIds })}
        onPagesUnpublish={() => openModal("unpublish", { ids: selectedRowIds })}
        onSelectPageIds={handleSetSelectedPageIds}
        initialSearch={params?.query ?? ""}
        onSearchChange={handleSearchChange}
        pageTypes={pageTypes}
        activeTabId={activeTabId}
        tabCounts={counts}
        onTabChange={handleTabChange}
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
        defaultOption={defaultPickerOption}
        fetchPageTypes={searchDialogPageTypes}
        fetchMorePageTypes={fetchMoreDialogPageTypes}
        onClose={closeModal}
        onConfirm={pageTypeId =>
          navigate(
            pageCreateUrl({
              "page-type-id": pageTypeId,
            }),
            { state: getPrevLocationState(location) },
          )
        }
      />
    </PaginatorContext.Provider>
  );
};

export default PageList;
