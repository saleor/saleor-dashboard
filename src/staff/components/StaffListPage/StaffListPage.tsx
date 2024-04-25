import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import { configurationMenuUrl } from "@dashboard/configuration";
import { RefreshLimitsQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { StaffMembers } from "@dashboard/staff/types";
import { StaffListUrlSortField } from "@dashboard/staff/urls";
import { FilterPagePropsWithPresets, ListProps, SortPage } from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { Card } from "@material-ui/core";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StaffListDatagrid } from "../StaffListDatagrid";
import { createFilterStructure, StaffFilterKeys, StaffListFilterOpts } from "./filters";

export interface StaffListPageProps
  extends ListProps,
    FilterPagePropsWithPresets<StaffFilterKeys, StaffListFilterOpts>,
    SortPage<StaffListUrlSortField> {
  limits: RefreshLimitsQuery["shop"]["limits"] | undefined;
  staffMembers: StaffMembers;
  onAdd: () => void;
}

const StaffListPage: React.FC<StaffListPageProps> = ({
  filterOpts,
  initialSearch,
  limits,
  currencySymbol,
  filterPresets,
  selectedFilterPreset,
  onAdd,
  onFilterChange,
  onSearchChange,
  hasPresetsChanged,
  onFilterPresetChange,
  onFilterPresetDelete,
  onFilterPresetPresetSave,
  onFilterPresetUpdate,
  onFilterPresetsAll,
  ...listProps
}) => {
  const intl = useIntl();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const structure = createFilterStructure(intl, filterOpts);
  const reachedLimit = isLimitReached(limits, "staffUsers");

  return (
    <ListPageLayout>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage(sectionNames.staff)}
        isAlignToRight={false}
        withoutBorder
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
                id: "OTDo9I",
                defaultMessage: "All staff members",
                description: "tab name",
              })}
            />
          </Box>
          <Box>
            <Button
              data-test-id="invite-staff-member"
              disabled={reachedLimit}
              variant="primary"
              onClick={onAdd}
            >
              <FormattedMessage
                id="4JcNaA"
                defaultMessage="Invite staff member"
                description="button"
              />
            </Button>
          </Box>
        </Box>
      </TopNav>
      {hasLimits(limits, "staffUsers") && (
        <Box gridColumn="8" marginLeft={6} marginBottom={reachedLimit ? 0 : 3}>
          {intl.formatMessage(
            {
              id: "9xlPgt",
              defaultMessage: "{count}/{max} members",
              description: "used staff users counter",
            },
            {
              count: limits?.currentUsage?.staffUsers ?? 0,
              max: limits?.allowedUsage?.staffUsers ?? 0,
            },
          )}
        </Box>
      )}
      {reachedLimit && (
        <LimitReachedAlert
          title={intl.formatMessage({
            id: "pA8Mlv",
            defaultMessage: "Staff Member limit reached",
            description: "alert",
          })}
        >
          <FormattedMessage
            id="OaA0f9"
            defaultMessage="You have reached your staff member limit, you will be no longer able to add staff members to your store. If you would like to up your limit, contact your administration staff about raising your limits."
          />
        </LimitReachedAlert>
      )}
      <Card>
        <ListFilters<StaffFilterKeys>
          currencySymbol={currencySymbol}
          initialSearch={initialSearch}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          filterStructure={structure}
          searchPlaceholder={intl.formatMessage({
            id: "o68j+t",
            defaultMessage: "Search staff members...",
          })}
        />

        <StaffListDatagrid {...listProps} />
      </Card>
    </ListPageLayout>
  );
};

StaffListPage.displayName = "StaffListPage";
export default StaffListPage;
