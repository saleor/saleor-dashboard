import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Container } from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { ListActions, PageListProps } from "@saleor/types";
import { CollectionList_collections_edges_node } from "../../types/CollectionList";
import CollectionList from "../CollectionList/CollectionList";

export interface CollectionListPageProps extends PageListProps, ListActions {
  collections: CollectionList_collections_edges_node[];
}

const CollectionListPage: React.StatelessComponent<CollectionListPageProps> = ({
  disabled,
  onAdd,
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
          <FormattedMessage defaultMessage="Add collection"
            description="button"
             />
          <AddIcon />
        </Button>
      </PageHeader>
      <CollectionList disabled={disabled} {...listProps} />
    </Container>
  );
};
CollectionListPage.displayName = "CollectionListPage";
export default CollectionListPage;
