// @ts-strict-ignore
import AutocompleteSelectMenu from "@dashboard/components/AutocompleteSelectMenu";
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import FormSpacer from "@dashboard/components/FormSpacer";
import {
  MenuErrorFragment,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
} from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages, sectionNames } from "@dashboard/intl";
import { RelayToFlat } from "@dashboard/types";
import { getFieldError, getFormErrors } from "@dashboard/utils/errors";
import getMenuErrorMessage from "@dashboard/utils/errors/menu";
import { getMenuItemByValue, IMenu } from "@dashboard/utils/menu";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import isUrl from "is-url";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
  errors: MenuErrorFragment[];
  initial?: MenuItemDialogFormData;
  initialDisplayValue?: string;
  loading: boolean;
  open: boolean;
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  onClose: () => void;
  onSubmit: (data: MenuItemDialogFormData) => void;
  onQueryChange: (query: string) => void;
}

const defaultInitial: MenuItemDialogFormData = {
  id: "",
  name: "",
  type: "category",
};

function getMenuItemData(value: string): MenuItemData {
  const [type, ...idParts] = value.split(":");
  return {
    id: idParts.join(":"),
    type: type as MenuItemType,
  };
}

function getDisplayValue(menu: IMenu, value: string): string {
  const menuItemData = getMenuItemData(value);
  if (menuItemData.type === "link") {
    return menuItemData.id;
  }
  return getMenuItemByValue(menu, value).label.toString();
}

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
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
  pages,
}) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const [displayValue, setDisplayValue] = React.useState(
    initialDisplayValue || "",
  );
  const [data, setData] = useStateFromProps<MenuItemDialogFormData>(
    initial || defaultInitial,
  );
  const [url, setUrl] = React.useState<string>(undefined);

  // Reset input state after closing dialog
  useModalDialogOpen(open, {
    onClose: () => {
      setData(initial || defaultInitial);
      setDisplayValue(initialDisplayValue);
      setUrl(undefined);
    },
  });

  // Refresh initial display value if changed
  React.useEffect(
    () => setDisplayValue(initialDisplayValue),
    [initialDisplayValue],
  );

  const mutationErrors = errors.filter(err => err.field === null);
  const formErrors = getFormErrors(["name"], errors);
  const testIds = ["category", "collection", "page", "url"];
  const idError = ["category", "collection", "page", "url"]
    .map(field => getFieldError(errors, field))
    .reduce((acc, err) => acc || err);

  let options: IMenu = [];

  if (categories.length > 0) {
    options = [
      ...options,
      {
        children: categories.map(category => ({
          children: [],
          data: {},
          label: category.name,
          value: "category:" + category.id,
        })),
        data: {},
        label: intl.formatMessage(sectionNames.categories),
      },
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
          value: "collection:" + collection.id,
        })),
        data: {},
        label: intl.formatMessage(sectionNames.collections),
      },
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
          value: "page:" + page.id,
        })),
        data: {},
        label: intl.formatMessage(sectionNames.pages),
      },
    ];
  }

  if (url) {
    options = [
      {
        children: [],
        data: {},
        label: (
          <FormattedMessage
            id="fzDI3A"
            defaultMessage="Link to: {url}"
            description="add link to navigation"
            values={{
              url: <strong>{url}</strong>,
            }}
          />
        ),
        value: "link:" + url,
      },
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

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const menuItemData = getMenuItemData(value);

    setData(value => ({
      ...value,
      ...menuItemData,
    }));
    setDisplayValue(getDisplayValue(options, value));
  };

  const handleSubmit = () => onSubmit(data);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { overflowY: "visible" },
      }}
    >
      <DialogTitle disableTypography data-test-id="add-menu-item-dialog-title">
        {!!initial
          ? intl.formatMessage({
              id: "KKQUMK",
              defaultMessage: "Edit Item",
              description: "edit menu item, header",
            })
          : intl.formatMessage({
              id: "H3Uirw",
              defaultMessage: "Add Item",
              description: "create new menu item, header",
            })}
      </DialogTitle>
      <DialogContent style={{ overflow: "visible" }}>
        <TextField
          data-test-id="menu-item-name-input"
          disabled={disabled}
          label={intl.formatMessage({
            id: "0Vyr8h",
            defaultMessage: "Name",
            description: "menu item name",
          })}
          fullWidth
          value={data.name}
          onChange={event =>
            setData(value => ({
              ...value,
              name: event.target.value,
            }))
          }
          name="name"
          error={!!formErrors.name}
          helperText={getMenuErrorMessage(formErrors.name, intl)}
        />
        <FormSpacer />
        <AutocompleteSelectMenu
          disabled={disabled}
          onChange={handleSelectChange}
          name="id"
          label={intl.formatMessage({
            id: "Urh2N3",
            defaultMessage: "Link",
            description: "label",
          })}
          displayValue={displayValue}
          loading={loading}
          options={options}
          testIds={testIds}
          error={!!idError}
          helperText={getMenuErrorMessage(idError, intl)}
          placeholder={intl.formatMessage({
            id: "28GZnc",
            defaultMessage: "Start typing to begin search...",
          })}
          onInputChange={handleQueryChange}
        />
        {mutationErrors.length > 0 && (
          <>
            <FormSpacer />
            {mutationErrors.map(err => (
              <Typography key={err.code} color="error">
                {getMenuErrorMessage(err, intl)}
              </Typography>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          data-test-id="submit"
          transitionState={confirmButtonState}
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
