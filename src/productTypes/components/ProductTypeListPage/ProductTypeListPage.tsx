// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import FilterBar from "@dashboard/components/FilterBar";
import { configurationMenuUrl } from "@dashboard/configuration";
import { ProductTypeFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import ProductTypeList from "@dashboard/productTypes/components/ProductTypeList/ProductTypeList";
import { productTypeAddUrl, ProductTypeListUrlSortField } from "@dashboard/productTypes/urls";
import { Card } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps,
} from "../../../types";
import { createFilterStructure, ProductTypeFilterKeys, ProductTypeListFilterOpts } from "./filters";

export interface ProductTypeListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<ProductTypeFilterKeys, ProductTypeListFilterOpts>,
    SortPage<ProductTypeListUrlSortField>,
    TabPageProps {
  productTypes: ProductTypeFragment[];
}

const ProductTypeListPage: React.FC<ProductTypeListPageProps> = ({
  currentTab,
  filterOpts,
  initialSearch,
  onAll,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();
  const structure = createFilterStructure(intl, filterOpts);

  return (
    <>
      <TopNav href={configurationMenuUrl} title={intl.formatMessage(sectionNames.productTypes)}>
        <Button variant="primary" href={productTypeAddUrl()} data-test-id="add-product-type">
          <FormattedMessage id="gksZwp" defaultMessage="Create product type" description="button" />
        </Button>
      </TopNav>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            id: "1KSqnn",
            defaultMessage: "All Product Types",
            description: "tab name",
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "rpFdD1",
            defaultMessage: "Search Product Type",
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <ProductTypeList {...listProps} />
      </Card>
    </>
  );
};
ProductTypeListPage.displayName = "ProductTypeListPage";
export default ProductTypeListPage;
