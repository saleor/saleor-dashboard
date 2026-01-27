import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createProductTypesQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useProductTypeBulkDeleteMutation, useProductTypeListQuery } from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import useProductTypeDelete from "@dashboard/productTypes/hooks/useProductTypeDelete";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { Button } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import TypeDeleteWarningDialog from "../../../components/TypeDeleteWarningDialog/TypeDeleteWarningDialog";
import { maybe } from "../../../misc";
import ProductTypeListPage from "../../components/ProductTypeListPage";
import {
  productTypeListUrl,
  ProductTypeListUrlDialog,
  ProductTypeListUrlQueryParams,
} from "../../urls";
import { getFilterOpts, getFilterQueryParam, storageUtils } from "./filters";
import { getSortQueryVariables } from "./sort";

interface ProductTypeListProps {
  params: ProductTypeListUrlQueryParams;
}

const ProductTypeList = ({ params }: ProductTypeListProps) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const notify = useNotifier();
  const {
    isSelected,
    listElements: selectedProductTypes,
    reset,
    toggle,
    toggleAll,
  } = useBulkActions(params.ids);
  const { settings } = useListSettings(ListViews.PRODUCT_LIST);
  const { valueProvider } = useConditionalFilterContext();
  const filters = createProductTypesQueryVariables(valueProvider.value);

  usePaginationReset(productTypeListUrl, params, settings.rowNumber);

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
    [params, settings.rowNumber, valueProvider.value],
  );
  const { data, loading, refetch } = useProductTypeListQuery({
    displayLoader: true,
    variables: newQueryVariables,
  });
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: reset,
    createUrl: productTypeListUrl,
    getFilterQueryParam,
    navigate,
    params,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    ProductTypeListUrlDialog,
    ProductTypeListUrlQueryParams
  >(navigate, productTypeListUrl, params);

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
    reset,
    getUrl: productTypeListUrl,
    storageUtils,
  });

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data?.productTypes?.pageInfo),
    paginationState,
    queryString: params,
  });
  const handleSort = createSortHandler(navigate, productTypeListUrl, params);
  const productTypesData = mapEdgesToItems(data?.productTypes) ?? [];

  const productTypeDeleteData = useProductTypeDelete({
    selectedTypes: selectedProductTypes,
    params,
    typeBaseData: productTypesData,
  });
  const [productTypeBulkDelete, productTypeBulkDeleteOpts] = useProductTypeBulkDeleteMutation({
    onCompleted: data => {
      if (data?.productTypeBulkDelete?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "mkBgDe", defaultMessage: "Product types deleted" }),
        });
        reset();
        refetch();
        navigate(
          productTypeListUrl({
            ...params,
            action: undefined,
            ids: undefined,
          }),
        );
      }
    },
  });
  const onProductTypeBulkDelete = () =>
    productTypeBulkDelete({
      variables: {
        ids: params.ids ?? [],
      },
    });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <ProductTypeListPage
        currentTab={selectedPreset}
        filterOpts={getFilterOpts(params)}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onAll={resetFilters}
        onTabChange={onPresetChange}
        onTabDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onTabSave={() => openModal("save-search")}
        onTabUpdate={onPresetUpdate}
        tabs={presets.map(tab => tab.name)}
        disabled={loading}
        productTypes={productTypesData}
        onSort={handleSort}
        isChecked={isSelected}
        selected={selectedProductTypes.length}
        sort={getSortParams(params)}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <Button
            icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
            variant="secondary"
            data-test-id="bulk-delete-product-types"
            onClick={() =>
              openModal("remove", {
                ids: selectedProductTypes,
              })
            }
          />
        }
        hasPresetsChanged={hasPresetsChanged}
      />
      {productTypesData && (
        <TypeDeleteWarningDialog
          {...productTypeDeleteData}
          typesData={productTypesData}
          typesToDelete={selectedProductTypes}
          onClose={closeModal}
          onDelete={onProductTypeBulkDelete}
          deleteButtonState={productTypeBulkDeleteOpts.status}
        />
      )}
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

ProductTypeList.displayName = "ProductTypeList";
export default ProductTypeList;
