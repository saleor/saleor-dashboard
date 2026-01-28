import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { configurationMenuUrl } from "@dashboard/configuration";
import { ProductTypeFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import ProductTypeList from "@dashboard/productTypes/components/ProductTypeList/ProductTypeList";
import { productTypeAddUrl, ProductTypeListUrlSortField } from "@dashboard/productTypes/urls";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FilterPageProps, ListActions, PageListProps, SortPage } from "../../../types";
import { ProductTypeFilterKeys, ProductTypeListFilterOpts } from "./filters";

interface ProductTypeListPageProps
  extends PageListProps,
    ListActions,
    Omit<FilterPageProps<ProductTypeFilterKeys, ProductTypeListFilterOpts>, "onTabDelete">,
    SortPage<ProductTypeListUrlSortField> {
  productTypes: ProductTypeFragment[];
  onTabUpdate: (tabName: string) => void;
  onTabDelete: (id: number) => void;
  hasPresetsChanged: () => boolean;
}

const ProductTypeListPage = ({
  currentTab,
  initialSearch,
  onAll,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  onTabUpdate,
  tabs,
  hasPresetsChanged,
  disabled,
  ...listProps
}: ProductTypeListPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  return (
    <ListPageLayout>
      <TopNav
        withoutBorder
        isAlignToRight={false}
        href={configurationMenuUrl}
        title={intl.formatMessage(sectionNames.productTypes)}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
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
                id: "ivmwpV",
                defaultMessage: "All product types",
                description: "tab name",
              })}
            />
          </Box>
          <Box>
            <Button
              disabled={disabled}
              variant="primary"
              onClick={() => navigate(productTypeAddUrl())}
              data-test-id="add-product-type"
            >
              <FormattedMessage
                id="gksZwp"
                defaultMessage="Create product type"
                description="button"
              />
            </Button>
          </Box>
        </Box>
      </TopNav>

      <DashboardCard gap={0}>
        <ListFilters
          type="expression-filter"
          initialSearch={initialSearch}
          onSearchChange={onSearchChange}
          searchPlaceholder={intl.formatMessage({
            id: "Nqh0na",
            defaultMessage: "Search product types...",
            description: "Product types search input placeholder",
          })}
        />
        <DashboardCard.Content>
          <ProductTypeList {...listProps} disabled={disabled} />
        </DashboardCard.Content>
      </DashboardCard>
    </ListPageLayout>
  );
};

ProductTypeListPage.displayName = "ProductTypeListPage";
export default ProductTypeListPage;
