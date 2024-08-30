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
import { getFormErrors } from "@dashboard/utils/errors";
import getMenuErrorMessage from "@dashboard/utils/errors/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
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
  loading: boolean;
  open: boolean;
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onQueryChange: (query: string) => void;
}

const defaultInitial: MenuItemDialogFormData = {
  name: "",
  linkType: null,
  linkValue: "",
};

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  confirmButtonState,
  disabled,
  errors: apiErrors,
  initial,
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

  const { handleSubmit, control, watch, setValue, reset, clearErrors, formState } =
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
    },
  });

  // Refresh initial display value if changed
  React.useEffect(() => reset(initial), [initial]);

  const errors = useModalDialogErrors(apiErrors, open);
  const mutationErrors = errors.filter(err => err.field === null);
  const formErrors = getFormErrors(["name"], errors);

  const { baseOptions, subOptions } = useOptions({ pages, categories, collections });

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <form
          onSubmit={handleSubmit(data => {
            onSubmit(data);
          })}
        >
          <DashboardModal.Grid>
            <DashboardModal.Title data-test-id="add-menu-item-dialog-title">
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
            </DashboardModal.Title>

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
                  helperText={formErrors.name || error?.message}
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
                        error={!!error}
                        helperText={error?.message}
                        fetchOptions={() => undefined}
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
                          value={subOptions[linkType]?.find(o => o.value === value) || null}
                          name="linkValue"
                          error={!!error}
                          helperText={error?.message}
                          fetchOptions={() => undefined}
                          loading={loading}
                          onInputValueChange={onQueryChange}
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
                        data-test-id="menu-item-input-value"
                        disabled={disabled}
                        label={intl.formatMessage({
                          id: "WDrC7e",
                          defaultMessage: "Link value",
                          description: "label",
                        })}
                        value={value}
                        onChange={onChange}
                        error={!!formErrors.name || !!error}
                        helperText={formErrors.name || error?.message}
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
