// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import { Button } from "@dashboard/components/Button";
import {
  useMenuBulkDeleteMutation,
  useMenuCreateMutation,
  useMenuDeleteMutation,
  useMenuListQuery,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { getById, getStringOrPlaceholder, maybe } from "@dashboard/misc";
import { ListViews } from "@dashboard/types";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
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
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
  const { updateListSettings, settings } = useListSettings(ListViews.NAVIGATION_LIST);

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
            id: "C4IOEN",
            defaultMessage: "Created structure",
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
            id: "cRQ9hb",
            defaultMessage: "Deleted structure",
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
        selectedMenuIds={listElements}
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
          id: "x79cEk",
          defaultMessage: "Delete structure",
          description: "dialog header",
        })}
      >
        <FormattedMessage
          id="bj1U23"
          defaultMessage="Are you sure you want to delete {menuName}?"
          values={{
            menuName: getStringOrPlaceholder(
              mapEdgesToItems(data?.menus)?.find(getById(params.id))?.name,
            ),
          }}
        />
      </ActionDialog>
      <ActionDialog
        open={params.action === "remove-many" && maybe(() => params.ids.length > 0)}
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
          id: "wAGThK",
          defaultMessage: "Delete structures",
          description: "dialog header",
        })}
      >
        <FormattedMessage
          id="aWzvoq"
          defaultMessage="{counter,plural,one{Are you sure you want to delete this structure?} other{Are you sure you want to delete {displayQuantity} structures?}}"
          values={{
            counter: maybe(() => params.ids.length.toString(), "..."),
            displayQuantity: <strong>{maybe(() => params.ids.length.toString(), "...")}</strong>,
          }}
        />
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};

export default MenuList;
