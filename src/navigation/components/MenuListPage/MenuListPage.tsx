import Button from "@material-ui/core/Button";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { ListActions, PageListProps } from "@saleor/types";
import { MenuList_menus_edges_node } from "../../types/MenuList";
import MenuList from "../MenuList";

export interface MenuListPageProps extends PageListProps, ListActions {
  menus: MenuList_menus_edges_node[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

const MenuListPage: React.StatelessComponent<MenuListPageProps> = ({
  disabled,
  onAdd,
  onBack,
  ...listProps
}) => {
  const intl = useIntl();
  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.navigation)}>
        <Button
          color="primary"
          disabled={disabled}
          variant="contained"
          onClick={onAdd}
        >
          <FormattedMessage
            defaultMessage="Create Menu"
            description="button"
            id="menuListPageAddMenu"
          />
        </Button>
      </PageHeader>
      <MenuList disabled={disabled} {...listProps} />
    </Container>
  );
};
MenuListPage.displayName = "MenuListPage";
export default MenuListPage;
