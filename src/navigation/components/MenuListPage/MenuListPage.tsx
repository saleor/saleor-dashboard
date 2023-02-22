import {
  borderHeight,
  topBarHeight,
} from "@dashboard/components/AppLayout/consts";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import { configurationMenuUrl } from "@dashboard/configuration";
import { MenuFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { menuListUrl, MenuListUrlSortField } from "@dashboard/navigation/urls";
import { ListActions, PageListProps, SortPage } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui/next";
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
    <>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage(sectionNames.navigation)}
      >
        <Button variant="primary" href={addUrl} data-test-id="add-menu">
          <FormattedMessage
            id="JXRYQg"
            defaultMessage="Create Menu"
            description="button"
          />
        </Button>
      </TopNav>
      <Box __height={`calc(100vh - ${topBarHeight} - ${borderHeight})`}>
        <MenuList {...listProps} />
      </Box>
    </>
  );
};
MenuListPage.displayName = "MenuListPage";
export default MenuListPage;
