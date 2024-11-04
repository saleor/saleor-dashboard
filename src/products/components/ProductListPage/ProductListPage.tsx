// @ts-strict-ignore
import { LazyQueryResult } from "@apollo/client/react";
import {
  extensionMountPoints,
  mapToMenuItems,
  mapToMenuItemsForProductOverviewActions,
  useExtensions,
} from "@dashboard/apps/hooks/useExtensions";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterElement } from "@dashboard/components/Filter";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import { ProductListColumns } from "@dashboard/config";
import {
  Exact,
  GridAttributesQuery,
  ProductListQuery,
  RefreshLimitsQuery,
  useAvailableColumnAttributesLazyQuery,
} from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  ChannelProps,
  PageListProps,
  RelayToFlat,
  SearchPageProps,
  SortPage,
  TabPageProps,
} from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { Box, Button, ChevronRightIcon, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { ProductListUrlSortField, productUrl } from "../../urls";
import { ProductListDatagrid } from "../ProductListDatagrid";
import { ProductListTiles } from "../ProductListTiles/ProductListTiles";
import { ProductListViewSwitch } from "../ProductListViewSwitch";

export interface ProductListPageProps
  extends PageListProps<ProductListColumns>,
    SearchPageProps,
    Omit<TabPageProps, "onTabDelete" | "onTabDelete">,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  currencySymbol: string;
  gridAttributesOpts: LazyQueryResult<
    GridAttributesQuery,
    Exact<{
      ids: string | string[];
    }>
  >;
  limits: RefreshLimitsQuery["shop"]["limits"];
  products: RelayToFlat<ProductListQuery["products"]>;
  selectedProductIds: string[];
  hasPresetsChanged: boolean;
  onAdd: () => void;
  onExport: () => void;
  onTabUpdate: (tabName: string) => void;
  onTabDelete: (tabIndex: number) => void;
  availableColumnsAttributesOpts: ReturnType<typeof useAvailableColumnAttributesLazyQuery>;
  onProductsDelete: () => void;
  onSelectProductIds: (ids: number[], clearSelection: () => void) => void;
  clearRowSelection: () => void;
  filterDependency?: FilterElement;
}

export type ProductListViewType = "datagrid" | "tile";

const DEFAULT_PRODUCT_LIST_VIEW_TYPE: ProductListViewType = "datagrid";

export const ProductListPage: React.FC<ProductListPageProps> = props => {
  const {
    currencySymbol,
    defaultSettings,
    gridAttributesOpts,
    limits,
    availableColumnsAttributesOpts,
    initialSearch,
    settings,
    onAdd,
    onExport,
    onSearchChange,
    onUpdateListSettings,
    selectedChannelId,
    activeAttributeSortId,
    onTabChange,
    onTabDelete,
    onTabSave,
    onAll,
    currentTab,
    tabs,
    onTabUpdate,
    hasPresetsChanged,
    selectedProductIds,
    onProductsDelete,
    clearRowSelection,
    filterDependency,
    ...listProps
  } = props;
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigator();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const limitReached = isLimitReached(limits, "productVariants");
  const { PRODUCT_OVERVIEW_CREATE, PRODUCT_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.PRODUCT_LIST,
  );
  const extensionMenuItems = mapToMenuItemsForProductOverviewActions(
    PRODUCT_OVERVIEW_MORE_ACTIONS,
    selectedProductIds,
  );
  const extensionCreateButtonItems = mapToMenuItems(PRODUCT_OVERVIEW_CREATE);
  const [storedProductListViewType, setProductListViewType] = useLocalStorage<ProductListViewType>(
    "productListViewType",
    DEFAULT_PRODUCT_LIST_VIEW_TYPE,
  );
  const isDatagridView = storedProductListViewType === "datagrid";

  return (
    <ListPageLayout>
      <TopNav
        withoutBorder
        isAlignToRight={false}
        title={intl.formatMessage(sectionNames.products)}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>

            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged}
              onSelect={onTabChange}
              onRemove={onTabDelete}
              onUpdate={onTabUpdate}
              savedPresets={tabs}
              activePreset={currentTab}
              onSelectAll={onAll}
              onSave={onTabSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "tCLTCb",
                defaultMessage: "All products",
                description: "tab name",
              })}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {hasLimits(limits, "productVariants") && (
              <Text size={2}>
                {intl.formatMessage(
                  {
                    id: "Kw0jHS",
                    defaultMessage: "{count}/{max} SKUs used",
                    description: "created products counter",
                  },
                  {
                    count: limits.currentUsage.productVariants,
                    max: limits.allowedUsage.productVariants,
                  },
                )}
              </Text>
            )}
            <TopNav.Menu
              dataTestId="menu"
              items={[
                {
                  label: intl.formatMessage({
                    id: "7FL+WZ",
                    defaultMessage: "Export Products",
                    description: "export products to csv file, button",
                  }),
                  onSelect: onExport,
                  testId: "export",
                },
                ...extensionMenuItems,
              ]}
            />
            {extensionCreateButtonItems.length > 0 ? (
              <ButtonWithDropdown
                onClick={onAdd}
                testId={"add-product"}
                options={extensionCreateButtonItems}
              >
                <FormattedMessage
                  id="JFmOfi"
                  defaultMessage="Create Product"
                  description="button"
                />
              </ButtonWithDropdown>
            ) : (
              <Button data-test-id="add-product" onClick={onAdd}>
                <FormattedMessage
                  id="JFmOfi"
                  defaultMessage="Create Product"
                  description="button"
                />
              </Button>
            )}
          </Box>
        </Box>
      </TopNav>
      {limitReached && (
        <LimitReachedAlert
          title={intl.formatMessage({
            id: "FwHWUm",
            defaultMessage: "SKU limit reached",
            description: "alert",
          })}
        >
          <FormattedMessage
            id="5Vwnu+"
            defaultMessage="You have reached your SKU limit, you will be no longer able to add SKUs to your store. If you would like to up your limit, contact your administration staff about raising your limits."
          />
        </LimitReachedAlert>
      )}
      <DashboardCard>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="stretch"
          justifyContent="space-between"
        >
          <ListFilters
            type="expression-filter"
            initialSearch={initialSearch}
            onSearchChange={onSearchChange}
            searchPlaceholder={intl.formatMessage({
              id: "kIvvax",
              defaultMessage: "Search Products...",
            })}
            actions={
              <Box display="flex" gap={4}>
                {selectedProductIds.length > 0 && (
                  <BulkDeleteButton onClick={onProductsDelete}>
                    <FormattedMessage defaultMessage="Delete products" id="uwk5e9" />
                  </BulkDeleteButton>
                )}
                <ProductListViewSwitch
                  defaultValue={storedProductListViewType}
                  setProductListViewType={props => {
                    setProductListViewType(props);
                    clearRowSelection();
                  }}
                />
              </Box>
            }
          />
        </Box>
        {isDatagridView ? (
          <ProductListDatagrid
            {...listProps}
            hasRowHover={!isFilterPresetOpen}
            filterDependency={filterDependency}
            activeAttributeSortId={activeAttributeSortId}
            defaultSettings={defaultSettings}
            availableColumnsAttributesOpts={availableColumnsAttributesOpts}
            loading={listProps.disabled}
            gridAttributesOpts={gridAttributesOpts}
            products={listProps.products}
            settings={settings}
            selectedChannelId={selectedChannelId}
            onUpdateListSettings={onUpdateListSettings}
            rowAnchor={productUrl}
            onRowClick={id => {
              navigate(productUrl(id), {
                state: {
                  prevLocation: location,
                },
              });
            }}
          />
        ) : (
          <ProductListTiles
            {...listProps}
            settings={settings}
            loading={listProps.disabled}
            onUpdateListSettings={onUpdateListSettings}
            products={listProps.products}
            onTileClick={id => {
              navigate(productUrl(id));
            }}
          />
        )}
      </DashboardCard>
    </ListPageLayout>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
