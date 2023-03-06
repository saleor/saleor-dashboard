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
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductListUrlSortField } from "../../urls";
import ProductList from "../ProductList";
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
    currencySymbol,
    currentTab,
    gridAttributes,
    limits,
    filterOpts,
    initialSearch,
    settings,
    tabs,
    onAdd,
    onAll,
    onExport,
    onFilterChange,
    onFilterAttributeFocus,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    onUpdateListSettings,
    selectedChannelId,
    selectedProductIds,
    ...listProps
  } = props;
  const intl = useIntl();

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
        <FilterBar
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
        <ProductList
          {...listProps}
          gridAttributes={gridAttributes}
          settings={settings}
          selectedChannelId={selectedChannelId}
          onUpdateListSettings={onUpdateListSettings}
          filterDependency={filterDependency}
        />
      </Card>
    </ListPageLayout>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
