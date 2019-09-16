import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Container } from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { sectionNames } from "@saleor/intl";
import {
  ListActions,
  PageListProps,
  SearchPageProps,
  TabPageProps
} from "@saleor/types";
import { CollectionList_collections_edges_node } from "../../types/CollectionList";
import CollectionList from "../CollectionList/CollectionList";

export interface CollectionListPageProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    TabPageProps {
  collections: CollectionList_collections_edges_node[];
}

const CollectionListPage: React.StatelessComponent<CollectionListPageProps> = ({
  currentTab,
  disabled,
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
      <PageHeader title={intl.formatMessage(sectionNames.collections)}>
        <Button
          color="primary"
          disabled={disabled}
          variant="contained"
          onClick={onAdd}
        >
          <FormattedMessage
            defaultMessage="Create collection"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <SearchBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Collections",
            description: "tab name"
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Collection"
          })}
          tabs={tabs}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <CollectionList disabled={disabled} {...listProps} />
      </Card>
    </Container>
  );
};
CollectionListPage.displayName = "CollectionListPage";
export default CollectionListPage;
