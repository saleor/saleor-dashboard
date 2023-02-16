import {
  extensionMountPoints,
  mapToMenuItems,
  mapToMenuItemsForProductOverviewActions,
  useExtensions,
} from "@dashboard/apps/useExtensions";
import { ButtonWithSelect } from "@dashboard/components/ButtonWithSelect";
import CardMenu from "@dashboard/components/CardMenu";
import Container from "@dashboard/components/Container";
import FilterBar from "@dashboard/components/FilterBar";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import PageHeader from "@dashboard/components/PageHeader";
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
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductListUrlSortField, productUrl } from "../../urls";
import { ProductListDatagrid } from "../ProductListDatagrid";
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
const useStyles = makeStyles(
  theme => ({
    settings: {
      [theme.breakpoints.up("sm")]: {
        marginRight: theme.spacing(2),
      },
    },
  }),
  { name: "ProductListPage" },
);

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
  const classes = useStyles(props);
  const navigate = useNavigator();
  const filterStructure = createFilterStructure(intl, filterOpts);

  const limitReached = isLimitReached(limits, "productVariants");
  const { PRODUCT_OVERVIEW_CREATE, PRODUCT_OVERVIEW_MORE_ACTIONS } =
    useExtensions(extensionMountPoints.PRODUCT_LIST);

  const extensionMenuItems = mapToMenuItemsForProductOverviewActions(
    PRODUCT_OVERVIEW_MORE_ACTIONS,
    selectedProductIds,
  );
  const extensionCreateButtonItems = mapToMenuItems(PRODUCT_OVERVIEW_CREATE);

  return (
    <Container>
      <PageHeader
        cardMenu={
          <CardMenu
            className={classes.settings}
            menuItems={[
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
            data-test-id="menu"
          />
        }
        title={intl.formatMessage(sectionNames.products)}
        limitText={
          hasLimits(limits, "productVariants") &&
          intl.formatMessage(
            {
              id: "Kw0jHS",
              defaultMessage: "{count}/{max} SKUs used",
              description: "created products counter",
            },
            {
              count: limits.currentUsage.productVariants,
              max: limits.allowedUsage.productVariants,
            },
          )
        }
      >
        <ButtonWithSelect
          options={extensionCreateButtonItems}
          data-test-id="add-product"
          disabled={limitReached}
          onClick={onAdd}
        >
          <FormattedMessage
            id="JFmOfi"
            defaultMessage="Create Product"
            description="button"
          />
        </ButtonWithSelect>
      </PageHeader>
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
        <ProductListDatagrid
          {...listProps}
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
      </Card>
    </Container>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
