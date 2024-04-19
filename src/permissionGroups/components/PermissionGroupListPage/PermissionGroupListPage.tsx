import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { configurationMenuUrl } from "@dashboard/configuration";
import { PermissionGroupFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Card } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageListProps, SortPage } from "../../../types";
import { permissionGroupAddUrl, PermissionGroupListUrlSortField } from "../../urls";
import { PermissionGroupListDatagrid } from "../PermissionGroupListDatagrid";

export interface PermissionGroupListPageProps
  extends PageListProps,
    SortPage<PermissionGroupListUrlSortField> {
  permissionGroups: PermissionGroupFragment[];
}

const PermissionGroupListPage: React.FC<PermissionGroupListPageProps> = listProps => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <ListPageLayout>
      <TopNav
        withoutBorder
        href={configurationMenuUrl}
        title={intl.formatMessage(sectionNames.permissionGroups)}
      >
        <Button
          variant="primary"
          onClick={() => navigate(permissionGroupAddUrl)}
          data-test-id="create-permission-group"
        >
          <FormattedMessage
            id="bRJD/v"
            defaultMessage="Create permission group"
            description="button"
          />
        </Button>
      </TopNav>
      <Card>
        <PermissionGroupListDatagrid {...listProps} />
      </Card>
    </ListPageLayout>
  );
};

PermissionGroupListPage.displayName = "PermissionGroupListPage";
export default PermissionGroupListPage;
