import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { sectionNames } from "@saleor/intl";
import { PageListProps, SearchPageProps, TabPageProps } from "@saleor/types";
import { ServiceList_serviceAccounts_edges_node } from "../../types/ServiceList";
import ServiceList from "../ServiceList";

export interface ServiceListPageProps
  extends PageListProps,
    SearchPageProps,
    TabPageProps {
  services: ServiceList_serviceAccounts_edges_node[];
  onBack: () => void;
  onRemove: (id: string) => void;
}

const ServiceListPage: React.StatelessComponent<ServiceListPageProps> = ({
  currentTab,
  initialSearch,
  onAdd,
  onAll,
  onBack,
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
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.serviceAccounts)}>
        <Button onClick={onAdd} variant="contained" color="primary">
          <FormattedMessage
            defaultMessage="Create account"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <SearchBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Service Accounts",
            description: "tab name"
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Service Accounts"
          })}
          tabs={tabs}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <ServiceList {...listProps} />
      </Card>
    </Container>
  );
};
ServiceListPage.displayName = "ServiceListPage";
export default ServiceListPage;
