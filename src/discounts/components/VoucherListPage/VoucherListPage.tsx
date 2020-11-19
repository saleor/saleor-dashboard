import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { VoucherListUrlSortField } from "@saleor/discounts/urls";
import { sectionNames } from "@saleor/intl";
import {
  ChannelProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { VoucherList_vouchers_edges_node } from "../../types/VoucherList";
import VoucherList from "../VoucherList";
import {
  createFilterStructure,
  VoucherFilterKeys,
  VoucherListFilterOpts
} from "./filters";

export interface VoucherListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<VoucherFilterKeys, VoucherListFilterOpts>,
    SortPage<VoucherListUrlSortField>,
    TabPageProps,
    ChannelProps {
  vouchers: VoucherList_vouchers_edges_node[];
}
const VoucherListPage: React.FC<VoucherListPageProps> = ({
  currentTab,
  filterOpts,
  initialSearch,
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

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.vouchers)}>
        <Button onClick={onAdd} variant="contained" color="primary">
          <FormattedMessage
            defaultMessage="Create voucher"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Vouchers",
            description: "tab name"
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Voucher"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <VoucherList {...listProps} />
      </Card>
    </Container>
  );
};
VoucherListPage.displayName = "VoucherListPage";
export default VoucherListPage;
