// @ts-strict-ignore
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DashboardCard } from "@dashboard/components/Card";
import { getByName } from "@dashboard/components/Filter/utils";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { voucherAddUrl, VoucherListUrlSortField } from "@dashboard/discounts/urls";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForVoucherOverviewActions,
} from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { VoucherFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  ChannelProps,
  FilterPagePropsWithPresets,
  PageListProps,
  SortPage,
} from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { VoucherListDatagrid } from "../VoucherListDatagrid";
import { createFilterStructure, VoucherFilterKeys, VoucherListFilterOpts } from "./filters";

interface VoucherListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<VoucherFilterKeys, VoucherListFilterOpts>,
    SortPage<VoucherListUrlSortField>,
    ChannelProps {
  vouchers: VoucherFragment[];
  selectedVouchersIds: string[];
  onVoucherDelete: () => void;
  onSelectVouchersIds: (rows: number[], clearSelection: () => void) => void;
}

const VoucherListPage = ({
  filterOpts,
  initialSearch,
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
  ...listProps
}: VoucherListPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const structure = createFilterStructure(intl, filterOpts);
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const filterDependency = structure.find(getByName("channel"));

  const { VOUCHER_OVERVIEW_CREATE, VOUCHER_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.VOUCHER_LIST,
  );
  const extensionMenuItems = getExtensionsItemsForVoucherOverviewActions(
    VOUCHER_OVERVIEW_MORE_ACTIONS,
    selectedVouchersIds,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(VOUCHER_OVERVIEW_CREATE);

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
              <ChevronRight />
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
          <Box display="flex" alignItems="center" gap={2}>
            {extensionMenuItems.length > 0 && <TopNav.Menu items={extensionMenuItems} />}

            {extensionCreateButtonItems.length > 0 ? (
              <ButtonGroupWithDropdown
                options={extensionCreateButtonItems}
                data-test-id="create-voucher"
                onClick={() => navigate(voucherAddUrl())}
              >
                <FormattedMessage
                  id="GbhZJ4"
                  defaultMessage="Create voucher"
                  description="button"
                />
              </ButtonGroupWithDropdown>
            ) : (
              <Button data-test-id="create-voucher" onClick={() => navigate(voucherAddUrl())}>
                <FormattedMessage
                  id="GbhZJ4"
                  defaultMessage="Create voucher"
                  description="button"
                />
              </Button>
            )}
          </Box>
        </Box>
      </TopNav>
      <DashboardCard>
        <ListFilters
          type="expression-filter"
          initialSearch={initialSearch}
          onSearchChange={onSearchChange}
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
      </DashboardCard>
    </ListPageLayout>
  );
};

VoucherListPage.displayName = "VoucherListPage";
export default VoucherListPage;
