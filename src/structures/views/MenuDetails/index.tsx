// @ts-strict-ignore
import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  PermissionEnum,
  useMenuDeleteMutation,
  useMenuDetailsQuery,
  useMenuItemCreateMutation,
  useMenuItemUpdateMutation,
  useMenuUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { pageUrl } from "@dashboard/modeling/urls";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { FormattedMessage, useIntl } from "react-intl";

import { categoryUrl } from "../../../categories/urls";
import { collectionUrl } from "../../../collections/urls";
import { extractMutationErrors, maybe } from "../../../misc";
import { MenuDeleteDialog } from "../../components/MenuDeleteDialog/MenuDeleteDialog";
import MenuDetailsPage, { type MenuDetailsSubmitData } from "../../components/MenuDetailsPage";
import { findNode, getNode } from "../../components/MenuDetailsPage/tree";
import { MenuItemDialog } from "../../components/MenuItemDialog/MenuItemDialog";
import {
  type MenuItemDialogFormData,
  type MenuItemType,
} from "../../components/MenuItemDialog/types";
import {
  getItemId,
  getItemType,
  unknownTypeError,
} from "../../components/MenuItemsSortableTree/utils";
import { menuUrl, type MenuUrlQueryParams } from "../../urls";
import { handleDelete, handleItemCreate, handleItemUpdate, handleUpdate } from "./successHandlers";
import {
  getInitialMenuItemLabel,
  getInitialMenuItemValue,
  getMenuItemCreateInputData,
  getMenuItemInputData,
  getMoves,
  getRemoveIds,
} from "./utils";

interface MenuDetailsProps {
  id: string;
  params: MenuUrlQueryParams;
}

const MenuDetails = ({ id, params }: MenuDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const intl = useIntl();
  const { data, loading, refetch } = useMenuDetailsQuery({
    variables: { id },
  });

  useRegisterEntityRefresh(refetch);

  const [menuDelete, menuDeleteOpts] = useMenuDeleteMutation({
    onCompleted: data => handleDelete(data, navigate, notify, intl),
  });
  const [menuUpdate, menuUpdateOpts] = useMenuUpdateMutation({
    onCompleted: data => handleUpdate(data, notify, refetch, intl),
  });
  const [menuItemCreate, menuItemCreateOpts] = useMenuItemCreateMutation({
    onCompleted: data => handleItemCreate(data, notify, closeModal, intl),
  });
  const [menuItemUpdate, menuItemUpdateOpts] = useMenuItemUpdateMutation({
    onCompleted: data => handleItemUpdate(data, id, navigate, notify, intl),
  });
  const closeModal = () =>
    navigate(
      menuUrl(id, {
        ...params,
        action: undefined,
        id: undefined,
      }),
      { replace: true },
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
    }
  };
  const handleMenuItemCreate = (data: MenuItemDialogFormData) =>
    extractMutationErrors(
      menuItemCreate({
        variables: {
          input: getMenuItemCreateInputData(id, data),
        },
      }),
    );
  const handleMenuItemUpdate = (data: MenuItemDialogFormData) =>
    extractMutationErrors(
      menuItemUpdate({
        variables: {
          id: params.id,
          input: getMenuItemInputData(data),
        },
      }),
    );
  const menuItem = maybe(() => getNode(data.menu.items, findNode(data.menu.items, params.id)));
  const initialMenuItemUpdateFormData: MenuItemDialogFormData = {
    id: maybe(() => getItemId(menuItem)),
    name: maybe(() => menuItem.name, "..."),
    linkType: maybe<MenuItemType>(() => getItemType(menuItem), "category"),
    linkValue: getInitialMenuItemValue(menuItem),
  };
  // This is a workaround to let know <MenuDetailsPage />
  // that it should clean operation stack if mutations
  // were successful
  const handleSubmit = async (data: MenuDetailsSubmitData) => {
    const result = await menuUpdate({
      variables: {
        id,
        moves: getMoves(data),
        name: data.name,
        removeIds: getRemoveIds(data),
      },
    });

    return [
      ...result.data.menuItemBulkDelete.errors,
      ...result.data.menuItemMove.errors,
      ...result.data.menuUpdate.errors,
    ];
  };

  return (
    <>
      <MenuDetailsPage
        disabled={loading}
        errors={[
          ...(menuUpdateOpts.data?.menuUpdate.errors || []),
          ...(menuUpdateOpts.data?.menuItemMove.errors || []),
          ...(menuUpdateOpts.data?.menuUpdate.errors || []),
        ]}
        menu={maybe(() => data.menu)}
        onDelete={() =>
          navigate(
            menuUrl(id, {
              action: "remove",
            }),
          )
        }
        onItemAdd={() =>
          navigate(
            menuUrl(id, {
              action: "add-item",
            }),
          )
        }
        onItemClick={handleItemClick}
        onItemEdit={itemId =>
          navigate(
            menuUrl(id, {
              action: "edit-item",
              id: itemId,
            }),
          )
        }
        onTranslate={
          canTranslate
            ? itemId =>
                navigate(
                  languageEntityUrl(
                    lastUsedLocaleOrFallback,
                    TranslatableEntities.menuItems,
                    itemId,
                  ),
                )
            : undefined
        }
        onSubmit={handleSubmit}
        saveButtonState={menuUpdateOpts.status}
      />
      <MenuDeleteDialog
        confirmButtonState={menuDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() => extractMutationErrors(menuDelete({ variables: { id } }))}
        open={params.action === "remove"}
        subtitle={
          <FormattedMessage
            id="U2DyeR"
            defaultMessage="Are you sure you want to delete structure {menuName}?"
            values={{
              menuName: <strong>{maybe(() => data.menu.name, "...")}</strong>,
            }}
          />
        }
      />

      <MenuItemDialog
        confirmButtonState={menuItemCreateOpts.status}
        errors={maybe(() => menuItemCreateOpts.data.menuItemCreate.errors, [])}
        onClose={closeModal}
        onSubmit={handleMenuItemCreate}
        open={params.action === "add-item"}
      />
      <MenuItemDialog
        confirmButtonState={menuItemUpdateOpts.status}
        errors={maybe(() => menuItemUpdateOpts.data.menuItemUpdate.errors, [])}
        initial={initialMenuItemUpdateFormData}
        initialDisplayValue={getInitialMenuItemLabel(menuItem)}
        onClose={closeModal}
        onSubmit={handleMenuItemUpdate}
        open={params.action === "edit-item"}
      />
    </>
  );
};

MenuDetails.displayName = "MenuDetails";

export default MenuDetails;
