// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { Combobox } from "@dashboard/components/Combobox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import {
  MenuErrorFragment,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
} from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { RelayToFlat } from "@dashboard/types";
import { getFieldError, getFormErrors } from "@dashboard/utils/errors";
import getMenuErrorMessage from "@dashboard/utils/errors/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Input, Option, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { useOptions } from "./options";
import { MenuItemDialogFormData } from "./types";
import { getValidationSchema } from "./validationSchema";

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
  name: "",
  linkType: null,
  linkValue: "",
};

const MenuItemDialog = ({
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
}: MenuItemDialogProps) => {
  const intl = useIntl();

  const { handleSubmit, control, watch, formState, setValue, reset, clearErrors } =
    useForm<MenuItemDialogFormData>({
      defaultValues: defaultInitial,
      resolver: zodResolver(getValidationSchema(intl)),
    });

  const linkType = watch("linkType");

  // Reset input state after closing dialog
  useModalDialogOpen(open, {
    onClose: () => {
      reset(defaultInitial);
      clearErrors();
      onQueryChange("");
    },
  });

  // Refresh initial display value if changed
  React.useEffect(() => {
    // Form should be reset only when dialog is opened
    // otherwise it will reset form on every render and when input is empty
    reset(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const errors = useModalDialogErrors(apiErrors, open);
  const mutationErrors = errors.filter(err => err.field === null);
  const formErrors = getFormErrors(["name"], errors);
  const idError = ["category", "collection", "page", "url"]
    .map(field => getFieldError(errors, field))
    .reduce((acc, err) => acc || err);

  const { baseOptions, subOptions } = useOptions({ pages, categories, collections });
  const subOptionsList: Option[] | undefined = subOptions[linkType];

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DashboardModal.Grid>
            <DashboardModal.Header data-test-id="add-menu-item-dialog-title">
              {initial
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
            </DashboardModal.Header>

            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                <Input
                  {...field}
                  data-test-id="menu-item-name-input"
                  disabled={disabled}
                  label={intl.formatMessage({
                    id: "0Vyr8h",
                    defaultMessage: "Name",
                    description: "menu item name",
                  })}
                  value={value}
                  onChange={onChange}
                  error={!!formErrors.name || !!error}
                  helperText={getMenuErrorMessage(formErrors.name, intl) || error?.message}
                />
              )}
            />

            <Box display="flex" gap={3}>
              <Box width="100%">
                <Controller
                  name="linkType"
                  control={control}
                  render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
                    return (
                      <Combobox
                        {...field}
                        disabled={disabled}
                        label={intl.formatMessage({
                          id: "aasX8r",
                          defaultMessage: "Link type",
                          description: "label",
                        })}
                        options={baseOptions}
                        onChange={e => {
                          onChange(e);
                          setValue("linkValue", "");
                          clearErrors("linkValue");
                        }}
                        value={baseOptions.find(o => o.value === value) || null}
                        name="linkType"
                        error={!!idError || !!error}
                        helperText={getMenuErrorMessage(idError, intl) || error?.message}
                        fetchOptions={() => undefined}
                        data-test-id="menu-item-link-type-input"
                      />
                    );
                  }}
                />
              </Box>

              <Box width="100%">
                {linkType !== "link" ? (
                  <Controller
                    name="linkValue"
                    control={control}
                    render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
                      const subOptionsListValue = subOptionsList?.find(o => o.value === value);

                      return (
                        <Combobox
                          {...field}
                          disabled={disabled}
                          label={intl.formatMessage({
                            id: "WDrC7e",
                            defaultMessage: "Link value",
                            description: "label",
                          })}
                          options={subOptions[linkType] ?? []}
                          onChange={onChange}
                          value={
                            // Show initial value with label in case initial options list from API does not contain it
                            initial && !formState.dirtyFields.linkValue
                              ? {
                                  value,
                                  label: initialDisplayValue,
                                }
                              : subOptionsListValue || null
                          }
                          name="linkValue"
                          error={!!error}
                          helperText={error?.message}
                          fetchOptions={onQueryChange}
                          loading={loading}
                          data-test-id="menu-item-link-value-input"
                        />
                      );
                    }}
                  />
                ) : (
                  <Controller
                    control={control}
                    name="linkValue"
                    render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                      <Input
                        {...field}
                        data-test-id="menu-item-link-value-input"
                        disabled={disabled}
                        label={intl.formatMessage({
                          id: "WDrC7e",
                          defaultMessage: "Link value",
                          description: "label",
                        })}
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              </Box>
            </Box>

            {mutationErrors.length > 0 && (
              <Box>
                {mutationErrors.map(err => (
                  <Text key={err.code} color="critical1" display="block">
                    {getMenuErrorMessage(err, intl)}
                  </Text>
                ))}
              </Box>
            )}
            <DashboardModal.Actions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                data-test-id="submit"
                transitionState={confirmButtonState}
                type="submit"
              >
                <FormattedMessage {...buttonMessages.confirm} />
              </ConfirmButton>
            </DashboardModal.Actions>
          </DashboardModal.Grid>
        </form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

MenuItemDialog.displayName = "MenuItemDialog";
export default MenuItemDialog;
