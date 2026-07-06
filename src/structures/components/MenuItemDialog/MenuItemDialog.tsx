// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type MenuErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { getFieldError, getFormErrors } from "@dashboard/utils/errors";
import getMenuErrorMessage from "@dashboard/utils/errors/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, DynamicCombobox, Input, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { MenuItemDialogLinkValue } from "./MenuItemDialogLinkValue/MenuItemDialogLinkValue";
import { getLinkTypeOptions } from "./options";
import { type MenuItemDialogFormData } from "./types";
import { getValidationSchema } from "./validationSchema";

interface MenuItemDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: MenuErrorFragment[];
  initial?: MenuItemDialogFormData;
  initialDisplayValue?: string;
  onClose: () => void;
  onSubmit: (data: MenuItemDialogFormData) => void;
  open: boolean;
}

const defaultInitial: MenuItemDialogFormData = {
  name: "",
  linkType: null,
  linkValue: "",
};

export const MenuItemDialog = ({
  confirmButtonState,
  errors: apiErrors,
  initial,
  initialDisplayValue,
  onClose,
  onSubmit,
  open,
}: MenuItemDialogProps): JSX.Element => {
  const intl = useIntl();
  const isSubmittingRef = useRef(false);

  const { handleSubmit, control, watch, formState, setValue, reset, clearErrors } =
    useForm<MenuItemDialogFormData>({
      defaultValues: defaultInitial,
      resolver: zodResolver(getValidationSchema(intl)),
    });

  const linkType = watch("linkType");
  const isMutationLoading = confirmButtonState === "loading";
  const isActionsDisabled = formState.isSubmitting || isMutationLoading;

  isSubmittingRef.current = isActionsDisabled;

  useEffect(
    function resetSubmittingRefWhenDialogCloses() {
      if (!open) {
        isSubmittingRef.current = false;
      }
    },
    [open],
  );

  // Reset input state after closing dialog
  useModalDialogOpen(open, {
    onClose: () => {
      reset(defaultInitial);
      clearErrors();
    },
  });

  // Refresh initial display value if changed
  useEffect(
    function resetFormWhenDialogOpens() {
      reset(initial);
    },
    // Form should reset only when dialog opens, not when `initial` identity changes on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open],
  );

  const handleClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  const errors = useModalDialogErrors(apiErrors, open);
  const mutationErrors = errors.filter(err => err.field === null);
  const formErrors = getFormErrors(["name"], errors);
  const idError = ["category", "collection", "page", "url"]
    .map(field => getFieldError(errors, field))
    .reduce((acc, err) => acc || err);

  const linkTypeOptions = getLinkTypeOptions(intl);

  return (
    <DashboardModal onChange={handleClose} open={open}>
      {open ? (
        <DashboardModal.Content size="sm">
          <DashboardModal.ContextHeader data-test-id="add-menu-item-dialog-title">
            {initial ? (
              <FormattedMessage
                description="edit structure, header"
                id="GUeIcq"
                defaultMessage="Edit Item"
              />
            ) : (
              <FormattedMessage
                description="create new structure, header"
                id="zJpP1T"
                defaultMessage="Add Item"
              />
            )}
          </DashboardModal.ContextHeader>

          <DashboardModal.Body>
            <DashboardModal.Inset>
              <Box display="grid" gap={4}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                    <Input
                      {...field}
                      data-test-id="menu-item-name-input"
                      disabled={isActionsDisabled}
                      error={!!formErrors.name || !!error}
                      helperText={getMenuErrorMessage(formErrors.name, intl) || error?.message}
                      label={intl.formatMessage({
                        description: "structure name",
                        id: "z/pKCq",
                        defaultMessage: "Name",
                      })}
                      onChange={onChange}
                      value={value}
                      width="100%"
                    />
                  )}
                />

                <Box display="grid" gap={2} __gridTemplateColumns="1fr 1fr">
                  <Controller
                    control={control}
                    name="linkType"
                    render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                      <DynamicCombobox
                        {...field}
                        data-test-id="menu-item-link-type-input"
                        disabled={isActionsDisabled}
                        error={!!idError || !!error}
                        helperText={getMenuErrorMessage(idError, intl) || error?.message}
                        label={intl.formatMessage({
                          description: "label",
                          id: "aasX8r",
                          defaultMessage: "Link type",
                        })}
                        name="linkType"
                        onChange={option => {
                          onChange(option?.value ?? null);
                          setValue("linkValue", "");
                          clearErrors("linkValue");
                        }}
                        options={linkTypeOptions}
                        size="small"
                        value={linkTypeOptions.find(o => o.value === value) || null}
                      />
                    )}
                  />

                  {linkType !== "link" ? (
                    <MenuItemDialogLinkValue
                      control={control}
                      disabled={isActionsDisabled}
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
                          disabled={isActionsDisabled}
                          error={!!error}
                          helperText={error?.message}
                          label={intl.formatMessage({
                            description: "label",
                            id: "WDrC7e",
                            defaultMessage: "Link value",
                          })}
                          onChange={onChange}
                          value={value}
                          width="100%"
                        />
                      )}
                    />
                  )}
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
              </Box>
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <BackButton disabled={isActionsDisabled} onClick={handleClose} />
            <ConfirmButton
              data-test-id="submit"
              disabled={isActionsDisabled}
              onClick={handleSubmit(onSubmit)}
              transitionState={
                isMutationLoading
                  ? confirmButtonState
                  : formState.isSubmitting
                    ? "loading"
                    : "default"
              }
            >
              <FormattedMessage {...buttonMessages.confirm} />
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      ) : null}
    </DashboardModal>
  );
};

MenuItemDialog.displayName = "MenuItemDialog";
