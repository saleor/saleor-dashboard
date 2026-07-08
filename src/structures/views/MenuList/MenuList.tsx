// @ts-strict-ignore
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
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { buttonMessages } from "@dashboard/intl";
import { getById, getStringOrPlaceholder, maybe } from "@dashboard/misc";
import { ListViews } from "@dashboard/types";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { MenuBulkDeleteDialog } from "../../components/MenuBulkDeleteDialog/MenuBulkDeleteDialog";
import { MenuCreateDialog } from "../../components/MenuCreateDialog/MenuCreateDialog";
import { MenuDeleteDialog } from "../../components/MenuDeleteDialog/MenuDeleteDialog";
import MenuListPage from "../../components/MenuListPage";
import { menuListUrl, type MenuListUrlQueryParams, menuUrl } from "../../urls";
import { getSortQueryVariables } from "./sort";

interface MenuListProps {
  params: MenuListUrlQueryParams;
}

const MenuList = ({ params }: MenuListProps) => {
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
  const queryVariables = useMemo(
    () => ({
      ...paginationState,
      sort: getSortQueryVariables(params),
    }),
    [paginationState, params],
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
          text: intl.formatMessage({ id: "v20Mra", defaultMessage: "Menus deleted" }),
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
        confirmButtonState={menuCreateOpts.status}
        errors={menuCreateOpts?.data?.menuCreate.errors || []}
        open={params.action === "add"}
        onClose={closeModal}
        onConfirm={formData =>
          menuCreate({
            variables: { input: formData },
          })
        }
      />
      <MenuDeleteDialog
        confirmButtonState={menuDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          menuDelete({
            variables: {
              id: params.id,
            },
          })
        }
        open={params.action === "remove"}
        subtitle={
          <FormattedMessage
            id="bj1U23"
            defaultMessage="Are you sure you want to delete {menuName}?"
            values={{
              menuName: getStringOrPlaceholder(
                mapEdgesToItems(data?.menus)?.find(getById(params.id))?.name,
              ),
            }}
          />
        }
      />
      <MenuBulkDeleteDialog
        confirmButtonState={menuBulkDeleteOpts.status}
        count={params.ids?.length ?? 0}
        onClose={closeModal}
        onConfirm={() =>
          menuBulkDelete({
            variables: {
              ids: params.ids,
            },
          })
        }
        open={params.action === "remove-many" && maybe(() => params.ids.length > 0)}
      />
    </PaginatorContext.Provider>
  );
};

export default MenuList;
