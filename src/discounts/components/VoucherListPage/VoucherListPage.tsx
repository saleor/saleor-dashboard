import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { sectionNames } from "@saleor/intl";
import {
  ListActions,
  PageListProps,
  SearchPageProps,
  TabPageProps
} from "@saleor/types";
import { VoucherList_vouchers_edges_node } from "../../types/VoucherList";
import VoucherList from "../VoucherList";

export interface VoucherListPageProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    TabPageProps {
  defaultCurrency: string;
  vouchers: VoucherList_vouchers_edges_node[];
}

const VoucherListPage: React.StatelessComponent<VoucherListPageProps> = ({
  currentTab,
  initialSearch,
  onAdd,
  onAll,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();

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
        <SearchBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Vouchers",
            description: "tab name"
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Voucher"
          })}
          tabs={tabs}
          onAll={onAll}
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
