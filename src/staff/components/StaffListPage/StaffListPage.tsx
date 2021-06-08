import { Button, Card } from "@material-ui/core";
import Alert from "@saleor/components/Alert/Alert";
import AppHeader from "@saleor/components/AppHeader";
import { Container } from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { RefreshLimits_shop_limits } from "@saleor/components/Shop/types/RefreshLimits";
import { sectionNames } from "@saleor/intl";
import { StaffListUrlSortField } from "@saleor/staff/urls";
import {
  FilterPageProps,
  ListProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import { hasLimits, isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StaffList_staffUsers_edges_node } from "../../types/StaffList";
import StaffList from "../StaffList/StaffList";
import {
  createFilterStructure,
  StaffFilterKeys,
  StaffListFilterOpts
} from "./filters";

export interface StaffListPageProps
  extends ListProps,
    FilterPageProps<StaffFilterKeys, StaffListFilterOpts>,
    SortPage<StaffListUrlSortField>,
    TabPageProps {
  limits: RefreshLimits_shop_limits;
  staffMembers: StaffList_staffUsers_edges_node[];
  onAdd: () => void;
  onBack: () => void;
}

const StaffListPage: React.FC<StaffListPageProps> = ({
  currentTab,
  filterOpts,
  initialSearch,
  limits,
  onAdd,
  onAll,
  onBack,
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
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader
        title={intl.formatMessage(sectionNames.staff)}
        limit={
          hasLimits(limits, "staffUsers") && {
            data: limits,
            key: "staffUsers",
            text: "members"
          }
        }
      >
        <Button
          data-test-id="inviteStaffMember"
          color="primary"
          disabled={reachedLimit}
          variant="contained"
          onClick={onAdd}
        >
          <FormattedMessage
            defaultMessage="Invite staff member"
            description="button"
          />
        </Button>
      </PageHeader>
      <Alert
        title={intl.formatMessage({
          defaultMessage: "Staff Member limit reached",
          description: "alert"
        })}
        show={reachedLimit}
      >
        <FormattedMessage defaultMessage="You have reached your staff member limit, you will be no longer able to add staff members to your store. If you would like to up your limit, contact your administration staff about raising your limits." />
      </Alert>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Staff Members",
            description: "tab name"
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Staff Member"
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
