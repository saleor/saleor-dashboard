import {
  extensionMountPoints,
  mapToMenuItems,
  mapToMenuItemsForProductOverviewActions,
  useExtensions,
} from "@dashboard/apps/hooks/useExtensions";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { getByName } from "@dashboard/components/Filter/utils";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import { ProductListColumns } from "@dashboard/config";
import {
  GridAttributesQuery,
  ProductListQuery,
  RefreshLimitsQuery,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  ChannelProps,
  FetchMoreProps,
  FilterPageProps,
  PageListProps,
  RelayToFlat,
  SortPage,
} from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { Card } from "@material-ui/core";
import { Box, Button, ChevronRightIcon, Text } from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductListUrlSortField, productUrl } from "../../urls";
import { ProductListDatagrid } from "../ProductListDatagrid";
import { ProductListDeleteButton } from "../ProductListDeleteButton";
import { ProductListTiles } from "../ProductListTiles/ProductListTiles";
import { ProductListViewSwitch } from "../ProductListViewSwitch";
import {
  createFilterStructure,
  ProductFilterKeys,
  ProductListFilterOpts,
} from "./filters";

export interface ProductListPageProps
  extends PageListProps<ProductListColumns>,
    Omit<
      FilterPageProps<ProductFilterKeys, ProductListFilterOpts>,
      "onTabDelete"
    >,
    FetchMoreProps,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  availableInGridAttributes: RelayToFlat<
    SearchAvailableInGridAttributesQuery["availableInGrid"]
  >;
  columnQuery: string;
  currencySymbol: string;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  limits: RefreshLimitsQuery["shop"]["limits"];
  products: RelayToFlat<ProductListQuery["products"]>;
  selectedProductIds: string[];
  hasPresetsChanged: boolean;
  onAdd: () => void;
  onExport: () => void;
  onColumnQueryChange: (query: string) => void;
  onTabUpdate: (tabName: string) => void;
  onTabDelete: (tabIndex: number) => void;
  onProductsDelete: () => void;
  onSelectProductIds: (ids: number[], clearSelection: () => void) => void;
  clearRowSelection: () => void;
  setBulkDeleteButtonRef: (ref: HTMLButtonElement) => void;
}

export type ProductListViewType = "datagrid" | "tile";
const DEFAULT_PRODUCT_LIST_VIEW_TYPE: ProductListViewType = "datagrid";

export const ProductListPage: React.FC<ProductListPageProps> = props => {
  const {
    columnQuery,
    currencySymbol,
    defaultSettings,
    gridAttributes,
    limits,
    availableInGridAttributes,
    filterOpts,
    hasMore,
    initialSearch,
    loading,
    settings,
    onAdd,
    onColumnQueryChange,
    onExport,
    onFetchMore,
    onFilterChange,
    onFilterAttributeFocus,
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
    setBulkDeleteButtonRef,
    ...listProps
  } = props;
  const intl = useIntl();
  const navigate = useNavigator();
  const filterStructure = createFilterStructure(intl, filterOpts);
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  const filterDependency = filterStructure.find(getByName("channel"));

  const limitReached = isLimitReached(limits, "productVariants");
  const { PRODUCT_OVERVIEW_CREATE, PRODUCT_OVERVIEW_MORE_ACTIONS } =
    useExtensions(extensionMountPoints.PRODUCT_LIST);

  const extensionMenuItems = mapToMenuItemsForProductOverviewActions(
    PRODUCT_OVERVIEW_MORE_ACTIONS,
    selectedProductIds,
  );
  const extensionCreateButtonItems = mapToMenuItems(PRODUCT_OVERVIEW_CREATE);

  const [storedProductListViewType, setProductListViewType] =
    useLocalStorage<ProductListViewType>(
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
        <Box
          __flex={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex">
            <Box marginX={6} display="flex" alignItems="center">
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
          <Box display="flex" alignItems="center" gap={5}>
            {hasLimits(limits, "productVariants") && (
              <Text variant="caption">
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
      <Card>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="stretch"
          justifyContent="space-between"
        >
          <ListFilters
            currencySymbol={currencySymbol}
            initialSearch={initialSearch}
            onFilterChange={onFilterChange}
            onFilterAttributeFocus={onFilterAttributeFocus}
            onSearchChange={onSearchChange}
            filterStructure={filterStructure}
            searchPlaceholder={intl.formatMessage({
              id: "kIvvax",
              defaultMessage: "Search Products...",
            })}
            actions={
              <Box display="flex" gap={7}>
                <ProductListDeleteButton
                  ref={setBulkDeleteButtonRef}
                  onClick={onProductsDelete}
                  show={selectedProductIds.length > 0}
                />
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
            columnQuery={columnQuery}
            defaultSettings={defaultSettings}
            availableInGridAttributes={availableInGridAttributes}
            isAttributeLoading={loading}
            loading={listProps.disabled}
            hasMore={hasMore}
            gridAttributes={gridAttributes}
            onColumnQueryChange={onColumnQueryChange}
            onFetchMore={onFetchMore}
            products={listProps.products}
            settings={settings}
            selectedChannelId={selectedChannelId}
            onUpdateListSettings={onUpdateListSettings}
            rowAnchor={productUrl}
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
      </Card>
    </ListPageLayout>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
