// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForMenuDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { type MenuDetailsFragment, type MenuErrorFragment } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { defaultGraphiQLQuery } from "@dashboard/structures/queries";
import { menuListUrl } from "@dashboard/structures/urls";
import { useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import { type MenuItemType } from "../MenuItemDialog/types";
import MenuItems, { type TreeOperation } from "../MenuItems";
import MenuProperties from "../MenuProperties";
import { computeRelativeTree } from "./tree";

export interface MenuDetailsFormData {
  name: string;
}

export interface MenuDetailsSubmitData extends MenuDetailsFormData {
  operations: TreeOperation[];
}

interface MenuDetailsPageProps {
  saveButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: MenuErrorFragment[];
  menu: MenuDetailsFragment;
  onDelete: () => void;
  onItemAdd: () => void;
  onItemClick: (id: string, type: MenuItemType) => void;
  onItemEdit: (id: string) => void;
  // If not passed, it will not render the button. Use to control permissions
  onTranslate?: (id: string) => void;
  onSubmit: (data: MenuDetailsSubmitData) => SubmitPromise;
}

const messages = defineMessages({
  openGraphiQL: {
    id: "XL64mm",
    defaultMessage: "Open this menu in GraphiQL",
  },
});

const MenuDetailsPage = ({
  disabled,
  errors,
  menu,
  saveButtonState,
  onDelete,
  onItemAdd,
  onItemClick,
  onItemEdit,
  onSubmit,
  onTranslate,
}: MenuDetailsPageProps) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const context = useDevModeContext();
  const openPlaygroundURL = () => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${menu?.id}" }`);
    context.setDevModeVisibility(true);
  };

  const initialForm: MenuDetailsFormData = {
    name: menu?.name ?? "",
  };
  const [treeOperations, setTreeOperations] = useState<TreeOperation[]>([]);
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

  const { MENU_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.MENU_DETAILS);
  const extensionMenuItems = getExtensionsItemsForMenuDetails(MENU_DETAILS_MORE_ACTIONS, menu?.id);

  return (
    <Form
      data-test-id="navigation-menu-details-page"
      confirmLeave
      initial={initialForm}
      onSubmit={handleSubmit}
    >
      {({ change, data, submit }) => (
        <DetailPageLayout>
          <TopNav href={menuListUrl()} title={menu?.name}>
            <TopNav.Menu
              items={[
                ...extensionMenuItems,
                {
                  label: intl.formatMessage(messages.openGraphiQL),
                  onSelect: openPlaygroundURL,
                  testId: "graphiql-redirect",
                },
              ]}
              dataTestId="menu"
            />
          </TopNav>
          <DetailPageLayout.Content>
            <MenuItems
              canUndo={treeOperations.length > 0}
              items={menu?.items ? computeRelativeTree(menu.items, treeOperations) : []}
              onChange={handleChange}
              onItemAdd={onItemAdd}
              onItemClick={onItemClick}
              onItemEdit={onItemEdit}
              onTranslate={onTranslate}
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
