// @ts-strict-ignore
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@dashboard/components/SaveFilterTabDialog";
import { useProductTypeBulkDeleteMutation, useProductTypeListQuery } from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { commonMessages } from "@dashboard/intl";
import useProductTypeDelete from "@dashboard/productTypes/hooks/useProductTypeDelete";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import TypeDeleteWarningDialog from "../../../components/TypeDeleteWarningDialog/TypeDeleteWarningDialog";
import { maybe } from "../../../misc";
import ProductTypeListPage from "../../components/ProductTypeListPage";
import {
  productTypeListUrl,
  ProductTypeListUrlDialog,
  ProductTypeListUrlQueryParams,
} from "../../urls";
import {
  deleteFilterTab,
  getActiveFilters,
  getFilterOpts,
  getFilterQueryParam,
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface ProductTypeListProps {
  params: ProductTypeListUrlQueryParams;
}

export const ProductTypeList: React.FC<ProductTypeListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const {
    isSelected,
    listElements: selectedProductTypes,
    reset,
    toggle,
    toggleAll,
  } = useBulkActions(params.ids);
  const { settings } = useListSettings(ListViews.PRODUCT_LIST);
  const intl = useIntl();

  usePaginationReset(productTypeListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = useProductTypeListQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const tabs = getFilterTabs();
  const currentTab = getFiltersCurrentTab(params, tabs);
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
  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      productTypeListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data,
      }),
    );
  };
  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(productTypeListUrl());
  };
  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };
  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.productTypes.pageInfo),
    paginationState,
    queryString: params,
  });
  const handleSort = createSortHandler(navigate, productTypeListUrl, params);
  const productTypesData = mapEdgesToItems(data?.productTypes);

  const productTypeDeleteData = useProductTypeDelete({
    selectedTypes: selectedProductTypes,
    params,
    typeBaseData: productTypesData,
  });
  const [productTypeBulkDelete, productTypeBulkDeleteOpts] = useProductTypeBulkDeleteMutation({
    onCompleted: data => {
      if (data.productTypeBulkDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
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
        ids: params.ids,
      },
    });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <ProductTypeListPage
        currentTab={currentTab}
        filterOpts={getFilterOpts(params)}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onAll={resetFilters}
        onTabChange={handleTabChange}
        onTabDelete={() => openModal("delete-search")}
        onTabSave={() => openModal("save-search")}
        tabs={tabs.map(tab => tab.name)}
        disabled={loading}
        productTypes={productTypesData}
        onSort={handleSort}
        isChecked={isSelected}
        selected={selectedProductTypes.length}
        sort={getSortParams(params)}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <IconButton
            variant="secondary"
            color="primary"
            data-test-id="bulk-delete-product-types"
            onClick={() =>
              openModal("remove", {
                ids: selectedProductTypes,
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
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
        onSubmit={handleTabSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handleTabDelete}
        tabName={maybe(() => tabs[currentTab - 1].name, "...")}
      />
    </PaginatorContext.Provider>
  );
};
ProductTypeList.displayName = "ProductTypeList";
export default ProductTypeList;
