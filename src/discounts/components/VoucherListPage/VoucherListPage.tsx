// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import { getByName } from "@dashboard/components/Filter/utils";
import FilterBar from "@dashboard/components/FilterBar";
import { ListPageLayout } from "@dashboard/components/Layouts";
import {
  voucherAddUrl,
  VoucherListUrlSortField,
} from "@dashboard/discounts/urls";
import { VoucherFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import {
  ChannelProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps,
} from "@dashboard/types";
import { Card } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import VoucherList from "../VoucherList";
import {
  createFilterStructure,
  VoucherFilterKeys,
  VoucherListFilterOpts,
} from "./filters";

export interface VoucherListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<VoucherFilterKeys, VoucherListFilterOpts>,
    SortPage<VoucherListUrlSortField>,
    TabPageProps,
    ChannelProps {
  vouchers: VoucherFragment[];
}
const VoucherListPage: React.FC<VoucherListPageProps> = ({
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

  const filterDependency = structure.find(getByName("channel"));

  return (
    <ListPageLayout>
      <TopNav title={intl.formatMessage(sectionNames.vouchers)}>
        <Button
          href={voucherAddUrl()}
          variant="primary"
          data-test-id="create-voucher"
        >
          <FormattedMessage
            id="GbhZJ4"
            defaultMessage="Create voucher"
            description="button"
          />
        </Button>
      </TopNav>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            id: "pNrF72",
            defaultMessage: "All Vouchers",
            description: "tab name",
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "IruP2T",
            defaultMessage: "Search Voucher",
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <VoucherList filterDependency={filterDependency} {...listProps} />
      </Card>
    </ListPageLayout>
  );
};
VoucherListPage.displayName = "VoucherListPage";
export default VoucherListPage;
