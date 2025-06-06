// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { MenuDetailsFragment, MenuErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { menuListUrl } from "@dashboard/structures/urls";
import React from "react";

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
  const navigate = useNavigator();
  const initialForm: MenuDetailsFormData = {
    name: menu?.name ?? "",
  };
  const [treeOperations, setTreeOperations] = React.useState<TreeOperation[]>([]);
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
    <Form
      data-test-id="navigation-menu-details-page"
      confirmLeave
      initial={initialForm}
      onSubmit={handleSubmit}
    >
      {({ change, data, submit }) => (
        <DetailPageLayout>
          <TopNav href={menuListUrl()} title={menu?.name} />
          <DetailPageLayout.Content>
            <MenuItems
              canUndo={treeOperations.length > 0}
              items={menu?.items ? computeRelativeTree(menu.items, treeOperations) : []}
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
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <MenuProperties data={data} disabled={disabled} errors={errors} onChange={change} />
          </DetailPageLayout.RightSidebar>
          <Savebar>
            <Savebar.DeleteButton onClick={onDelete} />
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(menuListUrl())} />
            <Savebar.ConfirmButton
              transitionState={saveButtonState}
              onClick={submit}
              disabled={disabled}
            />
          </Savebar>
        </DetailPageLayout>
      )}
    </Form>
  );
};

MenuDetailsPage.displayName = "MenuDetailsPage";
export default MenuDetailsPage;
