import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { AttributeListUrlSortField } from "@saleor/attributes/urls";
import AppHeader from "@saleor/components/AppHeader";
import FilterBar from "@saleor/components/FilterBar";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Container from "../../../components/Container";
import PageHeader from "../../../components/PageHeader";
import {
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps
} from "../../../types";
import { AttributeList_attributes_edges_node } from "../../types/AttributeList";
import AttributeList from "../AttributeList/AttributeList";
import {
  AttributeFilterKeys,
  AttributeListFilterOpts,
  createFilterStructure
} from "./filters";

export interface AttributeListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<AttributeFilterKeys, AttributeListFilterOpts>,
    SortPage<AttributeListUrlSortField>,
    TabPageProps {
  attributes: AttributeList_attributes_edges_node[];
  onBack: () => void;
}

const AttributeListPage: React.FC<AttributeListPageProps> = ({
  filterOpts,
  initialSearch,
  onAdd,
  onBack,
  onFilterChange,
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

  const structure = createFilterStructure(intl, filterOpts);

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
        <FilterBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Attributes",
            description: "tab name"
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Attribute"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
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
