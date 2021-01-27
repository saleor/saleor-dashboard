import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { MenuErrorFragment } from "@saleor/fragments/types/MenuErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { MenuDetails_menu } from "../../types/MenuDetails";
import { MenuItemType } from "../MenuItemDialog";
import MenuItems, { TreeOperation } from "../MenuItems";
import MenuProperties from "../MenuProperties";
import { computeTree } from "./tree";

export interface MenuDetailsFormData {
  name: string;
}

export interface MenuDetailsSubmitData extends MenuDetailsFormData {
  operations: TreeOperation[];
}

export interface MenuDetailsPageProps {
  saveButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: MenuErrorFragment[];
  menu: MenuDetails_menu;
  onBack: () => void;
  onDelete: () => void;
  onItemAdd: () => void;
  onItemClick: (id: string, type: MenuItemType) => void;
  onItemEdit: (id: string) => void;
  onSubmit: (data: MenuDetailsSubmitData) => SubmitPromise;
}

const MenuDetailsPage: React.FC<MenuDetailsPageProps> = ({
  disabled,
  errors,
  menu,
  saveButtonState,
  onBack,
  onDelete,
  onItemAdd,
  onItemClick,
  onItemEdit,
  onSubmit
}) => {
  const intl = useIntl();

  const initialForm: MenuDetailsFormData = {
    name: maybe(() => menu.name, "")
  };

  const [treeOperations, setTreeOperations] = React.useState<TreeOperation[]>(
    []
  );

  const handleSubmit = async (data: MenuDetailsFormData) => {
    const result = await onSubmit({
      name: data.name,
      operations: treeOperations
    });

    if (result) {
      setTreeOperations([]);
    }

    return result;
  };

  const handleChange = (operation: TreeOperation) => {
    if (!!operation) {
      setTreeOperations([...treeOperations, operation]);
    }
  };

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
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <MenuItems
                canUndo={treeOperations.length > 0}
                items={maybe(() =>
                  computeTree(menu.items, [...treeOperations])
                )}
                onChange={handleChange}
                onItemAdd={onItemAdd}
                onItemClick={onItemClick}
                onItemEdit={onItemEdit}
                onUndo={() =>
                  setTreeOperations(
                    treeOperations.slice(0, treeOperations.length - 1)
                  )
                }
              />
            </div>
          </Grid>
          <SaveButtonBar
            disabled={disabled || (!hasChanged && treeOperations.length === 0)}
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
