import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import SearchBar from "@saleor/components/SearchBar";
import { sectionNames } from "@saleor/intl";
import Container from "../../../components/Container";
import PageHeader from "../../../components/PageHeader";
import {
  ListActions,
  PageListProps,
  SearchPageProps,
  TabPageProps
} from "../../../types";
import { AttributeList_attributes_edges_node } from "../../types/AttributeList";
import AttributeList from "../AttributeList/AttributeList";

export interface AttributeListPageProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    TabPageProps {
  attributes: AttributeList_attributes_edges_node[];
  onBack: () => void;
}

const AttributeListPage: React.FC<AttributeListPageProps> = ({
  onAdd,
  onBack,
  initialSearch,
  onSearchChange,
  currentTab,
  onAll,
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
        <FormattedMessage {...sectionNames.configuration} />
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.attributes)}>
        <Button onClick={onAdd} color="primary" variant="contained">
          <FormattedMessage
            defaultMessage="Create attribute"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <SearchBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Attributes",
            description: "tab name"
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Attribute"
          })}
          tabs={tabs}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <AttributeList {...listProps} />
      </Card>
    </Container>
  );
};
AttributeListPage.displayName = "AttributeListPage";
export default AttributeListPage;
