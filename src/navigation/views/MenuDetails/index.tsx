import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { MenuItemMoveInput } from "@saleor/types/globalTypes";
import { categoryUrl } from "../../../categories/urls";
import { collectionUrl } from "../../../collections/urls";
import { DEFAULT_INITIAL_SEARCH_DATA } from "../../../config";
import SearchCategories from "../../../containers/SearchCategories";
import SearchCollections from "../../../containers/SearchCollections";
import SearchPages from "../../../containers/SearchPages";
import { getMutationState, maybe } from "../../../misc";
import { pageUrl } from "../../../pages/urls";
import MenuDetailsPage, {
  MenuDetailsSubmitData
} from "../../components/MenuDetailsPage";
import { findNode, getNode } from "../../components/MenuDetailsPage/tree";
import MenuItemDialog, {
  MenuItemDialogFormData,
  MenuItemType
} from "../../components/MenuItemDialog";
import {
  getItemId,
  getItemType,
  unknownTypeError
} from "../../components/MenuItems";
import {
  useMenuDeleteMutation,
  useMenuItemCreateMutation,
  useMenuItemDeleteMutation,
  useMenuItemMoveMutation,
  useMenuItemUpdateMutation,
  useMenuUpdateMutation
} from "../../mutations";
import { useMenuDetailsQuery } from "../../queries";
import { MenuItemCreateVariables } from "../../types/MenuItemCreate";
import { MenuItemUpdateVariables } from "../../types/MenuItemUpdate";
import { menuListUrl, menuUrl, MenuUrlQueryParams } from "../../urls";
import {
  handleDelete,
  handleItemCreate,
  handleItemDelete,
  handleItemUpdate,
  handleUpdate
} from "./successHandlers";
import {
  findMenuItem,
  getInitialDisplayValue,
  getMenuItemCreateInputData,
  getMenuItemInputData,
  getMoves,
  getRemoveIds
} from "./utils";

interface MenuDetailsProps {
  id: string;
  params: MenuUrlQueryParams;
}

const MenuDetails: React.FC<MenuDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading, refetch } = useMenuDetailsQuery({
    displayLoader: true,
    require: ["menu"],
    variables: { id }
  });

  const [menuDelete, menuDeleteOpts] = useMenuDeleteMutation({
    onCompleted: data => handleDelete(data, navigate, notify, intl)
  });
  const [menuUpdate, menuUpdateOpts] = useMenuUpdateMutation({
    onCompleted: data => handleUpdate(data, notify, refetch, intl)
  });

  const [menuItemCreate, menuItemCreateOpts] = useMenuItemCreateMutation({
    onCompleted: data => handleItemCreate(data, notify, closeModal, intl)
  });
  const [menuItemDelete, menuItemDeleteOpts] = useMenuItemDeleteMutation({
    onCompleted: data =>
      handleItemDelete(data, id, navigate, notify, refetch, intl)
  });
  const [menuItemMove] = useMenuItemMoveMutation({});
  const [menuItemUpdate, menuItemUpdateOpts] = useMenuItemUpdateMutation({
    onCompleted: data => handleItemUpdate(data, id, navigate, notify, intl)
  });

  const closeModal = () =>
    navigate(
      menuUrl(id, {
        ...params,
        action: undefined,
        id: undefined
      }),
      true
    );

  const handleItemClick = (id: string, type: MenuItemType) => {
    switch (type) {
      case "category":
        navigate(categoryUrl(id));
        break;

      case "collection":
        navigate(collectionUrl(id));
        break;

      case "page":
        navigate(pageUrl(id));
        break;

      case "link":
        window.open(id, "blank");
        break;

      default:
        throw unknownTypeError;
        break;
    }
  };

  return (
    <SearchPages variables={DEFAULT_INITIAL_SEARCH_DATA}>
      {pageSearch => (
        <SearchCategories variables={DEFAULT_INITIAL_SEARCH_DATA}>
          {categorySearch => (
            <SearchCollections variables={DEFAULT_INITIAL_SEARCH_DATA}>
              {collectionSearch => {
                const handleQueryChange = (query: string) => {
                  categorySearch.search(query);
                  collectionSearch.search(query);
                  pageSearch.search(query);
                };

                const categories = maybe(
                  () =>
                    categorySearch.result.data.search.edges.map(
                      edge => edge.node
                    ),
                  []
                );

                const collections = maybe(
                  () =>
                    collectionSearch.result.data.search.edges.map(
                      edge => edge.node
                    ),
                  []
                );

                const pages = maybe(
                  () =>
                    pageSearch.result.data.search.edges.map(edge => edge.node),
                  []
                );

                const menuItem = maybe(() =>
                  getNode(data.menu.items, findNode(data.menu.items, params.id))
                );

                const deleteState = getMutationState(
                  menuDeleteOpts.called,
                  menuDeleteOpts.loading,
                  maybe(() => menuDeleteOpts.data.menuDelete.errors)
                );

                const updateState = getMutationState(
                  menuUpdateOpts.called,
                  menuUpdateOpts.loading,
                  maybe(() => menuUpdateOpts.data.menuUpdate.errors)
                );

                const createItemState = getMutationState(
                  menuItemCreateOpts.called,
                  menuItemCreateOpts.loading,
                  maybe(() => menuItemCreateOpts.data.menuItemCreate.errors)
                );

                const deleteItemState = getMutationState(
                  menuItemDeleteOpts.called,
                  menuItemDeleteOpts.loading,
                  maybe(() => menuItemDeleteOpts.data.menuItemDelete.errors)
                );

                const updateItemState = getMutationState(
                  menuItemUpdateOpts.called,
                  menuItemUpdateOpts.loading,
                  maybe(() => menuItemUpdateOpts.data.menuItemUpdate.errors)
                );

                const handleSubmit = (data: MenuDetailsSubmitData) =>
                  menuUpdate({
                    variables: {
                      id,
                      name: data.name
                    }
                  });

                const handleItemDeleteSubmit = () =>
                  menuItemDelete({
                    variables: {
                      id: params.id
                    }
                  });

                const handleItemCreateSubmit = (
                  data: MenuItemDialogFormData
                ) => {
                  const variables: MenuItemCreateVariables = {
                    input: getMenuItemCreateInputData(id, data)
                  };

                  menuItemCreate({ variables });
                };

                const handleItemMove = (move: MenuItemMoveInput) =>
                  menuItemMove({
                    variables: {
                      id,
                      move
                    }
                  });

                const handleItemUpdateSubmit = (
                  data: MenuItemDialogFormData
                ) => {
                  const variables: MenuItemUpdateVariables = {
                    id: params.id,
                    input: getMenuItemInputData(data)
                  };

                  menuItemUpdate({ variables });
                };

                return (
                  <>
                    <MenuDetailsPage
                      disabled={loading}
                      menu={maybe(() => data.menu)}
                      onBack={() => navigate(menuListUrl())}
                      onDelete={() =>
                        navigate(
                          menuUrl(id, {
                            action: "remove"
                          })
                        )
                      }
                      onItemAdd={() =>
                        navigate(
                          menuUrl(id, {
                            action: "add-item"
                          })
                        )
                      }
                      onItemClick={handleItemClick}
                      onItemDelete={itemId =>
                        navigate(
                          menuUrl(id, {
                            action: "remove-item",
                            id: itemId
                          })
                        )
                      }
                      onItemEdit={itemId =>
                        navigate(
                          menuUrl(id, {
                            action: "edit-item",
                            id: itemId
                          })
                        )
                      }
                      onItemMove={handleItemMove}
                      onSubmit={handleSubmit}
                      saveButtonState={updateState}
                    />
                    <ActionDialog
                      open={params.action === "remove-item"}
                      onClose={closeModal}
                      confirmButtonState={deleteItemState}
                      onConfirm={handleItemDeleteSubmit}
                      variant="delete"
                      title={intl.formatMessage({
                        defaultMessage: "Delete Menu Item",
                        description: "dialog header"
                      })}
                    >
                      <DialogContentText>
                        <FormattedMessage
                          defaultMessage="Are you sure you want to delete {menuItemName}?"
                          values={{
                            menuItemName: (
                              <strong>
                                {maybe(
                                  () => findMenuItem(params.id, data.menu).name,
                                  "..."
                                )}
                              </strong>
                            )
                          }}
                        />
                      </DialogContentText>
                    </ActionDialog>
                    <ActionDialog
                      open={params.action === "remove"}
                      onClose={closeModal}
                      confirmButtonState={deleteState}
                      onConfirm={() => menuDelete({ variables: { id } })}
                      variant="delete"
                      title={intl.formatMessage({
                        defaultMessage: "Delete Menu",
                        description: "dialog header",
                        id: "menuDetailsDeleteMenuHeader"
                      })}
                    >
                      <DialogContentText>
                        <FormattedMessage
                          defaultMessage="Are you sure you want to delete menu {menuName}?"
                          id="menuDetailsDeleteMenuContent"
                          values={{
                            menuName: (
                              <strong>
                                {maybe(() => data.menu.name, "...")}
                              </strong>
                            )
                          }}
                        />
                      </DialogContentText>
                    </ActionDialog>
                    <MenuItemDialog
                      open={params.action === "add-item"}
                      categories={categories}
                      collections={collections}
                      errors={maybe(
                        () => menuItemCreateOpts.data.menuItemCreate.errors,
                        []
                      )}
                      pages={pages}
                      loading={
                        categorySearch.result.loading ||
                        collectionSearch.result.loading
                      }
                      confirmButtonState={createItemState}
                      disabled={menuItemCreateOpts.loading}
                      onClose={closeModal}
                      onSubmit={handleItemCreateSubmit}
                      onQueryChange={handleQueryChange}
                    />
                    <MenuItemDialog
                      open={params.action === "edit-item"}
                      categories={categories}
                      collections={collections}
                      errors={maybe(
                        () => menuItemUpdateOpts.data.menuItemUpdate.errors,
                        []
                      )}
                      pages={pages}
                      initial={{
                        id: maybe(() => getItemId(menuItem)),
                        name: maybe(() => menuItem.name, "..."),
                        type: maybe<MenuItemType>(
                          () => getItemType(menuItem),
                          "category"
                        )
                      }}
                      initialDisplayValue={getInitialDisplayValue(menuItem)}
                      loading={
                        categorySearch.result.loading ||
                        collectionSearch.result.loading
                      }
                      confirmButtonState={updateItemState}
                      disabled={menuItemUpdateOpts.loading}
                      onClose={closeModal}
                      onSubmit={handleItemUpdateSubmit}
                      onQueryChange={handleQueryChange}
                    />
                  </>
                );
              }}
            </SearchCollections>
          )}
        </SearchCategories>
      )}
    </SearchPages>
  );
};
MenuDetails.displayName = "MenuDetails";

export default MenuDetails;
