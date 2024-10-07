import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { DashboardCard } from "@dashboard/components/Card";
import { getByName } from "@dashboard/components/Filter/utils";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { saleAddUrl, SaleListUrlSortField, saleUrl } from "@dashboard/discounts/urls";
import { SaleFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import {
  ChannelProps,
  FilterPagePropsWithPresets,
  PageListProps,
  SortPage,
} from "@dashboard/types";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { SaleListDatagrid } from "../SaleListDatagrid";
import { createFilterStructure, SaleFilterKeys, SaleListFilterOpts } from "./filters";

export interface SaleListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<SaleFilterKeys, SaleListFilterOpts>,
    SortPage<SaleListUrlSortField>,
    ChannelProps {
  sales: SaleFragment[];
  selectedSaleIds: string[];
  onSalesDelete: () => void;
  onSelectSaleIds: (rows: number[], clearSelection: () => void) => void;
}

const SaleListPage: React.FC<SaleListPageProps> = ({
  filterOpts,
  initialSearch,
  onFilterChange,
  onSearchChange,
  onFilterPresetChange,
  onFilterPresetDelete,
  onFilterPresetPresetSave,
  onFilterPresetUpdate,
  onFilterPresetsAll,
  hasPresetsChanged,
  onSalesDelete,
  filterPresets,
  selectedSaleIds,
  selectedFilterPreset,
  currencySymbol,
  ...listProps
}) => {
  const intl = useIntl();
  const location = useLocation();
  const navigation = useNavigator();
  const structure = createFilterStructure(intl, filterOpts);
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const filterDependency = structure.find(getByName("channel"));
  const handleRowClick = (id: string) => {
    navigation(saleUrl(id), {
      state: {
        prevLocation: location,
      },
    });
  };

  return (
    <ListPageLayout>
      <TopNav
        isAlignToRight={false}
        withoutBorder
        title={intl.formatMessage(commonMessages.discounts)}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>

            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onFilterPresetChange}
              onRemove={onFilterPresetDelete}
              onUpdate={onFilterPresetUpdate}
              savedPresets={filterPresets}
              activePreset={selectedFilterPreset}
              onSelectAll={onFilterPresetsAll}
              onSave={onFilterPresetPresetSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "a6GDem",
                defaultMessage: "All discounts",
                description: "tab name",
              })}
            />
          </Box>
          <Box>
            <Button
              onClick={() => navigation(saleAddUrl())}
              variant="primary"
              data-test-id="create-sale"
            >
              <FormattedMessage id="+MJW+8" defaultMessage="Create Discount" description="button" />
            </Button>
          </Box>
        </Box>
      </TopNav>

      <DashboardCard>
        <ListFilters<SaleFilterKeys>
          currencySymbol={currencySymbol}
          initialSearch={initialSearch}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          filterStructure={structure}
          searchPlaceholder={intl.formatMessage({
            id: "+bhokL",
            defaultMessage: "Search discounts...",
          })}
          actions={
            <Box display="flex" gap={4}>
              {selectedSaleIds.length > 0 && (
                <BulkDeleteButton onClick={onSalesDelete}>
                  <FormattedMessage defaultMessage="Delete discounts" id="Hswqx2" />
                </BulkDeleteButton>
              )}
            </Box>
          }
        />

        <SaleListDatagrid
          {...listProps}
          hasRowHover={!isFilterPresetOpen}
          filterDependency={filterDependency}
          onRowClick={handleRowClick}
        />
      </DashboardCard>
    </ListPageLayout>
  );
};

SaleListPage.displayName = "SaleListPage";
export default SaleListPage;
