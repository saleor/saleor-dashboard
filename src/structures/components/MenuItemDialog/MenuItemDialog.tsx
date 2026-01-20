// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { MenuErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { getFieldError, getFormErrors } from "@dashboard/utils/errors";
import getMenuErrorMessage from "@dashboard/utils/errors/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, DynamicCombobox, Input, Text } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { MenuItemDialogLinkValue } from "./MenuItemDialogLinkValue";
import { getLinkTypeOptions } from "./options";
import { MenuItemDialogFormData } from "./types";
import { getValidationSchema } from "./validationSchema";

interface MenuItemDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: MenuErrorFragment[];
  initial?: MenuItemDialogFormData;
  initialDisplayValue?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MenuItemDialogFormData) => void;
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
  onClose,
  onSubmit,
  open,
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
    },
  });

  // Refresh initial display value if changed
  useEffect(() => {
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

  const linkTypeOptions = getLinkTypeOptions(intl);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DashboardModal.Grid>
            <DashboardModal.Header data-test-id="add-menu-item-dialog-title">
              {initial
                ? intl.formatMessage({
                    id: "GUeIcq",
                    defaultMessage: "Edit Item",
                    description: "edit structure, header",
                  })
                : intl.formatMessage({
                    id: "zJpP1T",
                    defaultMessage: "Add Item",
                    description: "create new structure, header",
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
                    id: "z/pKCq",
                    defaultMessage: "Name",
                    description: "structure name",
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
                      <DynamicCombobox
                        {...field}
                        disabled={disabled}
                        label={intl.formatMessage({
                          id: "aasX8r",
                          defaultMessage: "Link type",
                          description: "label",
                        })}
                        options={linkTypeOptions}
                        onChange={option => {
                          onChange(option?.value ?? null);
                          setValue("linkValue", "");
                          clearErrors("linkValue");
                        }}
                        value={linkTypeOptions.find(o => o.value === value) || null}
                        name="linkType"
                        size="small"
                        error={!!idError || !!error}
                        helperText={getMenuErrorMessage(idError, intl) || error?.message}
                        data-test-id="menu-item-link-type-input"
                      />
                    );
                  }}
                />
              </Box>

              <Box width="100%">
                {linkType !== "link" ? (
                  <MenuItemDialogLinkValue
                    control={control}
                    disabled={disabled}
                    initialDisplayValue={initialDisplayValue}
                    linkType={linkType}
                    showInitialValue={initial && !formState.dirtyFields.linkValue}
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
