import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { sectionNames } from "@saleor/intl";
import { MenuItemMoveInput } from "@saleor/types/globalTypes";
import { maybe } from "../../../misc";
import { MenuDetails_menu } from "../../types/MenuDetails";
import { MenuItemType } from "../MenuItemDialog";
import MenuItems, { TreeOperation } from "../MenuItems";
import MenuProperties from "../MenuProperties";

export interface MenuDetailsFormData {
  name: string;
}

export interface MenuDetailsPageProps {
  saveButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  menu: MenuDetails_menu;
  onBack: () => void;
  onDelete: () => void;
  onItemAdd: () => void;
  onItemClick: (id: string, type: MenuItemType) => void;
  onItemDelete: (id: string) => void;
  onItemEdit: (id: string) => void;
  onItemMove: (move: MenuItemMoveInput) => void;
  onSubmit: (data: MenuDetailsFormData) => void;
}

const MenuDetailsPage: React.FC<MenuDetailsPageProps> = ({
  disabled,
  menu,
  saveButtonState,
  onBack,
  onDelete,
  onItemAdd,
  onItemClick,
  onItemDelete,
  onItemEdit,
  onItemMove,
  onSubmit
}) => {
  const intl = useIntl();

  const initialForm: MenuDetailsFormData = {
    name: maybe(() => menu.name, "")
  };

  const handleSubmit = (data: MenuDetailsFormData) => onSubmit(data);

  const handleItemMove = (operation: TreeOperation) =>
    onItemMove({
      itemId: operation.id,
      parentId: operation.parentId,
      sortOrder: operation.sortOrder
    });

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.navigation)}
          </AppHeader>
          <Grid variant="inverted">
            <div>
              <Typography variant="h5">
                {intl.formatMessage(sectionNames.navigation)}
              </Typography>
              <Typography>
                <FormattedMessage
                  defaultMessage="Creating the navigation structure is done by dragging and dropping. Simply create a new menu item and then drag it into its destined place. You can move items inside one another to create a tree structure and drag items up and down to create a hierarchy"
                  id="menuDetailsPageHelperText"
                />
              </Typography>
            </div>
            <div>
              <MenuProperties
                data={data}
                disabled={disabled}
                onChange={change}
              />
              <CardSpacer />
              <MenuItems
                items={maybe(() => menu.items)}
                onItemAdd={onItemAdd}
                onItemClick={onItemClick}
                onItemDelete={onItemDelete}
                onItemEdit={onItemEdit}
                onItemMove={handleItemMove}
              />
            </div>
          </Grid>
          <SaveButtonBar
            disabled={disabled || !hasChanged}
            onCancel={onBack}
            onDelete={onDelete}
            onSave={submit}
            state={saveButtonState}
          />
        </Container>
      )}
    </Form>
  );
};
MenuDetailsPage.displayName = "MenuDetailsPage";
export default MenuDetailsPage;
