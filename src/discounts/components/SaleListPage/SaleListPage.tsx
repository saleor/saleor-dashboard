// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import { getByName } from "@dashboard/components/Filter/utils";
import FilterBar from "@dashboard/components/FilterBar";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { saleAddUrl, SaleListUrlSortField } from "@dashboard/discounts/urls";
import { SaleFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
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

import SaleList from "../SaleList";
import {
  createFilterStructure,
  SaleFilterKeys,
  SaleListFilterOpts,
} from "./filters";

export interface SaleListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<SaleFilterKeys, SaleListFilterOpts>,
    SortPage<SaleListUrlSortField>,
    TabPageProps,
    ChannelProps {
  sales: SaleFragment[];
}

const SaleListPage: React.FC<SaleListPageProps> = ({
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
      <TopNav title={intl.formatMessage(commonMessages.discounts)}>
        <Button
          href={saleAddUrl()}
          variant="primary"
          data-test-id="create-sale"
        >
          <FormattedMessage
            id="+MJW+8"
            defaultMessage="Create Discount"
            description="button"
          />
        </Button>
      </TopNav>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            id: "c8zJID",
            defaultMessage: "All Discounts",
            description: "tab name",
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "lit2zF",
            defaultMessage: "Search Discounts",
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <SaleList filterDependency={filterDependency} {...listProps} />
      </Card>
    </ListPageLayout>
  );
};
SaleListPage.displayName = "SaleListPage";
export default SaleListPage;
