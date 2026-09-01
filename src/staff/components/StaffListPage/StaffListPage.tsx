import { ContextualHelpIcon } from "@dashboard/components/AppLayout/ContextualLinks/ContextualHelpIcon";
import { contextualLinks } from "@dashboard/components/AppLayout/ContextualLinks/messages";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters/ListFilters";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts/List/Root";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import { type RefreshLimitsQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { USER_PERMISSIONS_DOCS_URL } from "@dashboard/links";
import { type StaffMembers } from "@dashboard/staff/types";
import { type StaffListUrlSortField } from "@dashboard/staff/urls";
import { type FilterPagePropsWithPresets, type ListProps, type SortPage } from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StaffListDatagrid } from "../StaffListDatagrid/StaffListDatagrid";
import { type StaffFilterKeys, type StaffListFilterOpts } from "./filters";

interface StaffListPageProps
  extends ListProps,
    FilterPagePropsWithPresets<StaffFilterKeys, StaffListFilterOpts>,
    SortPage<StaffListUrlSortField> {
  limits: RefreshLimitsQuery["shop"]["limits"] | undefined;
  staffMembers: StaffMembers;
  onAdd: () => void;
}

const StaffListPage = ({
  initialSearch,
  limits,
  filterPresets,
  selectedFilterPreset,
  onAdd,
  onSearchChange,
  hasPresetsChanged,
  onFilterPresetChange,
  onFilterPresetDelete,
  onFilterPresetPresetSave,
  onFilterPresetUpdate,
  onFilterPresetsAll,
  ...listProps
}: StaffListPageProps) => {
  const intl = useIntl();
  const staffMembersHelpLabel = intl.formatMessage(contextualLinks.staffMembers, {
    userPermissions: intl.formatMessage(contextualLinks.userPermissions),
  });
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const reachedLimit = isLimitReached(limits, "staffUsers");

  return (
    <ListPageLayout>
      <TopNav
        href={configurationMenuUrl}
        hrefIcon={<TopNavDestinationIcon.configuration />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.configuration)}
        title={intl.formatMessage(sectionNames.staff)}
        isAlignToRight={false}
        withoutBorder
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
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
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" marginRight={3}>
              <ContextualHelpIcon
                href={USER_PERMISSIONS_DOCS_URL}
                label={staffMembersHelpLabel}
                analyticsType="user_permissions_docs"
                dataTestId="user-permissions-docs"
              />
            </Box>
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
      <DashboardCard>
        <ListFilters<StaffFilterKeys>
          type="expression-filter"
          initialSearch={initialSearch}
          onSearchChange={onSearchChange}
          searchPlaceholder={intl.formatMessage({
            id: "o68j+t",
            defaultMessage: "Search staff members...",
          })}
        />

        <StaffListDatagrid {...listProps} />
      </DashboardCard>
    </ListPageLayout>
  );
};

StaffListPage.displayName = "StaffListPage";
export default StaffListPage;
