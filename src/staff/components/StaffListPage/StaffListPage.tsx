import { Card } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import { Button } from "@saleor/components/Button";
import { Container } from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import LimitReachedAlert from "@saleor/components/LimitReachedAlert";
import PageHeader from "@saleor/components/PageHeader";
import { configurationMenuUrl } from "@saleor/configuration";
import { RefreshLimitsQuery, StaffListQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { StaffListUrlSortField } from "@saleor/staff/urls";
import {
  FilterPageProps,
  ListProps,
  RelayToFlat,
  SortPage,
  TabPageProps,
} from "@saleor/types";
import { hasLimits, isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import StaffList from "../StaffList/StaffList";
import {
  createFilterStructure,
  StaffFilterKeys,
  StaffListFilterOpts,
} from "./filters";

export interface StaffListPageProps
  extends ListProps,
    FilterPageProps<StaffFilterKeys, StaffListFilterOpts>,
    SortPage<StaffListUrlSortField>,
    TabPageProps {
  limits: RefreshLimitsQuery["shop"]["limits"];
  staffMembers: RelayToFlat<StaffListQuery["staffUsers"]>;
  onAdd: () => void;
}

const StaffListPage: React.FC<StaffListPageProps> = ({
  currentTab,
  filterOpts,
  initialSearch,
  limits,
  onAdd,
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
  const reachedLimit = isLimitReached(limits, "staffUsers");

  return (
    <Container>
      <Backlink href={configurationMenuUrl}>
        {intl.formatMessage(sectionNames.configuration)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(sectionNames.staff)}
        limitText={
          hasLimits(limits, "staffUsers") &&
          intl.formatMessage(
            {
              id: "9xlPgt",
              defaultMessage: "{count}/{max} members",
              description: "used staff users counter",
            },
            {
              count: limits.currentUsage.staffUsers,
              max: limits.allowedUsage.staffUsers,
            },
          )
        }
      >
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
      </PageHeader>
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
        <FilterBar
          allTabLabel={intl.formatMessage({
            id: "YJ4TXc",
            defaultMessage: "All Staff Members",
            description: "tab name",
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "aDbrOK",
            defaultMessage: "Search Staff Member",
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <StaffList {...listProps} />
      </Card>
    </Container>
  );
};
StaffListPage.displayName = "StaffListPage";
export default StaffListPage;
