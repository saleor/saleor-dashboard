// @ts-strict-ignore
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { getByName } from "@dashboard/components/Filter/utils";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { voucherAddUrl, VoucherListUrlSortField } from "@dashboard/discounts/urls";
import { VoucherFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  ChannelProps,
  FilterPagePropsWithPresets,
  PageListProps,
  SortPage,
} from "@dashboard/types";
import { Card } from "@material-ui/core";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { VoucherListDatagrid } from "../VoucherListDatagrid";
import { createFilterStructure, VoucherFilterKeys, VoucherListFilterOpts } from "./filters";

export interface VoucherListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<VoucherFilterKeys, VoucherListFilterOpts>,
    SortPage<VoucherListUrlSortField>,
    ChannelProps {
  vouchers: VoucherFragment[];
  selectedVouchersIds: string[];
  onVoucherDelete: () => void;
  onSelectVouchersIds: (rows: number[], clearSelection: () => void) => void;
}
const VoucherListPage: React.FC<VoucherListPageProps> = ({
  filterOpts,
  initialSearch,
  onFilterChange,
  onSearchChange,
  hasPresetsChanged,
  onFilterPresetChange,
  onFilterPresetDelete,
  onFilterPresetPresetSave,
  onFilterPresetUpdate,
  onFilterPresetsAll,
  filterPresets,
  selectedFilterPreset,
  onVoucherDelete,
  selectedVouchersIds,
  currencySymbol,
  ...listProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const structure = createFilterStructure(intl, filterOpts);
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const filterDependency = structure.find(getByName("channel"));

  return (
    <ListPageLayout>
      <TopNav
        title={intl.formatMessage(sectionNames.vouchers)}
        withoutBorder
        isAlignToRight={false}
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
                id: "pOUOnw",
                defaultMessage: "All vouchers",
                description: "tab name",
              })}
            />
          </Box>
          <Box>
            <Button
              onClick={() => navigate(voucherAddUrl())}
              variant="primary"
              data-test-id="create-voucher"
            >
              <FormattedMessage id="GbhZJ4" defaultMessage="Create voucher" description="button" />
            </Button>
          </Box>
        </Box>
      </TopNav>
      <Card>
        <ListFilters<VoucherFilterKeys>
          currencySymbol={currencySymbol}
          initialSearch={initialSearch}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          filterStructure={structure}
          searchPlaceholder={intl.formatMessage({
            id: "bPshhv",
            defaultMessage: "Search vouchers...",
          })}
          actions={
            <Box display="flex" gap={4}>
              {selectedVouchersIds.length > 0 && (
                <BulkDeleteButton onClick={onVoucherDelete}>
                  <FormattedMessage defaultMessage="Delete vouchers" id="lfXze9" />
                </BulkDeleteButton>
              )}
            </Box>
          }
        />

        <VoucherListDatagrid filterDependency={filterDependency} {...listProps} />
      </Card>
    </ListPageLayout>
  );
};
VoucherListPage.displayName = "VoucherListPage";
export default VoucherListPage;
