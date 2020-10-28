import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { CollectionListUrlSortField } from "@saleor/collections/urls";
import CardMenu from "@saleor/components/CardMenu";
import { Container } from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { sectionNames } from "@saleor/intl";
import {
  ListActions,
  PageListProps,
  SearchPageProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CollectionList_collections_edges_node } from "../../types/CollectionList";
import CollectionList from "../CollectionList/CollectionList";

export interface CollectionListPageProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    SortPage<CollectionListUrlSortField>,
    TabPageProps {
  collections: CollectionList_collections_edges_node[];
  channelsCount: number;
  selectedChannel: string;
  onSettingsOpen?: () => void;
}

const useStyles = makeStyles(
  theme => ({
    settings: {
      marginRight: theme.spacing(2)
    }
  }),
  { name: "CollectionListPage" }
);

const CollectionListPage: React.FC<CollectionListPageProps> = ({
  channelsCount,
  currentTab,
  disabled,
  initialSearch,
  onAdd,
  onAll,
  onSearchChange,
  onSettingsOpen,
  onTabChange,
  onTabDelete,
  onTabSave,
  selectedChannel,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.collections)}>
        {!!onSettingsOpen && (
          <CardMenu
            className={classes.settings}
            menuItems={[
              {
                label: intl.formatMessage({
                  defaultMessage: "Settings",
                  description: "button"
                }),
                onSelect: onSettingsOpen
              }
            ]}
          />
        )}
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
        <CollectionList
          disabled={disabled}
          channelsCount={channelsCount}
          selectedChannel={selectedChannel}
          {...listProps}
        />
      </Card>
    </Container>
  );
};
CollectionListPage.displayName = "CollectionListPage";
export default CollectionListPage;
