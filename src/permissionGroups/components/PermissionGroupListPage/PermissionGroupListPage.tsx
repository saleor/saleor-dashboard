import { Card } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import { Button } from "@saleor/components/Button";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { configurationMenuUrl } from "@saleor/configuration";
import { PermissionGroupFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageListProps, SortPage } from "../../../types";
import {
  permissionGroupAddUrl,
  PermissionGroupListUrlSortField,
} from "../../urls";
import PermissionGroupList from "../PermissionGroupList";

export interface PermissionGroupListPageProps
  extends PageListProps,
    SortPage<PermissionGroupListUrlSortField> {
  permissionGroups: PermissionGroupFragment[];
  onDelete: (id: string) => void;
}

const PermissionGroupListPage: React.FC<PermissionGroupListPageProps> = listProps => {
  const intl = useIntl();

  return (
    <Container>
      <Backlink href={configurationMenuUrl}>
        {intl.formatMessage(sectionNames.configuration)}
      </Backlink>
      <PageHeader title={intl.formatMessage(sectionNames.permissionGroups)}>
        <Button
          variant="primary"
          href={permissionGroupAddUrl}
          data-test-id="create-permission-group"
        >
          <FormattedMessage
            id="bRJD/v"
            defaultMessage="Create permission group"
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
