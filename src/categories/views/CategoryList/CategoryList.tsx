import { useApolloClient } from "@apollo/client";
import ActionDialog from "@dashboard/components/ActionDialog";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import {
  CategoryBulkDeleteMutation,
  CategoryChildrenDocument,
  CategoryChildrenQuery,
  CategoryChildrenQueryVariables,
  CategoryFragment,
  useCategoryBulkDeleteMutation,
  useRootCategoriesQuery,
} from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { Box } from "@saleor/macaw-ui-next";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { CategoryListPage } from "../../components/CategoryListPage/CategoryListPage";
import {
  categoryListUrl,
  CategoryListUrlDialog,
  CategoryListUrlFilters,
  CategoryListUrlQueryParams,
} from "../../urls";
import { getActiveFilters, getFilterVariables, storageUtils } from "./filter";
import { getSortQueryVariables } from "./sort";

interface CategoryListProps {
  params: CategoryListUrlQueryParams;
}

const DEFAULT_SUBCATEGORIES_PAGE_SIZE = 50;
const MIN_SUBCATEGORIES_PAGE_SIZE = 1;
const MAX_SUBCATEGORIES_PAGE_SIZE = 200;

const collectDescendantIds = (
  parentId: string,
  getChildren: (parentId: string) => CategoryFragment[],
): string[] => {
  const children = getChildren(parentId);

  return children.flatMap(child => [child.id, ...collectDescendantIds(child.id, getChildren)]);
};

interface CategoryListRow {
  category: CategoryFragment;
  depth: number;
  parentId: string | null;
}

const CategoryList = ({ params }: CategoryListProps): JSX.Element => {
  const client = useApolloClient();
  const location = useLocation();
  const navigate = useNavigator();
  const intl = useIntl();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(ListViews.CATEGORY_LIST);
  const handleSort = createSortHandler(navigate, categoryListUrl, params);
  const {
    selectedRowIds,
    setSelectedRowIds,
    clearRowSelection,
    setClearDatagridRowSelectionCallback,
    excludeFromSelected,
  } = useRowSelection(params);
  const {
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    getPresetNameToDelete,
    presets,
    selectedPreset,
    setPresetIdToDelete,
  } = useFilterPresets({
    params,
    storageUtils,
    getUrl: categoryListUrl,
    reset: clearRowSelection,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    CategoryListUrlDialog,
    CategoryListUrlQueryParams
  >(navigate, categoryListUrl, params);

  usePaginationReset(categoryListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [paginationState, params],
  );
  const { data, refetch } = useRootCategoriesQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const categories = mapEdgesToItems(data?.categories);
  const paginationValues = usePaginator({
    pageInfo: data?.categories?.pageInfo,
    paginationState,
    queryString: params,
  });
  const changeFilterField = (filter: CategoryListUrlFilters): void => {
    clearRowSelection();
    navigate(
      categoryListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: !filter.query?.length ? undefined : params.activeTab,
      }),
    );
  };
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [loadingChildrenIds, setLoadingChildrenIds] = useState<Set<string>>(() => new Set());
  const [loadedChildrenIds, setLoadedChildrenIds] = useState<Set<string>>(() => new Set());
  const [subcategoryPageSize, setSubcategoryPageSize] = useState(DEFAULT_SUBCATEGORIES_PAGE_SIZE);
  const deletingCategoryIdsRef = useRef<string[]>([]);

  const invalidateCache = useCallback(() => {
    setLoadedChildrenIds(new Set());
    setExpandedIds(new Set());
    setLoadingChildrenIds(new Set());
    clearRowSelection();
  }, [clearRowSelection]);

  useEffect(() => {
    invalidateCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleSubcategoryPageSizeChange = useCallback(
    (nextPageSize: number) => {
      const normalizedPageSize = Math.min(
        MAX_SUBCATEGORIES_PAGE_SIZE,
        Math.max(MIN_SUBCATEGORIES_PAGE_SIZE, nextPageSize),
      );

      if (normalizedPageSize === subcategoryPageSize) {
        return;
      }

      setSubcategoryPageSize(normalizedPageSize);
      setLoadedChildrenIds(new Set());
      setExpandedIds(new Set());
      setLoadingChildrenIds(new Set());
      clearRowSelection();
    },
    [clearRowSelection, subcategoryPageSize],
  );

  const getCachedChildrenByParentId = useCallback(
    (parentId: string): CategoryFragment[] => {
      try {
        const cached = client.readQuery<CategoryChildrenQuery, CategoryChildrenQueryVariables>({
          query: CategoryChildrenDocument,
          variables: {
            id: parentId,
            first: subcategoryPageSize,
            after: null,
          },
        });

        return mapEdgesToItems(cached?.category?.children) ?? [];
      } catch {
        return [];
      }
    },
    [client, subcategoryPageSize],
  );

  const setCategoryChildrenLoading = useCallback((categoryId: string, loading: boolean) => {
    setLoadingChildrenIds(prev => {
      const next = new Set(prev);

      if (loading) {
        next.add(categoryId);
      } else {
        next.delete(categoryId);
      }

      return next;
    });
  }, []);

  const isCategoryChildrenLoading = useCallback(
    (categoryId: string) => loadingChildrenIds.has(categoryId),
    [loadingChildrenIds],
  );
  const getSelectedWithLoadedDescendants = useCallback(
    (ids: string[]) => {
      const selectedWithDescendants = new Set(ids);

      ids.forEach(id => {
        collectDescendantIds(id, getCachedChildrenByParentId).forEach(descendantId => {
          selectedWithDescendants.add(descendantId);
        });
      });

      return Array.from(selectedWithDescendants);
    },
    [getCachedChildrenByParentId],
  );
  const removeDescendantsFromDeselectedParents = useCallback(
    (ids: string[]) => {
      const incomingIds = new Set(ids);
      const descendantsToRemove = new Set(
        selectedRowIds
          .filter(selectedId => !incomingIds.has(selectedId))
          .flatMap(selectedId => collectDescendantIds(selectedId, getCachedChildrenByParentId)),
      );

      return ids.filter(id => !descendantsToRemove.has(id));
    },
    [getCachedChildrenByParentId, selectedRowIds],
  );

  const toggleExpanded = useCallback(
    async (categoryId: string) => {
      const isExpanded = expandedIds.has(categoryId);

      if (isExpanded) {
        const hiddenIds = new Set(collectDescendantIds(categoryId, getCachedChildrenByParentId));
        const hasHiddenSelectedRows = selectedRowIds.some(id => hiddenIds.has(id));

        if (hasHiddenSelectedRows) {
          excludeFromSelected([...hiddenIds, categoryId]);
          // clearRowSelection();
        }

        setExpandedIds(prev => {
          const next = new Set(prev);

          next.delete(categoryId);

          return next;
        });

        return;
      }

      if (!loadedChildrenIds.has(categoryId) && !loadingChildrenIds.has(categoryId)) {
        setCategoryChildrenLoading(categoryId, true);

        let hasCachedData = false;

        try {
          try {
            const cachedData = client.readQuery<
              CategoryChildrenQuery,
              CategoryChildrenQueryVariables
            >({
              query: CategoryChildrenDocument,
              variables: {
                id: categoryId,
                first: subcategoryPageSize,
                after: null,
              },
            });

            if (cachedData?.category?.children) {
              setLoadedChildrenIds(prev => {
                const next = new Set(prev);

                next.add(categoryId);

                return next;
              });
              hasCachedData = true;
            }
          } catch (e) {
            console.warn("Cache miss", e);
          }

          try {
            await client.query<CategoryChildrenQuery, CategoryChildrenQueryVariables>({
              query: CategoryChildrenDocument,
              variables: {
                id: categoryId,
                first: subcategoryPageSize,
                after: null,
              },
              fetchPolicy: "network-only",
            });

            setLoadedChildrenIds(prev => {
              const next = new Set(prev);

              next.add(categoryId);

              return next;
            });
          } catch (networkError) {
            console.error("Network Error:", networkError);

            if (hasCachedData) {
              console.warn("Cached data, update failed.");
            } else {
              throw networkError;
            }
          }
        } catch (finalError) {
          console.error("Critical failure loading children", finalError);
        } finally {
          setCategoryChildrenLoading(categoryId, false);
        }
      }

      setExpandedIds(prev => {
        const next = new Set(prev);

        next.add(categoryId);

        return next;
      });
    },
    [
      expandedIds,
      getCachedChildrenByParentId,
      selectedRowIds,
      loadingChildrenIds,
      client,
      loadedChildrenIds,
      subcategoryPageSize,
      setCategoryChildrenLoading,
      excludeFromSelected,
    ],
  );

  const visibleRows = useMemo<CategoryListRow[]>(() => {
    const rows: CategoryListRow[] = [];

    const appendRows = (
      nodes: CategoryFragment[],
      depth: number,
      parentId: string | null,
    ): void => {
      nodes.forEach(node => {
        rows.push({ category: node, depth, parentId });

        if (expandedIds.has(node.id)) {
          appendRows(getCachedChildrenByParentId(node.id), depth + 1, node.id);
        }
      });
    };

    appendRows(categories ?? [], 0, null);

    return rows;
  }, [categories, expandedIds, getCachedChildrenByParentId]);

  const visibleCategories = useMemo(() => visibleRows.map(row => row.category), [visibleRows]);
  const isCategoryExpanded = useCallback(
    (categoryId: string) => expandedIds.has(categoryId),
    [expandedIds],
  );

  const depthByCategoryId = useMemo(() => {
    return visibleRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.category.id] = row.depth;

      return acc;
    }, {});
  }, [visibleRows]);

  const getCategoryDepth = useCallback(
    (categoryId: string) => depthByCategoryId[categoryId] ?? 0,
    [depthByCategoryId],
  );

  const handleSelectedCategoryIdsChange = useCallback(
    (ids: string[]) => {
      const idsWithoutDeselectedParentsDescendants = removeDescendantsFromDeselectedParents(ids);
      const nextSelectedIds = getSelectedWithLoadedDescendants(
        idsWithoutDeselectedParentsDescendants,
      );

      if (!isEqual(nextSelectedIds, selectedRowIds)) {
        setSelectedRowIds(nextSelectedIds);
      }
    },
    [
      getSelectedWithLoadedDescendants,
      removeDescendantsFromDeselectedParents,
      selectedRowIds,
      setSelectedRowIds,
    ],
  );

  useEffect(() => {
    const nextSelectedIds = getSelectedWithLoadedDescendants(selectedRowIds);

    if (!isEqual(nextSelectedIds, selectedRowIds)) {
      setSelectedRowIds(nextSelectedIds);
    }
  }, [getSelectedWithLoadedDescendants, selectedRowIds, setSelectedRowIds]);

  const handleSetSelectedCategoryIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      const rowsIds = rows
        .map(rowIndex => visibleRows[rowIndex]?.category.id)
        .filter((id): id is string => !!id);

      handleSelectedCategoryIdsChange(rowsIds);
      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [visibleRows, setClearDatagridRowSelectionCallback, handleSelectedCategoryIdsChange],
  );
  const handleCategoryBulkDeleteOnComplete = useCallback(
    (data: CategoryBulkDeleteMutation) => {
      if (data?.categoryBulkDelete?.errors.length === 0) {
        const deletedIds = new Set(deletingCategoryIdsRef.current);
        const deletedIdsWithDescendants = new Set(deletedIds);

        deletedIds.forEach(deletedId => {
          collectDescendantIds(deletedId, getCachedChildrenByParentId).forEach(descendantId => {
            deletedIdsWithDescendants.add(descendantId);
          });
        });

        const parentByCategoryId = visibleRows.reduce<Record<string, string | null>>((acc, row) => {
          acc[row.category.id] = row.parentId;

          return acc;
        }, {});
        const parentIdsToInvalidate = new Set<string>();

        deletedIdsWithDescendants.forEach(deletedId => {
          let parentId = parentByCategoryId[deletedId];

          while (parentId) {
            parentIdsToInvalidate.add(parentId);
            parentId = parentByCategoryId[parentId];
          }
        });

        setExpandedIds(prev => {
          const next = new Set(prev);

          deletedIdsWithDescendants.forEach(id => next.delete(id));

          return next;
        });
        setLoadingChildrenIds(prev => {
          const next = new Set(prev);

          deletedIdsWithDescendants.forEach(id => next.delete(id));

          return next;
        });
        setLoadedChildrenIds(prev => {
          const next = new Set(prev);

          deletedIdsWithDescendants.forEach(id => next.delete(id));
          parentIdsToInvalidate.forEach(id => next.delete(id));

          return next;
        });

        const parentIdsToRefetch = Array.from(parentIdsToInvalidate);

        if (parentIdsToRefetch.length > 0) {
          void Promise.allSettled(
            parentIdsToRefetch.map(parentId =>
              client.query<CategoryChildrenQuery, CategoryChildrenQueryVariables>({
                query: CategoryChildrenDocument,
                variables: {
                  id: parentId,
                  first: subcategoryPageSize,
                  after: null,
                },
                fetchPolicy: "network-only",
              }),
            ),
          );
        }

        navigate(categoryListUrl(), { replace: true });
        refetch();
        clearRowSelection();
        deletingCategoryIdsRef.current = [];
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "G5ETO0",
            defaultMessage: "Categories deleted",
          }),
        });
      }
    },
    [
      clearRowSelection,
      client,
      getCachedChildrenByParentId,
      intl,
      navigate,
      notify,
      refetch,
      subcategoryPageSize,
      visibleRows,
    ],
  );
  const [categoryBulkDelete, categoryBulkDeleteOpts] = useCategoryBulkDeleteMutation({
    onCompleted: handleCategoryBulkDeleteOnComplete,
  });
  const handleCategoryBulkDelete = useCallback(async () => {
    deletingCategoryIdsRef.current = [...selectedRowIds];

    await categoryBulkDelete({
      variables: {
        ids: selectedRowIds,
      },
    });
    clearRowSelection();
  }, [categoryBulkDelete, clearRowSelection, selectedRowIds]);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <CategoryListPage
        hasPresetsChanged={hasPresetsChanged()}
        categories={visibleCategories}
        currentTab={selectedPreset}
        initialSearch={params.query || ""}
        onSearchChange={query => changeFilterField({ query })}
        onAll={() => navigate(categoryListUrl())}
        onTabChange={onPresetChange}
        onTabDelete={(tabIndex: number) => {
          setPresetIdToDelete(tabIndex);
          openModal("delete-search");
        }}
        onTabUpdate={onPresetUpdate}
        onTabSave={() => openModal("save-search")}
        tabs={presets.map(tab => tab.name)}
        settings={settings}
        sort={getSortParams(params)}
        onSort={handleSort}
        disabled={!data}
        onUpdateListSettings={(...props) => {
          clearRowSelection();
          updateListSettings(...props);
        }}
        selectedCategoriesIds={selectedRowIds}
        onSelectCategoriesIds={handleSetSelectedCategoryIds}
        onSelectedCategoriesIdsChange={handleSelectedCategoryIdsChange}
        isCategoryChildrenLoading={isCategoryChildrenLoading}
        onCategoriesDelete={() => openModal("delete")}
        isCategoryExpanded={isCategoryExpanded}
        onCategoryExpandToggle={toggleExpanded}
        getCategoryDepth={getCategoryDepth}
        subcategoryPageSize={subcategoryPageSize}
        onSubcategoryPageSizeChange={handleSubcategoryPageSizeChange}
      />

      <ActionDialog
        confirmButtonState={categoryBulkDeleteOpts.status}
        onClose={() =>
          navigate(
            categoryListUrl({
              ...params,
              action: undefined,
              ids: undefined,
            }),
          )
        }
        onConfirm={handleCategoryBulkDelete}
        open={params.action === "delete"}
        title={intl.formatMessage({
          id: "sG0w22",
          defaultMessage: "Delete categories",
          description: "dialog title",
        })}
        variant="delete"
      >
        <Box display="grid" gap={2}>
          <Box>
            <FormattedMessage
              id="Pp/7T7"
              defaultMessage="{counter,plural,one{Are you sure you want to delete this category?} other{Are you sure you want to delete {displayQuantity} categories?}}"
              values={{
                counter: selectedRowIds.length,
                displayQuantity: <strong>{selectedRowIds.length}</strong>,
              }}
            />
          </Box>
          <Box>
            <FormattedMessage
              id="e+L+q3"
              defaultMessage="Remember this will also delete all products assigned to this category."
            />
          </Box>
        </Box>
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

// eslint-disable-next-line import/no-default-export
export default CategoryList;
