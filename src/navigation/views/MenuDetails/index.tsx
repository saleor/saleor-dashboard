import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  useMenuDeleteMutation,
  useMenuDetailsQuery,
  useMenuItemCreateMutation,
  useMenuItemUpdateMutation,
  useMenuUpdateMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import usePageSearch from "@saleor/searches/usePageSearch";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { categoryUrl } from "../../../categories/urls";
import { collectionUrl } from "../../../collections/urls";
import { extractMutationErrors, maybe } from "../../../misc";
import { pageUrl } from "../../../pages/urls";
import MenuDetailsPage, {
  MenuDetailsSubmitData,
} from "../../components/MenuDetailsPage";
import { findNode, getNode } from "../../components/MenuDetailsPage/tree";
import MenuItemDialog, {
  MenuItemDialogFormData,
  MenuItemType,
} from "../../components/MenuItemDialog";
import {
  getItemId,
  getItemType,
  unknownTypeError,
} from "../../components/MenuItems";
import { menuUrl, MenuUrlQueryParams } from "../../urls";
import {
  handleDelete,
  handleItemCreate,
  handleItemUpdate,
  handleUpdate,
} from "./successHandlers";
import {
  getInitialDisplayValue,
  getMenuItemCreateInputData,
  getMenuItemInputData,
  getMoves,
  getRemoveIds,
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
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const collectionSearch = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const pageSearch = usePageSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const { data, loading, refetch } = useMenuDetailsQuery({
    variables: { id },
  });

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
        break;
    }
  };

  const handleQueryChange = (query: string) => {
    categorySearch.search(query);
    collectionSearch.search(query);
    pageSearch.search(query);
  };

  const categories =
    mapEdgesToItems(categorySearch?.result?.data?.search) || [];

  const collections =
    mapEdgesToItems(collectionSearch?.result?.data?.search) || [];

  const pages = mapEdgesToItems(pageSearch?.result?.data?.search) || [];

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

  const menuItem = maybe(() =>
    getNode(data.menu.items, findNode(data.menu.items, params.id)),
  );

  const initialMenuItemUpdateFormData: MenuItemDialogFormData = {
    id: maybe(() => getItemId(menuItem)),
    name: maybe(() => menuItem.name, "..."),
    type: maybe<MenuItemType>(() => getItemType(menuItem), "category"),
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
        onSubmit={handleSubmit}
        saveButtonState={menuUpdateOpts.status}
      />
      <ActionDialog
        open={params.action === "remove"}
        onClose={closeModal}
        confirmButtonState={menuDeleteOpts.status}
        onConfirm={() =>
          extractMutationErrors(menuDelete({ variables: { id } }))
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
            id="G/SYtU"
            defaultMessage="Are you sure you want to delete menu {menuName}?"
            values={{
              menuName: <strong>{maybe(() => data.menu.name, "...")}</strong>,
            }}
          />
        </DialogContentText>
      </ActionDialog>

      <MenuItemDialog
        open={params.action === "add-item"}
        categories={categories}
        collections={collections}
        errors={maybe(() => menuItemCreateOpts.data.menuItemCreate.errors, [])}
        pages={pages}
        loading={
          categorySearch.result.loading || collectionSearch.result.loading
        }
        confirmButtonState={menuItemCreateOpts.status}
        disabled={menuItemCreateOpts.loading}
        onClose={closeModal}
        onSubmit={handleMenuItemCreate}
        onQueryChange={handleQueryChange}
      />
      <MenuItemDialog
        open={params.action === "edit-item"}
        categories={categories}
        collections={collections}
        errors={maybe(() => menuItemUpdateOpts.data.menuItemUpdate.errors, [])}
        pages={pages}
        initial={initialMenuItemUpdateFormData}
        initialDisplayValue={getInitialDisplayValue(menuItem)}
        loading={
          categorySearch.result.loading || collectionSearch.result.loading
        }
        confirmButtonState={menuItemUpdateOpts.status}
        disabled={menuItemUpdateOpts.loading}
        onClose={closeModal}
        onSubmit={handleMenuItemUpdate}
        onQueryChange={handleQueryChange}
      />
    </>
  );
};
MenuDetails.displayName = "MenuDetails";

export default MenuDetails;
