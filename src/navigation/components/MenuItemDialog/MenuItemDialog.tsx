import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import isUrl from "is-url";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AutocompleteSelectMenu from "@saleor/components/AutocompleteSelectMenu";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import { SearchCategories_categories_edges_node } from "@saleor/containers/SearchCategories/types/SearchCategories";
import { SearchCollections_collections_edges_node } from "@saleor/containers/SearchCollections/types/SearchCollections";
import { SearchPages_pages_edges_node } from "@saleor/containers/SearchPages/types/SearchPages";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages, sectionNames } from "@saleor/intl";
import { UserError } from "@saleor/types";
import { getErrors, getFieldError } from "@saleor/utils/errors";
import { getMenuItemByValue, IMenu } from "@saleor/utils/menu";

export type MenuItemType = "category" | "collection" | "link" | "page";
export interface MenuItemData {
  id: string;
  type: MenuItemType;
}

export interface MenuItemDialogFormData extends MenuItemData {
  name: string;
}

export interface MenuItemDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: UserError[];
  initial?: MenuItemDialogFormData;
  initialDisplayValue?: string;
  loading: boolean;
  open: boolean;
  collections: SearchCollections_collections_edges_node[];
  categories: SearchCategories_categories_edges_node[];
  pages: SearchPages_pages_edges_node[];
  onClose: () => void;
  onSubmit: (data: MenuItemDialogFormData) => void;
  onQueryChange: (query: string) => void;
}

const defaultInitial: MenuItemDialogFormData = {
  id: "",
  name: "",
  type: "category"
};

function getMenuItemData(value: string): MenuItemData {
  const [type, ...idParts] = value.split(":");
  return {
    id: idParts.join(":"),
    type: type as MenuItemType
  };
}

function getDisplayValue(menu: IMenu, value: string): string {
  const menuItemData = getMenuItemData(value);
  if (menuItemData.type === "link") {
    return menuItemData.id;
  }
  return getMenuItemByValue(menu, value).label.toString();
}

const MenuItemDialog: React.StatelessComponent<MenuItemDialogProps> = ({
  confirmButtonState,
  disabled,
  errors: apiErrors,
  initial,
  initialDisplayValue,
  loading,
  onClose,
  onSubmit,
  onQueryChange,
  open,
  categories,
  collections,
  pages
}) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const [displayValue, setDisplayValue] = React.useState(
    initialDisplayValue || ""
  );
  const [data, setData] = useStateFromProps<MenuItemDialogFormData>(
    initial || defaultInitial
  );
  const [url, setUrl] = React.useState<string>(undefined);

  // Refresh initial display value if changed
  React.useEffect(() => setDisplayValue(initialDisplayValue), [
    initialDisplayValue
  ]);

  // Reset input state after closing dialog
  React.useEffect(() => {
    setDisplayValue(initialDisplayValue);
    setUrl(undefined);
  }, [open]);

  const mutationErrors = getErrors(errors);

  let options: IMenu = [];

  if (categories.length > 0) {
    options = [
      ...options,
      {
        children: categories.map(category => ({
          children: [],
          data: {},
          label: category.name,
          value: "category:" + category.id
        })),
        data: {},
        label: intl.formatMessage(sectionNames.categories)
      }
    ];
  }

  if (collections.length > 0) {
    options = [
      ...options,
      {
        children: collections.map(collection => ({
          children: [],
          data: {},
          label: collection.name,
          value: "collection:" + collection.id
        })),
        data: {},
        label: intl.formatMessage(sectionNames.collections)
      }
    ];
  }

  if (pages.length > 0) {
    options = [
      ...options,
      {
        children: pages.map(page => ({
          children: [],
          data: {},
          label: page.title,
          value: "page:" + page.id
        })),
        data: {},
        label: intl.formatMessage(sectionNames.pages)
      }
    ];
  }

  if (url) {
    options = [
      {
        children: [],
        data: {},
        label: (
          <FormattedMessage
            defaultMessage="Link to: {url}"
            description="add link to navigation"
            id="menuItemDialogAddLink"
            values={{
              url: <strong>{url}</strong>
            }}
          />
        ),
        value: "link:" + url
      }
    ];
  }

  const handleQueryChange = (query: string) => {
    if (isUrl(query)) {
      setUrl(query);
    } else if (isUrl("http://" + query)) {
      setUrl("http://" + query);
    } else if (url) {
      setUrl(undefined);
    }
    onQueryChange(query);
  };

  const handleSelectChange = (event: React.ChangeEvent<any>) => {
    const value = event.target.value;
    const menuItemData = getMenuItemData(value);

    setData(value => ({
      ...value,
      ...menuItemData
    }));
    setDisplayValue(getDisplayValue(options, value));
  };

  const handleSubmit = () => onSubmit(data);

  const idError = ["category", "collection", "page", "url"]
    .map(field => getFieldError(errors, field))
    .reduce((acc, err) => acc || err);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { overflowY: "visible" }
      }}
    >
      <DialogTitle>
        {!!initial
          ? intl.formatMessage({
              defaultMessage: "Edit Item",
              description: "edit menu item, header",
              id: "menuItemDialogEditItem"
            })
          : intl.formatMessage({
              defaultMessage: "Add Item",
              description: "create new menu item, header",
              id: "menuItemDialogAddItem"
            })}
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <TextField
          disabled={disabled}
          label={intl.formatMessage({
            defaultMessage: "Name",
            description: "menu item name",
            id: "menuItemDialogNameLabel"
          })}
          fullWidth
          value={data.name}
          onChange={event =>
            setData(value => ({
              ...value,
              name: event.target.value
            }))
          }
          name="name"
          error={!!getFieldError(errors, "name")}
          helperText={getFieldError(errors, "name")}
        />
        <FormSpacer />
        <AutocompleteSelectMenu
          disabled={disabled}
          onChange={handleSelectChange}
          name="id"
          label={intl.formatMessage({
            defaultMessage: "Link",
            description: "label",
            id: "menuItemDialogLinkLabel"
          })}
          displayValue={displayValue}
          loading={loading}
          options={options}
          error={!!idError}
          helperText={idError}
          placeholder={intl.formatMessage({
            defaultMessage: "Start typing to begin search...",
            id: "menuItemDialogLinkPlaceholder"
          })}
          onInputChange={handleQueryChange}
        />
        {mutationErrors.length > 0 && (
          <>
            <FormSpacer />
            {mutationErrors.map(err => (
              <Typography key={err} color="error">
                {err}
              </Typography>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
        <ConfirmButton
          transitionState={confirmButtonState}
          color="primary"
          variant="contained"
          onClick={handleSubmit}
        >
          <FormattedMessage {...buttonMessages.confirm} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
MenuItemDialog.displayName = "MenuItemDialog";
export default MenuItemDialog;
