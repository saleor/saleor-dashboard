import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { MenuFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { menuListUrl, MenuListUrlSortField } from "@dashboard/structures/urls";
import { ListActions, PageListProps, SortPage } from "@dashboard/types";
import { Box, Button, ChevronRightIcon, Text } from "@saleor/macaw-ui-next";
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
  const navigate = useNavigator();

  const handleCreateMenu = () => {
    navigate(menuListUrl({ action: "add" }));
  };

  return (
    <ListPageLayout>
      <TopNav
        title={intl.formatMessage(sectionNames.structures)}
        isAlignToRight={false}
        withoutBorder
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={5} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>
            <Text size={6}>
              <FormattedMessage
                id="vDp2tH"
                defaultMessage="All structures"
                description="all structures"
              />
            </Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Button onClick={handleCreateMenu} variant="primary" data-test-id="add-menu">
              <FormattedMessage
                id="0dCGBW"
                defaultMessage="Create structure"
                description="button"
              />
            </Button>
          </Box>
        </Box>
      </TopNav>
      <MenuList {...listProps} />
    </ListPageLayout>
  );
};

MenuListPage.displayName = "MenuListPage";
export default MenuListPage;
