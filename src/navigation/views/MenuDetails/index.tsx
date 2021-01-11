import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import usePageSearch from "@saleor/searches/usePageSearch";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { categoryUrl } from "../../../categories/urls";
import { collectionUrl } from "../../../collections/urls";
import { maybe } from "../../../misc";
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
  MenuDeleteMutation,
  MenuItemCreateMutation,
  MenuItemUpdateMutation,
  MenuUpdateMutation
} from "../../mutations";
import { MenuDetailsQuery } from "../../queries";
import { MenuItemCreateVariables } from "../../types/MenuItemCreate";
import { MenuItemUpdateVariables } from "../../types/MenuItemUpdate";
import { menuListUrl, menuUrl, MenuUrlQueryParams } from "../../urls";
import {
  handleDelete,
  handleItemCreate,
  handleItemUpdate,
  handleUpdate
} from "./successHandlers";
import {
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
  const categorySearch = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const collectionSearch = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const pageSearch = usePageSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
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
    <MenuDetailsQuery displayLoader variables={{ id }}>
      {({ data, loading, refetch }) => {
        const handleQueryChange = (query: string) => {
          categorySearch.search(query);
          collectionSearch.search(query);
          pageSearch.search(query);
        };

        const categories = maybe(
          () => categorySearch.result.data.search.edges.map(edge => edge.node),
          []
        );

        const collections = maybe(
          () =>
            collectionSearch.result.data.search.edges.map(edge => edge.node),
          []
        );

        const pages = maybe(
          () => pageSearch.result.data.search.edges.map(edge => edge.node),
          []
        );

        return (
          <MenuDeleteMutation
            onCompleted={data => handleDelete(data, navigate, notify, intl)}
          >
            {(menuDelete, menuDeleteOpts) => (
              <MenuUpdateMutation
                onCompleted={data => handleUpdate(data, notify, refetch, intl)}
              >
                {(menuUpdate, menuUpdateOpts) => {
                  // This is a workaround to let know <MenuDetailsPage />
                  // that it should clean operation stack if mutations
                  // were successful
                  const handleSubmit = async (data: MenuDetailsSubmitData) => {
                    const result = await menuUpdate({
                      variables: {
                        id,
                        moves: getMoves(data),
                        name: data.name,
                        removeIds: getRemoveIds(data)
                      }
                    });

                    return [
                      ...result.data.menuItemBulkDelete.errors,
                      ...result.data.menuItemMove.errors,
                      ...result.data.menuUpdate.errors
                    ];
                  };

                  return (
                    <>
                      <MenuDetailsPage
                        disabled={loading}
                        errors={[
                          ...(menuUpdateOpts.data?.menuUpdate.errors || []),
                          ...(menuUpdateOpts.data?.menuItemMove.errors || []),
                          ...(menuUpdateOpts.data?.menuUpdate.errors || [])
                        ]}
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
                        onItemEdit={itemId =>
                          navigate(
                            menuUrl(id, {
                              action: "edit-item",
                              id: itemId
                            })
                          )
                        }
                        onSubmit={handleSubmit}
                        saveButtonState={menuUpdateOpts.status}
                      />
                      <ActionDialog
                        open={params.action === "remove"}
                        onClose={closeModal}
                        confirmButtonState={menuDeleteOpts.status}
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

                      <MenuItemCreateMutation
                        onCompleted={data =>
                          handleItemCreate(data, notify, closeModal, intl)
                        }
                      >
                        {(menuItemCreate, menuItemCreateOpts) => {
                          const handleSubmit = (
                            data: MenuItemDialogFormData
                          ) => {
                            const variables: MenuItemCreateVariables = {
                              input: getMenuItemCreateInputData(id, data)
                            };

                            menuItemCreate({ variables });
                          };

                          return (
                            <MenuItemDialog
                              open={params.action === "add-item"}
                              categories={categories}
                              collections={collections}
                              errors={maybe(
                                () =>
                                  menuItemCreateOpts.data.menuItemCreate.errors,
                                []
                              )}
                              pages={pages}
                              loading={
                                categorySearch.result.loading ||
                                collectionSearch.result.loading
                              }
                              confirmButtonState={menuItemCreateOpts.status}
                              disabled={menuItemCreateOpts.loading}
                              onClose={closeModal}
                              onSubmit={handleSubmit}
                              onQueryChange={handleQueryChange}
                            />
                          );
                        }}
                      </MenuItemCreateMutation>
                      <MenuItemUpdateMutation
                        onCompleted={data =>
                          handleItemUpdate(data, id, navigate, notify, intl)
                        }
                      >
                        {(menuItemUpdate, menuItemUpdateOpts) => {
                          const handleSubmit = (
                            data: MenuItemDialogFormData
                          ) => {
                            const variables: MenuItemUpdateVariables = {
                              id: params.id,
                              input: getMenuItemInputData(data)
                            };

                            menuItemUpdate({ variables });
                          };

                          const menuItem = maybe(() =>
                            getNode(
                              data.menu.items,
                              findNode(data.menu.items, params.id)
                            )
                          );

                          const initialFormData: MenuItemDialogFormData = {
                            id: maybe(() => getItemId(menuItem)),
                            name: maybe(() => menuItem.name, "..."),
                            type: maybe<MenuItemType>(
                              () => getItemType(menuItem),
                              "category"
                            )
                          };

                          return (
                            <MenuItemDialog
                              open={params.action === "edit-item"}
                              categories={categories}
                              collections={collections}
                              errors={maybe(
                                () =>
                                  menuItemUpdateOpts.data.menuItemUpdate.errors,
                                []
                              )}
                              pages={pages}
                              initial={initialFormData}
                              initialDisplayValue={getInitialDisplayValue(
                                menuItem
                              )}
                              loading={
                                categorySearch.result.loading ||
                                collectionSearch.result.loading
                              }
                              confirmButtonState={menuItemUpdateOpts.status}
                              disabled={menuItemUpdateOpts.loading}
                              onClose={closeModal}
                              onSubmit={handleSubmit}
                              onQueryChange={handleQueryChange}
                            />
                          );
                        }}
                      </MenuItemUpdateMutation>
                    </>
                  );
                }}
              </MenuUpdateMutation>
            )}
          </MenuDeleteMutation>
        );
      }}
    </MenuDetailsQuery>
  );
};
MenuDetails.displayName = "MenuDetails";

export default MenuDetails;
