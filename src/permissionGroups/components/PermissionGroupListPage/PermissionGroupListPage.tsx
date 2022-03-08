import { Card } from "@material-ui/core";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { PermissionGroupFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { Backlink, Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageListProps, SortPage } from "../../../types";
import { PermissionGroupListUrlSortField } from "../../urls";
import PermissionGroupList from "../PermissionGroupList";

export interface PermissionGroupListPageProps
  extends PageListProps,
    SortPage<PermissionGroupListUrlSortField> {
  permissionGroups: PermissionGroupFragment[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onRowClick: (id: string) => () => void;
}

const PermissionGroupListPage: React.FC<PermissionGroupListPageProps> = ({
  onAdd,
  onBack,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </Backlink>
      <PageHeader title={intl.formatMessage(sectionNames.permissionGroups)}>
        <Button
          variant="primary"
          onClick={onAdd}
          data-test-id="create-permission-group"
        >
          <FormattedMessage
            defaultMessage="create permission group"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <PermissionGroupList {...listProps} />
      </Card>
    </Container>
  );
};
PermissionGroupListPage.displayName = "PermissionGroupListPage";
export default PermissionGroupListPage;
