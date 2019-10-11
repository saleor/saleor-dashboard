import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { configurationMenuUrl } from "@saleor/configuration";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { buttonMessages, commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import MenuCreateDialog from "../components/MenuCreateDialog";
import MenuListPage from "../components/MenuListPage";
import {
  MenuBulkDeleteMutation,
  MenuCreateMutation,
  MenuDeleteMutation
} from "../mutations";
import { MenuListQuery } from "../queries";
import { MenuBulkDelete } from "../types/MenuBulkDelete";
import { MenuCreate } from "../types/MenuCreate";
import { MenuDelete } from "../types/MenuDelete";
import { menuListUrl, MenuListUrlQueryParams, menuUrl } from "../urls";

interface MenuListProps {
  params: MenuListUrlQueryParams;
}
const MenuList: React.FC<MenuListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.NAVIGATION_LIST
  );
  const intl = useIntl();

  const closeModal = () =>
    navigate(
      menuListUrl({
        ...params,
        action: undefined,
        id: undefined,
        ids: undefined
      }),
      true
    );

  const paginationState = createPaginationState(settings.rowNumber, params);

  return (
    <MenuListQuery variables={paginationState}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.menus.pageInfo),
          paginationState,
          params
        );

        const handleCreate = (data: MenuCreate) => {
          if (data.menuCreate.errors.length === 0) {
            notify({
              text: intl.formatMessage({
                defaultMessage: "Created menu",
                id: "menuListCreatedMenu"
              })
            });
            navigate(menuUrl(data.menuCreate.menu.id));
          }
        };

        const handleBulkDelete = (data: MenuBulkDelete) => {
          if (data.menuBulkDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            closeModal();
            reset();
            refetch();
          }
        };

        const handleDelete = (data: MenuDelete) => {
          if (data.menuDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage({
                defaultMessage: "Deleted menu",
                id: "menuListDeletedMenu"
              })
            });
            closeModal();
            refetch();
          }
        };

        return (
          <MenuCreateMutation onCompleted={handleCreate}>
            {(menuCreate, menuCreateOpts) => (
              <MenuDeleteMutation onCompleted={handleDelete}>
                {(menuDelete, menuDeleteOpts) => (
                  <MenuBulkDeleteMutation onCompleted={handleBulkDelete}>
                    {(menuBulkDelete, menuBulkDeleteOpts) => {
                      const createTransitionState = getMutationState(
                        menuCreateOpts.called,
                        menuCreateOpts.loading,
                        maybe(() => menuCreateOpts.data.menuCreate.errors)
                      );

                      const deleteTransitionState = getMutationState(
                        menuDeleteOpts.called,
                        menuDeleteOpts.loading,
                        maybe(() => menuDeleteOpts.data.menuDelete.errors)
                      );

                      const bulkDeleteTransitionState = getMutationState(
                        menuBulkDeleteOpts.called,
                        menuBulkDeleteOpts.loading,
                        maybe(
                          () => menuBulkDeleteOpts.data.menuBulkDelete.errors
                        )
                      );

                      return (
                        <>
                          <MenuListPage
                            disabled={loading}
                            menus={maybe(() =>
                              data.menus.edges.map(edge => edge.node)
                            )}
                            settings={settings}
                            onAdd={() =>
                              navigate(
                                menuListUrl({
                                  action: "add"
                                })
                              )
                            }
                            onBack={() => navigate(configurationMenuUrl)}
                            onDelete={id =>
                              navigate(
                                menuListUrl({
                                  action: "remove",
                                  id
                                })
                              )
                            }
                            onNextPage={loadNextPage}
                            onPreviousPage={loadPreviousPage}
                            onUpdateListSettings={updateListSettings}
                            onRowClick={id => () => navigate(menuUrl(id))}
                            pageInfo={pageInfo}
                            isChecked={isSelected}
                            selected={listElements.length}
                            toggle={toggle}
                            toggleAll={toggleAll}
                            toolbar={
                              <Button
                                color="primary"
                                onClick={() =>
                                  navigate(
                                    menuListUrl({
                                      ...params,
                                      action: "remove-many",
                                      ids: listElements
                                    })
                                  )
                                }
                              >
                                <FormattedMessage {...buttonMessages.remove} />
                              </Button>
                            }
                          />
                          <MenuCreateDialog
                            open={params.action === "add"}
                            confirmButtonState={createTransitionState}
                            disabled={menuCreateOpts.loading}
                            onClose={closeModal}
                            onConfirm={formData =>
                              menuCreate({
                                variables: { input: formData }
                              })
                            }
                          />
                          <ActionDialog
                            open={params.action === "remove"}
                            onClose={closeModal}
                            confirmButtonState={deleteTransitionState}
                            onConfirm={() =>
                              menuDelete({
                                variables: {
                                  id: params.id
                                }
                              })
                            }
                            variant="delete"
                            title={intl.formatMessage({
                              defaultMessage: "Delete Menu",
                              description: "dialog header",
                              id: "menuListDeleteMenuHeader"
                            })}
                          >
                            <DialogContentText>
                              <FormattedMessage
                                defaultMessage="Are you sure you want to delete {menuName}?"
                                id="menuListDeleteMenuContent"
                                values={{
                                  menuName: maybe(
                                    () =>
                                      data.menus.edges.find(
                                        edge => edge.node.id === params.id
                                      ).node.name,
                                    "..."
                                  )
                                }}
                              />
                            </DialogContentText>
                          </ActionDialog>
                          <ActionDialog
                            open={
                              params.action === "remove-many" &&
                              maybe(() => params.ids.length > 0)
                            }
                            onClose={closeModal}
                            confirmButtonState={bulkDeleteTransitionState}
                            onConfirm={() =>
                              menuBulkDelete({
                                variables: {
                                  ids: params.ids
                                }
                              })
                            }
                            variant="delete"
                            title={intl.formatMessage({
                              defaultMessage: "Delete Menus",
                              description: "dialog header",
                              id: "menuListDeleteMenusHeader"
                            })}
                          >
                            <DialogContentText>
                              <FormattedMessage
                                defaultMessage="Are you sure you want to delete {counter, plural,
                              one {this menu}
                              other {{displayQuantity} menus}
                            }?"
                                id="menuListDeleteMenusContent"
                                values={{
                                  counter: maybe(
                                    () => params.ids.length.toString(),
                                    "..."
                                  ),
                                  displayQuantity: (
                                    <strong>
                                      {maybe(
                                        () => params.ids.length.toString(),
                                        "..."
                                      )}
                                    </strong>
                                  )
                                }}
                              />
                            </DialogContentText>
                          </ActionDialog>
                        </>
                      );
                    }}
                  </MenuBulkDeleteMutation>
                )}
              </MenuDeleteMutation>
            )}
          </MenuCreateMutation>
        );
      }}
    </MenuListQuery>
  );
};
export default MenuList;
