import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { Button } from "@saleor/components/Button";
import {
  useMenuBulkDeleteMutation,
  useMenuCreateMutation,
  useMenuDeleteMutation,
  useMenuListQuery,
} from "@saleor/graphql";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { usePaginationReset } from "@saleor/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@saleor/hooks/usePaginator";
import { buttonMessages, commonMessages } from "@saleor/intl";
import { getStringOrPlaceholder, maybe } from "@saleor/misc";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ListViews } from "@saleor/types";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import MenuCreateDialog from "../../components/MenuCreateDialog";
import MenuListPage from "../../components/MenuListPage";
import { menuListUrl, MenuListUrlQueryParams, menuUrl } from "../../urls";
import { getSortQueryVariables } from "./sort";

interface MenuListProps {
  params: MenuListUrlQueryParams;
}
const MenuList: React.FC<MenuListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids,
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.NAVIGATION_LIST,
  );

  usePaginationReset(menuListUrl, params, settings.rowNumber);

  const intl = useIntl();

  const closeModal = () =>
    navigate(
      menuListUrl({
        ...params,
        action: undefined,
        id: undefined,
        ids: undefined,
      }),
      { replace: true },
    );

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = useMenuListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.menus.pageInfo),
    paginationState,
    queryString: params,
  });

  const [menuCreate, menuCreateOpts] = useMenuCreateMutation({
    onCompleted: data => {
      if (data.menuCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "ugnggZ",
            defaultMessage: "Created menu",
          }),
        });
        navigate(menuUrl(data.menuCreate.menu.id));
      }
    },
  });

  const [menuDelete, menuDeleteOpts] = useMenuDeleteMutation({
    onCompleted: data => {
      if (data.menuDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "OwG/0z",
            defaultMessage: "Deleted menu",
          }),
        });
        closeModal();
        refetch();
      }
    },
  });

  const [menuBulkDelete, menuBulkDeleteOpts] = useMenuBulkDeleteMutation({
    onCompleted: data => {
      if (data.menuBulkDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        closeModal();
        reset();
        refetch();
      }
    },
  });

  const handleSort = createSortHandler(navigate, menuListUrl, params);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <MenuListPage
        disabled={loading}
        menus={mapEdgesToItems(data?.menus)}
        settings={settings}
        onDelete={id =>
          navigate(
            menuListUrl({
              action: "remove",
              id,
            }),
          )
        }
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        isChecked={isSelected}
        selected={listElements.length}
        sort={getSortParams(params)}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <Button
            onClick={() =>
              navigate(
                menuListUrl({
                  ...params,
                  action: "remove-many",
                  ids: listElements,
                }),
              )
            }
          >
            <FormattedMessage {...buttonMessages.remove} />
          </Button>
        }
      />
      <MenuCreateDialog
        open={params.action === "add"}
        confirmButtonState={menuCreateOpts.status}
        disabled={menuCreateOpts.loading}
        errors={menuCreateOpts?.data?.menuCreate.errors || []}
        onClose={closeModal}
        onConfirm={formData =>
          menuCreate({
            variables: { input: formData },
          })
        }
      />
      <ActionDialog
        open={params.action === "remove"}
        onClose={closeModal}
        confirmButtonState={menuDeleteOpts.status}
        onConfirm={() =>
          menuDelete({
            variables: {
              id: params.id,
            },
          })
        }
        variant="delete"
        title={intl.formatMessage({
          id: "QzseV7",
          defaultMessage: "Delete Menu",
          description: "dialog header",
        })}
      >
        <DialogContentText>
          <FormattedMessage
            id="bj1U23"
            defaultMessage="Are you sure you want to delete {menuName}?"
            values={{
              menuName: getStringOrPlaceholder(
                mapEdgesToItems(data?.menus)?.find(getById(params.id))?.name,
              ),
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ActionDialog
        open={
          params.action === "remove-many" && maybe(() => params.ids.length > 0)
        }
        onClose={closeModal}
        confirmButtonState={menuBulkDeleteOpts.status}
        onConfirm={() =>
          menuBulkDelete({
            variables: {
              ids: params.ids,
            },
          })
        }
        variant="delete"
        title={intl.formatMessage({
          id: "1LBYpE",
          defaultMessage: "Delete Menus",
          description: "dialog header",
        })}
      >
        <DialogContentText>
          <FormattedMessage
            id="svK+kv"
            defaultMessage="{counter,plural,one{Are you sure you want to delete this menu?} other{Are you sure you want to delete {displayQuantity} menus?}}"
            values={{
              counter: maybe(() => params.ids.length.toString(), "..."),
              displayQuantity: (
                <strong>
                  {maybe(() => params.ids.length.toString(), "...")}
                </strong>
              ),
            }}
          />
        </DialogContentText>
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};
export default MenuList;
