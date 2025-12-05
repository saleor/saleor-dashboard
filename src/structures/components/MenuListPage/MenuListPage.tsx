import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForMenuOverviewActions,
} from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { MenuFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { menuListUrl, MenuListUrlSortField } from "@dashboard/structures/urls";
import { ListActions, PageListProps, SortPage } from "@dashboard/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import MenuList from "../MenuList";

interface MenuListPageProps extends PageListProps, ListActions, SortPage<MenuListUrlSortField> {
  menus: MenuFragment[];
  onDelete: (id: string) => void;
  selectedMenuIds: string[];
}

const MenuListPage = ({ selectedMenuIds, ...listProps }: MenuListPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const handleCreateMenu = () => {
    navigate(menuListUrl({ action: "add" }));
  };

  const { MENU_OVERVIEW_CREATE, MENU_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.MENU_LIST,
  );

  const extensionMenuItems = getExtensionsItemsForMenuOverviewActions(
    MENU_OVERVIEW_MORE_ACTIONS,
    selectedMenuIds,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(MENU_OVERVIEW_CREATE);

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
              <ChevronRight />
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
            {extensionMenuItems.length > 0 && <TopNav.Menu items={extensionMenuItems} />}
            {extensionCreateButtonItems.length > 0 ? (
              <ButtonGroupWithDropdown
                options={extensionCreateButtonItems}
                onClick={handleCreateMenu}
                data-test-id="add-menu"
              >
                <FormattedMessage
                  id="0dCGBW"
                  defaultMessage="Create structure"
                  description="button"
                />
              </ButtonGroupWithDropdown>
            ) : (
              <Button onClick={handleCreateMenu} variant="primary" data-test-id="add-menu">
                <FormattedMessage
                  id="0dCGBW"
                  defaultMessage="Create structure"
                  description="button"
                />
              </Button>
            )}
          </Box>
        </Box>
      </TopNav>
      <MenuList {...listProps} />
    </ListPageLayout>
  );
};

export default MenuListPage;
