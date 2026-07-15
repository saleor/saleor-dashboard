import { useAssignedTypeAttributes } from "@dashboard/attributes/hooks/useAssignedTypeAttributes";
import { useAttributeGroupByType } from "@dashboard/attributes/hooks/useAttributeGroupByType";
import {
  computePageTypeTabCounts,
  computeProductTypeTabCounts,
} from "@dashboard/attributes/utils/computeTypeTabCounts";
import { getTypedAttributesScope } from "@dashboard/attributes/utils/getTypedAttributesScope";
import { normalizeTypeIds } from "@dashboard/attributes/utils/normalizeTypeIds";
import { getBuiltInAttributeFilterPresets } from "@dashboard/attributes/views/AttributeList/builtInFilterPresets";
import {
  getFilterOpts,
  getFilterQueryParam,
  storageUtils,
} from "@dashboard/attributes/views/AttributeList/filters";
import { BulkAttributeUnassignDialog } from "@dashboard/components/BulkAttributeUnassignDialog";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createAttributesQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { DeleteFilterTabDialog } from "@dashboard/components/DeleteFilterTabDialog";
import { SaveFilterTabDialog } from "@dashboard/components/SaveFilterTabDialog/SaveFilterTabDialog";
import {
  AttributeTypeEnum,
  OrderDirection,
  PageTypeSortField,
  ProductTypeSortField,
  useAttributeBulkDeleteMutation,
  useAttributeListQuery,
  usePageTypeListWithAssignedAttributeCountsQuery,
  useProductTypeListWithAssignedAttributeCountsQuery,
  useUnassignPageAttributeMutation,
  useUnassignProductAttributeMutation,
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
import { resolveActiveTabCountKey } from "@dashboard/modeling/components/ModelTypeTabs/groupModelTypeTabs";
import {
  ALL_MODELS_TAB_ID,
  type ModelTypeTabCount,
} from "@dashboard/modeling/components/ModelTypeTabs/ModelTypeTabs";
import { useModelTypeTabGrouping } from "@dashboard/modeling/components/ModelTypeTabs/useModelTypeTabGrouping";
import { ListViews, type Sort } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";

import { AttributeBulkDeleteDialog } from "../../components/AttributeBulkDeleteDialog";
import AttributeListPage from "../../components/AttributeListPage";
import { attributeListPageMessages } from "../../components/AttributeListPage/messages";
import {
  attributeListUrl,
  type AttributeListUrlDialog,
  type AttributeListUrlQueryParams,
  type AttributeListUrlSortField,
  getAttributeTypeFromBuiltInPresetTab,
  withAttributeListTypeTabSelection,
} from "../../urls";
import { getSortQueryVariables } from "./sort";
import { useAttributeTypeTabCounts } from "./useAttributeTypeTabCounts";

interface AttributeListProps {
  params: AttributeListUrlQueryParams;
}

const AttributeList = ({ params }: AttributeListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.ATTRIBUTE_LIST);
  const { valueProvider } = useConditionalFilterContext();
  const filters = createAttributesQueryVariables(valueProvider.value);
  const sort = getSortParams(params) as Sort<AttributeListUrlSortField>;
  const grouping = useModelTypeTabGrouping();
  const { groupByType, setGroupByType } = useAttributeGroupByType();

  const selectedTypeIdsKey = [
    Array.isArray(params.typeIds) ? params.typeIds.join(",") : (params.typeIds ?? ""),
    Array.isArray(params.pageTypes) ? params.pageTypes.join(",") : (params.pageTypes ?? ""),
  ].join("|");
  const selectedTypeIds = useMemo(
    () => normalizeTypeIds(params.typeIds ?? params.pageTypes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTypeIdsKey],
  );

  usePaginationReset(attributeListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);

  const newQueryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: {
        ...filters,
        search: params.query,
      },
      sort: getSortQueryVariables(params),
    }),
    [filters, paginationState, params],
  );

  const {
    clearRowSelection,
    selectedRowIds,
    setSelectedRowIds,
    setClearDatagridRowSelectionCallback,
  } = useRowSelection(params);
  const builtInFilterPresets = useMemo(() => getBuiltInAttributeFilterPresets(intl), [intl]);
  const {
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    selectedPreset,
    presets,
    getPresetNameToDelete,
    setPresetIdToDelete,
  } = useFilterPresets({
    getUrl: attributeListUrl,
    params,
    storageUtils,
    reset: clearRowSelection,
    builtInPresets: builtInFilterPresets,
  });

  const typedAttributesScope = getTypedAttributesScope(filters, selectedPreset);
  const canGroupByType = typedAttributesScope !== undefined;
  const showTypeTabs = canGroupByType && groupByType;
  const assignedTypeKind =
    typedAttributesScope === AttributeTypeEnum.PRODUCT_TYPE ? "product" : "model";
  const isTypeScoped = showTypeTabs && selectedTypeIds.length > 0;
  const canUnassignFromType = isTypeScoped && selectedTypeIds.length === 1;
  const activeTypeId = canUnassignFromType ? selectedTypeIds[0] : undefined;

  const { data, loading, refetch } = useAttributeListQuery({
    displayLoader: !isTypeScoped,
    skip: isTypeScoped,
    variables: newQueryVariables,
  });

  const {
    attributes: typeScopedAttributes,
    loading: typeScopedLoading,
    refetch: refetchTypeAttributes,
    fetchers: typeAttributeFetchers,
  } = useAssignedTypeAttributes({
    kind: assignedTypeKind,
    typeIds: isTypeScoped ? selectedTypeIds : [],
    search: params.query,
    sort,
    expressionFilters: filters,
  });

  const typedAttributesScopeForQueries = typedAttributesScope;

  const {
    data: pageTypesData,
    previousData: previousPageTypesData,
    loading: pageTypesLoading,
    refetch: refetchPageTypeTabCounts,
  } = usePageTypeListWithAssignedAttributeCountsQuery({
    fetchPolicy: "cache-and-network",
    skip: !showTypeTabs || typedAttributesScopeForQueries !== AttributeTypeEnum.PAGE_TYPE,
    variables: {
      first: 100,
      sort: { field: PageTypeSortField.NAME, direction: OrderDirection.ASC },
    },
  });
  const {
    data: productTypesData,
    previousData: previousProductTypesData,
    loading: productTypesLoading,
    refetch: refetchProductTypeTabCounts,
  } = useProductTypeListWithAssignedAttributeCountsQuery({
    fetchPolicy: "cache-and-network",
    skip: !showTypeTabs || typedAttributesScopeForQueries !== AttributeTypeEnum.PRODUCT_TYPE,
    variables: {
      first: 100,
      sort: { field: ProductTypeSortField.NAME, direction: OrderDirection.ASC },
    },
  });

  const types = useMemo(() => {
    if (typedAttributesScopeForQueries === AttributeTypeEnum.PAGE_TYPE) {
      return (
        mapEdgesToItems(pageTypesData?.pageTypes ?? previousPageTypesData?.pageTypes) ?? undefined
      );
    }

    if (typedAttributesScopeForQueries === AttributeTypeEnum.PRODUCT_TYPE) {
      return (
        mapEdgesToItems(productTypesData?.productTypes ?? previousProductTypesData?.productTypes) ??
        undefined
      );
    }

    return undefined;
  }, [
    pageTypesData,
    previousPageTypesData,
    productTypesData,
    previousProductTypesData,
    typedAttributesScopeForQueries,
  ]);

  const preloadedTypeTabCounts = useMemo(() => {
    if (typedAttributesScopeForQueries === AttributeTypeEnum.PAGE_TYPE) {
      return computePageTypeTabCounts(pageTypesData ?? previousPageTypesData);
    }

    if (typedAttributesScopeForQueries === AttributeTypeEnum.PRODUCT_TYPE) {
      return computeProductTypeTabCounts(productTypesData ?? previousProductTypesData);
    }

    return {};
  }, [
    pageTypesData,
    previousPageTypesData,
    productTypesData,
    previousProductTypesData,
    typedAttributesScopeForQueries,
  ]);

  const typesLoading =
    typedAttributesScopeForQueries === AttributeTypeEnum.PAGE_TYPE
      ? pageTypesLoading
      : productTypesLoading;

  useEffect(() => {
    if (selectedTypeIds.length === 0) {
      return;
    }

    if (canGroupByType && groupByType) {
      return;
    }

    navigate(attributeListUrl(withAttributeListTypeTabSelection(params, undefined)), {
      replace: true,
    });
  }, [canGroupByType, groupByType, navigate, params, selectedTypeIds.length]);

  useEffect(() => {
    if (!types || typesLoading || !showTypeTabs) {
      return;
    }

    const validIds = selectedTypeIds.filter(id => types.some(type => type.id === id));

    if (validIds.length === selectedTypeIds.length) {
      return;
    }

    navigate(attributeListUrl(withAttributeListTypeTabSelection(params, validIds)), {
      replace: true,
    });
  }, [navigate, params, selectedTypeIds, showTypeTabs, types, typesLoading]);

  const activeTabCountKey = useMemo(
    () => resolveActiveTabCountKey(selectedTypeIds, types ?? [], grouping.groupingOptions),
    [grouping.groupingOptions, selectedTypeIds, types],
  );

  const { counts, setCount, resetCounts, fetchers } = useAttributeTypeTabCounts({
    preloadedCounts: preloadedTypeTabCounts,
    attributeType: typedAttributesScopeForQueries ?? AttributeTypeEnum.PAGE_TYPE,
    selectedTypeIds,
    allTabId: ALL_MODELS_TAB_ID,
    pageSize: settings.rowNumber,
  });

  const activeCount = useMemo((): ModelTypeTabCount | undefined => {
    if (isTypeScoped) {
      if (typeScopedLoading) {
        return undefined;
      }

      return {
        value: typeScopedAttributes.length,
        hasMore: false,
      };
    }

    if (loading && !data?.attributes) {
      return undefined;
    }

    if (!data?.attributes) {
      return undefined;
    }

    return {
      value: data.attributes.edges.length,
      hasMore: !!data.attributes.pageInfo.hasNextPage,
    };
  }, [data?.attributes, isTypeScoped, loading, typeScopedAttributes.length, typeScopedLoading]);

  useEffect(() => {
    if (activeCount === undefined || !showTypeTabs) {
      return;
    }

    setCount(activeTabCountKey, activeCount);
  }, [activeCount, activeTabCountKey, setCount, showTypeTabs]);

  const defaultAttributeType = useMemo(() => {
    const { type } = filters;

    if (type === AttributeTypeEnum.PRODUCT_TYPE || type === AttributeTypeEnum.PAGE_TYPE) {
      return type;
    }

    return getAttributeTypeFromBuiltInPresetTab(selectedPreset);
  }, [filters, selectedPreset]);

  const refetchTypeTabCounts = useCallback(async () => {
    if (!showTypeTabs || !typedAttributesScopeForQueries) {
      return;
    }

    if (typedAttributesScopeForQueries === AttributeTypeEnum.PAGE_TYPE) {
      await refetchPageTypeTabCounts();

      return;
    }

    await refetchProductTypeTabCounts();
  }, [
    refetchPageTypeTabCounts,
    refetchProductTypeTabCounts,
    showTypeTabs,
    typedAttributesScopeForQueries,
  ]);

  const refetchList = useCallback(async () => {
    if (isTypeScoped) {
      await refetchTypeAttributes();
    } else {
      await refetch();
    }
  }, [isTypeScoped, refetch, refetchTypeAttributes]);

  const refreshListAndTabCounts = useCallback(async () => {
    resetCounts();
    await refetchList();
    await refetchTypeTabCounts();
  }, [refetchList, refetchTypeTabCounts, resetCounts]);

  const [openModal, closeModal] = createDialogActionHandlers<
    AttributeListUrlDialog,
    AttributeListUrlQueryParams
  >(navigate, attributeListUrl, params);

  const handleUnassignSuccess = useCallback(() => {
    closeModal();
    notify({
      status: "success",
      text: intl.formatMessage(
        assignedTypeKind === "product"
          ? attributeListPageMessages.productTypeUpdated
          : attributeListPageMessages.modelTypeUpdated,
      ),
    });
    clearRowSelection();
    void refreshListAndTabCounts();
  }, [assignedTypeKind, clearRowSelection, closeModal, intl, notify, refreshListAndTabCounts]);

  const [unassignProductAttribute, unassignProductAttributeOpts] =
    useUnassignProductAttributeMutation({
      onCompleted: data => {
        if (data.productAttributeUnassign?.errors.length === 0) {
          handleUnassignSuccess();
        }
      },
    });
  const [unassignPageAttribute, unassignPageAttributeOpts] = useUnassignPageAttributeMutation({
    onCompleted: data => {
      if (data.pageAttributeUnassign?.errors.length === 0) {
        handleUnassignSuccess();
      }
    },
  });

  const activeTypeName = useMemo(() => {
    if (!activeTypeId) {
      return undefined;
    }

    return types?.find(type => type.id === activeTypeId)?.name;
  }, [activeTypeId, types]);

  const [attributeBulkDelete, attributeBulkDeleteOpts] = useAttributeBulkDeleteMutation({
    onCompleted: data => {
      if (data.attributeBulkDelete?.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "fpafCx",
            defaultMessage: "Attributes deleted",
            description: "deleted multiple attributes",
          }),
        });
        clearRowSelection();
        void refreshListAndTabCounts();
      }
    },
  });
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: attributeListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });
  const paginationValues = usePaginator({
    pageInfo: data?.attributes?.pageInfo,
    paginationState,
    queryString: params,
  });
  const handleSort = createSortHandler(navigate, attributeListUrl, params);

  const listAttributes = isTypeScoped
    ? typeScopedAttributes
    : (mapEdgesToItems(data?.attributes) ?? []);

  const handleTypeTabChange = useCallback(
    (ids: string[]) => {
      clearRowSelection();
      navigate(
        attributeListUrl({
          ...withAttributeListTypeTabSelection(params, ids),
          after: undefined,
          before: undefined,
        }),
      );
    },
    [clearRowSelection, navigate, params],
  );

  const handleGroupByTypeChange = useCallback(
    (enabled: boolean) => {
      clearRowSelection();
      setGroupByType(enabled);

      if (!enabled && selectedTypeIds.length > 0) {
        navigate(attributeListUrl(withAttributeListTypeTabSelection(params, undefined)));
      }
    },
    [clearRowSelection, navigate, params, selectedTypeIds.length, setGroupByType],
  );

  const handleSelectAttributesIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!listAttributes) {
        return;
      }

      const rowsIds = rows.map(row => listAttributes[row]?.id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [listAttributes, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );

  const isLoading =
    attributeBulkDeleteOpts.loading ||
    unassignProductAttributeOpts.loading ||
    unassignPageAttributeOpts.loading ||
    (isTypeScoped ? typeScopedLoading : loading) ||
    (showTypeTabs && typesLoading);

  const unassignConfirmButtonState =
    assignedTypeKind === "product"
      ? unassignProductAttributeOpts.status
      : unassignPageAttributeOpts.status;

  return (
    <PaginatorContext.Provider value={paginationValues}>
      {showTypeTabs && fetchers}
      {isTypeScoped && typeAttributeFetchers}
      <AttributeListPage
        settings={settings}
        onUpdateListSettings={updateListSettings}
        onFilterPresetsAll={resetFilters}
        onFilterPresetDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onFilterPresetPresetSave={() => openModal("save-search")}
        onFilterPresetChange={onPresetChange}
        onFilterPresetUpdate={onPresetUpdate}
        hasPresetsChanged={hasPresetsChanged}
        onAttributesDelete={() => openModal("remove")}
        onAttributesUnassign={() => openModal("unassign")}
        canUnassignFromType={canUnassignFromType}
        selectedFilterPreset={selectedPreset}
        selectedAttributesIds={selectedRowIds}
        builtInFilterPresets={builtInFilterPresets.map(tab => tab.name)}
        defaultAttributeType={defaultAttributeType}
        filterPresets={presets.map(tab => tab.name)}
        attributes={listAttributes}
        disabled={isLoading}
        hidePagination={isTypeScoped}
        filterOpts={getFilterOpts(params)}
        initialSearch={params.query || ""}
        onFilterChange={changeFilters}
        onSearchChange={handleSearchChange}
        onSort={handleSort}
        sort={sort}
        onSelectAttributesIds={handleSelectAttributesIds}
        canGroupByType={canGroupByType}
        groupByType={groupByType}
        onGroupByTypeChange={handleGroupByTypeChange}
        showTypeTabs={showTypeTabs}
        types={types}
        selectedTypeIds={selectedTypeIds}
        typeTabCounts={counts}
        onTypeTabChange={handleTypeTabChange}
        typeTabGrouping={grouping}
      />

      <AttributeBulkDeleteDialog
        confirmButtonState={attributeBulkDeleteOpts.status}
        open={params.action === "remove" && selectedRowIds.length > 0}
        onConfirm={async () => {
          await attributeBulkDelete({ variables: { ids: selectedRowIds } });
          clearRowSelection();
        }}
        onClose={closeModal}
        quantity={selectedRowIds.length}
      />

      <BulkAttributeUnassignDialog
        title={intl.formatMessage(
          assignedTypeKind === "product"
            ? {
                id: "r1aQ2f",
                defaultMessage: "Unassign Attribute from Product Type",
                description: "dialog header",
              }
            : {
                id: "N7tQ9P",
                defaultMessage: "Unassign attribute from model type",
                description: "dialog header",
              },
        )}
        attributeQuantity={selectedRowIds.length}
        confirmButtonState={unassignConfirmButtonState}
        open={params.action === "unassign" && selectedRowIds.length > 0 && canUnassignFromType}
        itemTypeName={activeTypeName ?? ""}
        description={intl.formatMessage(
          assignedTypeKind === "product"
            ? attributeListPageMessages.unassignFromProductTypeHint
            : attributeListPageMessages.unassignFromModelTypeHint,
        )}
        onClose={closeModal}
        onConfirm={() => {
          if (!activeTypeId) {
            return;
          }

          if (assignedTypeKind === "product") {
            void unassignProductAttribute({
              variables: { id: activeTypeId, ids: selectedRowIds },
            });
          } else {
            void unassignPageAttribute({
              variables: { id: activeTypeId, ids: selectedRowIds },
            });
          }
        }}
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

AttributeList.displayName = "AttributeList";

export default AttributeList;
