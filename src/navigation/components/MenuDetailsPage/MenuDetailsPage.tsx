import { Typography } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Savebar from "@saleor/components/Savebar";
import { MenuDetailsFragment, MenuErrorFragment } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { menuListUrl } from "@saleor/navigation/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { MenuItemType } from "../MenuItemDialog";
import MenuItems, { TreeOperation } from "../MenuItems";
import MenuProperties from "../MenuProperties";
import { computeRelativeTree } from "./tree";

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
  menu: MenuDetailsFragment;
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
  onDelete,
  onItemAdd,
  onItemClick,
  onItemEdit,
  onSubmit,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const initialForm: MenuDetailsFormData = {
    name: menu?.name ?? "",
  };

  const [treeOperations, setTreeOperations] = React.useState<TreeOperation[]>(
    [],
  );

  const removeSimulatedMoves = (operations: TreeOperation[]) =>
    operations.filter(operation => !operation.simulatedMove);

  const handleSubmit = async (data: MenuDetailsFormData) => {
    const result = await onSubmit({
      name: data.name,
      operations: removeSimulatedMoves(treeOperations),
    });

    if (result) {
      setTreeOperations([]);
    }

    return result;
  };

  const handleChange = (operations: TreeOperation[]) => {
    setTreeOperations([...treeOperations, ...operations]);
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, submit }) => (
        <Container>
          <Backlink href={menuListUrl()}>
            {intl.formatMessage(sectionNames.navigation)}
          </Backlink>
          <Grid variant="inverted">
            <div>
              <Typography variant="h5">
                {intl.formatMessage(sectionNames.navigation)}
              </Typography>
              <Typography>
                <FormattedMessage
                  id="E54eoT"
                  defaultMessage="Creating the navigation structure is done by dragging and dropping. Simply create a new menu item and then drag it into its destined place. You can move items inside one another to create a tree structure and drag items up and down to create a hierarchy"
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
                items={
                  menu?.items
                    ? computeRelativeTree(menu.items, treeOperations)
                    : []
                }
                onChange={handleChange}
                onItemAdd={onItemAdd}
                onItemClick={onItemClick}
                onItemEdit={onItemEdit}
                onUndo={() =>
                  setTreeOperations(operations => {
                    if (operations.length > 1) {
                      // Undo of a simulated move needs removal of 2 moves instead of one
                      if (operations[operations.length - 2].simulatedMove) {
                        return operations.slice(0, operations.length - 2);
                      }
                    }
                    return operations.slice(0, operations.length - 1);
                  })
                }
              />
            </div>
          </Grid>
          <Savebar
            onCancel={() => navigate(menuListUrl())}
            disabled={disabled || treeOperations.length === 0}
            onDelete={onDelete}
            onSubmit={submit}
            state={saveButtonState}
          />
        </Container>
      )}
    </Form>
  );
};
MenuDetailsPage.displayName = "MenuDetailsPage";
export default MenuDetailsPage;
