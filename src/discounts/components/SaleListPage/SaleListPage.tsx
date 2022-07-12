import { Card } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import Container from "@saleor/components/Container";
import { getByName } from "@saleor/components/Filter/utils";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { saleAddUrl, SaleListUrlSortField } from "@saleor/discounts/urls";
import { SaleFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import {
  ChannelProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps,
} from "@saleor/types";
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
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.sales)}>
        <Button
          href={saleAddUrl()}
          variant="primary"
          data-test-id="create-sale"
        >
          <FormattedMessage
            id="JHfbXR"
            defaultMessage="Create Sale"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            id: "Yjhgle",
            defaultMessage: "All Sales",
            description: "tab name",
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "MSD3A/",
            defaultMessage: "Search Sale",
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
    </Container>
  );
};
SaleListPage.displayName = "SaleListPage";
export default SaleListPage;
