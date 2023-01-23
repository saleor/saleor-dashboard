import { Backlink } from "@dashboard/components/Backlink";
import { Button } from "@dashboard/components/Button";
import Container from "@dashboard/components/Container";
import PageHeader from "@dashboard/components/PageHeader";
import { configurationMenuUrl } from "@dashboard/configuration";
import { MenuFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { menuListUrl, MenuListUrlSortField } from "@dashboard/navigation/urls";
import { ListActions, PageListProps, SortPage } from "@dashboard/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import MenuList from "../MenuList";

export interface MenuListPageProps
  extends PageListProps,
    ListActions,
    SortPage<MenuListUrlSortField> {
  menus: MenuFragment[];
  onDelete: (id: string) => void;
}

const MenuListPage: React.FC<MenuListPageProps> = ({ ...listProps }) => {
  const intl = useIntl();
  const addUrl = menuListUrl({
    action: "add",
  });

  return (
    <Container>
      <Backlink href={configurationMenuUrl}>
        {intl.formatMessage(sectionNames.configuration)}
      </Backlink>
      <PageHeader title={intl.formatMessage(sectionNames.navigation)}>
        <Button variant="primary" href={addUrl} data-test-id="add-menu">
          <FormattedMessage
            id="JXRYQg"
            defaultMessage="Create Menu"
            description="button"
          />
        </Button>
      </PageHeader>
      <MenuList {...listProps} />
    </Container>
  );
};
MenuListPage.displayName = "MenuListPage";
export default MenuListPage;
