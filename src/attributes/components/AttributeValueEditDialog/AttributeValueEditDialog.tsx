import { AttributeValuePasteProposal } from "@dashboard/attributes/components/AttributeValuePasteProposal/AttributeValuePasteProposal";
import { attributeValuePasteMessages } from "@dashboard/attributes/components/AttributeValuePasteProposal/messages";
import { getAttributeValueErrorMessage } from "@dashboard/attributes/errors";
import { useAttributeValuePaste } from "@dashboard/attributes/hooks/useAttributeValuePaste";
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type AttributeErrorFragment, AttributeInputTypeEnum } from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { type FormErrors, getFormErrors } from "@dashboard/utils/errors";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import {
  type KeyboardEvent,
  type MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type AttributeValueEditDialogFormData } from "../../utils/data";
import AttributeSwatchField from "../AttributeSwatchField/AttributeSwatchField";
import { getAttributeValueFields } from "./utils";

interface AttributeValueEditDialogProps {
  attributeValue: AttributeValueEditDialogFormData | null;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  open: boolean;
  onSubmit: (data: AttributeValueEditDialogFormData) => void;
  onSubmitMany?: (data: AttributeValueEditDialogFormData[]) => void;
  onClose: () => void;
  inputType?: AttributeInputTypeEnum;
}

interface AttributeValueEditFormProps {
  canPasteMany: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  formErrors: FormErrors<"name", AttributeErrorFragment>;
  initialForm: AttributeValueEditDialogFormData;
  isAdd: boolean;
  isSubmittingRef: MutableRefObject<boolean>;
  isSwatch: boolean;
  onClose: () => void;
  onSubmit: (data: AttributeValueEditDialogFormData) => void;
  onSubmitMany?: (data: AttributeValueEditDialogFormData[]) => void;
}

const AttributeValueEditForm = ({
  canPasteMany,
  confirmButtonState,
  disabled,
  formErrors,
  initialForm,
  isAdd,
  isSubmittingRef,
  isSwatch,
  onClose,
  onSubmit,
  onSubmitMany,
}: AttributeValueEditFormProps): JSX.Element => {
  const intl = useIntl();
  const { pendingPaste, handlePaste, keepAsOneName, clearPendingPaste } = useAttributeValuePaste({
    disabled,
    enabled: canPasteMany,
  });
  const handleSubmit = useCallback(
    (formData: AttributeValueEditDialogFormData): void => {
      if (pendingPaste && onSubmitMany) {
        onSubmitMany(pendingPaste.map(name => ({ name })));
        clearPendingPaste();

        return;
      }

      onSubmit(formData);
    },
    [clearPendingPaste, onSubmit, onSubmitMany, pendingPaste],
  );
  const {
    errors: formFieldErrors,
    set,
    change,
    clearErrors,
    setError,
    data,
    submit,
    isSubmitting,
  } = useForm(initialForm, handleSubmit);
  const isMutationLoading = confirmButtonState === "loading";
  const isActionsDisabled = disabled || isSubmitting || isMutationLoading;
  const canSave = pendingPaste ? pendingPaste.length > 0 : data.name.trim().length > 0;

  useEffect(function syncSubmittingRef() {
    isSubmittingRef.current = isActionsDisabled;
  });

  const handleKeepAsOne = (): void => {
    const name = keepAsOneName();

    if (name === null) {
      return;
    }

    set({ name });
  };

  const handleAddPasted = (): void => {
    if (!pendingPaste || !onSubmitMany) {
      return;
    }

    onSubmitMany(pendingPaste.map(name => ({ name })));
    clearPendingPaste();
  };

  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Escape" && pendingPaste) {
      event.preventDefault();
      handleKeepAsOne();

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (canSave && !isActionsDisabled) {
        submit();
      }
    }
  };

  return (
    <DashboardModal.Content size="sm" data-test-id="edit-attribute-value-dialog">
      <DashboardModal.ContextHeader>
        {isAdd ? (
          <FormattedMessage
            id="PqMbma"
            defaultMessage="Add Value"
            description="add attribute value"
          />
        ) : (
          <FormattedMessage
            id="XYhE8p"
            defaultMessage="Edit Value"
            description="edit attribute value"
          />
        )}
      </DashboardModal.ContextHeader>

      <DashboardModal.Body fill={isSwatch}>
        <DashboardModal.Inset>
          <Box display="flex" flexDirection="column" gap={4}>
            <Box display="flex" flexDirection="column" gap={2} onPaste={handlePaste}>
              <Input
                autoFocus
                data-test-id="value-name"
                disabled={isActionsDisabled}
                error={!!formErrors.name}
                helperText={getAttributeValueErrorMessage(formErrors.name, intl)}
                label={intl.formatMessage({
                  id: "UhcALJ",
                  defaultMessage: "Name",
                  description: "attribute name",
                })}
                name="name"
                onChange={event => {
                  clearPendingPaste();
                  change(event);
                }}
                onKeyDown={handleNameKeyDown}
                value={data.name}
                width="100%"
              />
              {pendingPaste ? (
                <AttributeValuePasteProposal
                  disabled={isActionsDisabled}
                  values={pendingPaste}
                  onAdd={handleAddPasted}
                  onKeepAsOne={handleKeepAsOne}
                />
              ) : canPasteMany && !formErrors.name ? (
                <Text size={2} color="default2">
                  <FormattedMessage {...attributeValuePasteMessages.hint} />
                </Text>
              ) : null}
            </Box>

            {isSwatch ? (
              <AttributeSwatchField
                clearErrors={clearErrors}
                data={data}
                errors={formFieldErrors}
                set={set}
                setError={setError}
              />
            ) : null}
          </Box>
        </DashboardModal.Inset>
      </DashboardModal.Body>

      <DashboardModal.Actions>
        <BackButton disabled={isActionsDisabled} onClick={onClose} />
        <ConfirmButton
          data-test-id="submit"
          disabled={!canSave || isActionsDisabled}
          onClick={submit}
          transitionState={
            isMutationLoading ? confirmButtonState : isSubmitting ? "loading" : "default"
          }
        >
          <FormattedMessage {...buttonMessages.save} />
        </ConfirmButton>
      </DashboardModal.Actions>
    </DashboardModal.Content>
  );
};

export const AttributeValueEditDialog = ({
  attributeValue,
  confirmButtonState,
  disabled,
  errors: apiErrors,
  onClose,
  onSubmit,
  onSubmitMany,
  open,
  inputType,
}: AttributeValueEditDialogProps): JSX.Element => {
  const isSubmittingRef = useRef(false);
  const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;
  const isAdd = attributeValue === null;
  const canPasteMany = isAdd && !isSwatch && Boolean(onSubmitMany);
  const initialForm = useMemo<AttributeValueEditDialogFormData>(
    () => ({
      name: attributeValue?.name ?? "",
      ...getAttributeValueFields(attributeValue, isSwatch),
    }),
    [attributeValue, isSwatch],
  );
  const errors = useModalDialogErrors(apiErrors, open);
  const formErrors = getFormErrors(["name"], errors);

  useEffect(
    function resetSubmittingRefWhenDialogCloses() {
      if (!open) {
        isSubmittingRef.current = false;
      }
    },
    [open],
  );

  const handleClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      {open ? (
        <AttributeValueEditForm
          canPasteMany={canPasteMany}
          confirmButtonState={confirmButtonState}
          disabled={disabled}
          formErrors={formErrors}
          initialForm={initialForm}
          isAdd={isAdd}
          isSubmittingRef={isSubmittingRef}
          isSwatch={isSwatch}
          onClose={handleClose}
          onSubmit={onSubmit}
          onSubmitMany={onSubmitMany}
        />
      ) : null}
    </DashboardModal>
  );
};

AttributeValueEditDialog.displayName = "AttributeValueEditDialog";
