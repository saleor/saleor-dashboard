import { ExpressionFilters } from "@dashboard/components/AppLayout/ListFilters/components/ExpressionFilters";
import { LegacyFiltersPresetsAlert } from "@dashboard/components/AppLayout/ListFilters/components/LegacyFiltersPresetsAlert";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import {
  discountAddUrl,
  DiscountListUrlSortField,
  discountUrl,
} from "@dashboard/discounts/discountsUrls";
import { PromotionFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { FilterPresetsProps, PageListProps, SortPage } from "@dashboard/types";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { DiscountListDatagrid } from "../DiscountListDatagrid";

export interface DiscountListPageProps
  extends PageListProps,
    FilterPresetsProps,
    SortPage<DiscountListUrlSortField> {
  onSearchChange: (query: string) => void;
  initialSearch: string;
  promotions: PromotionFragment[];
}

const DiscountListPage: React.FC<DiscountListPageProps> = ({
  initialSearch,
  onSearchChange,
  onFilterPresetChange,
  onFilterPresetDelete,
  onFilterPresetPresetSave,
  onFilterPresetUpdate,
  onFilterPresetsAll,
  hasPresetsChanged,
  filterPresets,
  selectedFilterPreset,

  ...listProps
}) => {
  const intl = useIntl();
  const navigation = useNavigator();
  const location = useLocation();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const handleRowClick = (id: string) => {
    navigation(discountUrl(id), {
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
              onClick={() => navigation(discountAddUrl())}
              variant="primary"
              data-test-id="create-sale"
            >
              <FormattedMessage id="+MJW+8" defaultMessage="Create Discount" description="button" />
            </Button>
          </Box>
        </Box>
      </TopNav>

      <DashboardCard>
        <LegacyFiltersPresetsAlert />
        <Box display="grid" __gridTemplateColumns="auto 1fr" gap={4} paddingBottom={2} paddingX={6}>
          <Box display="flex" alignItems="center" gap={4}>
            <ExpressionFilters data-test-id="filters-button" />
            <Box __width="320px">
              <SearchInput
                initialSearch={initialSearch}
                placeholder={intl.formatMessage({
                  id: "+bhokL",
                  defaultMessage: "Search discounts...",
                })}
                onSearchChange={onSearchChange}
              />
            </Box>
          </Box>
        </Box>

        <DiscountListDatagrid {...listProps} onRowClick={handleRowClick} />
      </DashboardCard>
    </ListPageLayout>
  );
};

DiscountListPage.displayName = "SaleListPage";
export default DiscountListPage;
