import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { Backlink, Button } from "@saleor/macaw-ui";
import { MenuListUrlSortField } from "@saleor/navigation/urls";
import { ListActions, PageListProps, SortPage } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { MenuList_menus_edges_node } from "../../types/MenuList";
import MenuList from "../MenuList";

export interface MenuListPageProps
  extends PageListProps,
    ListActions,
    SortPage<MenuListUrlSortField> {
  menus: MenuList_menus_edges_node[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

const MenuListPage: React.FC<MenuListPageProps> = ({
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
      <PageHeader title={intl.formatMessage(sectionNames.navigation)}>
        <Button variant="primary" onClick={onAdd} data-test-id="addMenu">
          <FormattedMessage
            defaultMessage="Create Menu"
            description="button"
            id="menuListPageAddMenu"
          />
        </Button>
      </PageHeader>
      <MenuList {...listProps} />
    </Container>
  );
};
MenuListPage.displayName = "MenuListPage";
export default MenuListPage;
