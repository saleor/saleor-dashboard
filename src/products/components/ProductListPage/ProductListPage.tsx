import {
  extensionMountPoints,
  mapToMenuItems,
  mapToMenuItemsForProductOverviewActions,
  useExtensions,
} from "@dashboard/apps/hooks/useExtensions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { getByName } from "@dashboard/components/Filter/utils";
import FilterBar from "@dashboard/components/FilterBar";
import { ListPageLayout } from "@dashboard/components/Layouts";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import { TopNavMenu } from "@dashboard/components/TopNavMenu";
import { ProductListColumns } from "@dashboard/config";
import {
  GridAttributesQuery,
  ProductListQuery,
  RefreshLimitsQuery,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  ChannelProps,
  FetchMoreProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  RelayToFlat,
  SortPage,
} from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { Card } from "@material-ui/core";
import {
  Box,
  Button,
  ProductsIcons,
  TableEditIcon,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductListUrlSortField, productUrl } from "../../urls";
import { ProductListDatagrid } from "../ProductListDatagrid";
import { ProductListTiles } from "../ProductListTiles/ProductListTiles";
import {
  createFilterStructure,
  ProductFilterKeys,
  ProductListFilterOpts,
} from "./filters";

export interface ProductListPageProps
  extends PageListProps<ProductListColumns>,
    ListActions,
    FilterPageProps<ProductFilterKeys, ProductListFilterOpts>,
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
  onAdd: () => void;
  onExport: () => void;
  onColumnQueryChange: (query: string) => void;
}

export const ProductListPage: React.FC<ProductListPageProps> = props => {
  const {
    columnQuery,
    currencySymbol,
    currentTab,
    defaultSettings,
    gridAttributes,
    limits,
    availableInGridAttributes,
    filterOpts,
    hasMore,
    initialSearch,
    loading,
    settings,
    tabs,
    onAdd,
    onAll,
    onColumnQueryChange,
    onExport,
    onFetchMore,
    onFilterChange,
    onFilterAttributeFocus,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    onUpdateListSettings,
    selectedChannelId,
    selectedProductIds,
    activeAttributeSortId,
    ...listProps
  } = props;
  const intl = useIntl();
  const navigate = useNavigator();
  const filterStructure = createFilterStructure(intl, filterOpts);

  const filterDependency = filterStructure.find(getByName("channel"));

  const limitReached = isLimitReached(limits, "productVariants");
  const { PRODUCT_OVERVIEW_CREATE, PRODUCT_OVERVIEW_MORE_ACTIONS } =
    useExtensions(extensionMountPoints.PRODUCT_LIST);

  const extensionMenuItems = mapToMenuItemsForProductOverviewActions(
    PRODUCT_OVERVIEW_MORE_ACTIONS,
    selectedProductIds,
  );
  const extensionCreateButtonItems = mapToMenuItems(PRODUCT_OVERVIEW_CREATE);

  const [isDatagridView, setDatagridView] = React.useState(true);

  return (
    <ListPageLayout>
      <TopNav title={intl.formatMessage(sectionNames.products)}>
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
          <TopNavMenu
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
          <FilterBar
            withoutBorder
            currencySymbol={currencySymbol}
            currentTab={currentTab}
            initialSearch={initialSearch}
            onAll={onAll}
            onFilterChange={onFilterChange}
            onFilterAttributeFocus={onFilterAttributeFocus}
            onSearchChange={onSearchChange}
            onTabChange={onTabChange}
            onTabDelete={onTabDelete}
            onTabSave={onTabSave}
            tabs={tabs}
            allTabLabel={intl.formatMessage({
              id: "aFLtLk",
              defaultMessage: "All Products",
              description: "tab name",
            })}
            filterStructure={filterStructure}
            searchPlaceholder={intl.formatMessage({
              id: "kIvvax",
              defaultMessage: "Search Products...",
            })}
          />
          {/* Temporary solution until header is reworked */}
          <Button
            variant="tertiary"
            onClick={() => setDatagridView(state => !state)}
          >
            {!isDatagridView ? (
              <>
                <TableEditIcon />
                <FormattedMessage
                  id="WACLJx"
                  defaultMessage="Switch to datagrid view"
                  description="switch"
                />
              </>
            ) : (
              <>
                <ProductsIcons />
                <FormattedMessage
                  id="CU+aFW"
                  defaultMessage="Switch to tile view"
                  description="switch"
                />
              </>
            )}
          </Button>
        </Box>
        {isDatagridView ? (
          <ProductListDatagrid
            {...listProps}
            filterDependency={filterDependency}
            activeAttributeSortId={activeAttributeSortId}
            columnQuery={columnQuery}
            defaultSettings={defaultSettings}
            availableInGridAttributes={availableInGridAttributes}
            loading={loading}
            hasMore={hasMore}
            gridAttributes={gridAttributes}
            onColumnQueryChange={onColumnQueryChange}
            onFetchMore={onFetchMore}
            products={listProps.products}
            settings={settings}
            selectedChannelId={selectedChannelId}
            onUpdateListSettings={onUpdateListSettings}
            onRowClick={id => {
              navigate(productUrl(id));
            }}
          />
        ) : (
          <ProductListTiles
            loading={loading}
            hasMore={hasMore}
            onFetchMore={onFetchMore}
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
