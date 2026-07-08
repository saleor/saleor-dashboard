import { getAttributeValueErrorMessage } from "@dashboard/attributes/errors";
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type AttributeErrorFragment, AttributeInputTypeEnum } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box, Input } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useRef } from "react";
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
  onClose: () => void;
  inputType?: AttributeInputTypeEnum;
}

export const AttributeValueEditDialog = ({
  attributeValue,
  confirmButtonState,
  disabled,
  errors: apiErrors,
  onClose,
  onSubmit,
  open,
  inputType,
}: AttributeValueEditDialogProps): JSX.Element => {
  const intl = useIntl();
  const isSubmittingRef = useRef(false);
  const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;
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
        <Form initial={initialForm} onSubmit={onSubmit}>
          {({
            errors: formFieldErrors,
            set,
            change,
            clearErrors,
            setError,
            data,
            submit,
            isSubmitting,
          }) => {
            const isMutationLoading = confirmButtonState === "loading";
            const isActionsDisabled = disabled || isSubmitting || isMutationLoading;

            isSubmittingRef.current = isActionsDisabled;

            return (
              <DashboardModal.Content size="sm" data-test-id="edit-attribute-value-dialog">
                <DashboardModal.ContextHeader>
                  {attributeValue === null ? (
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
                        onChange={change}
                        value={data.name}
                        width="100%"
                      />

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
                  <BackButton disabled={isActionsDisabled} onClick={handleClose} />
                  <ConfirmButton
                    data-test-id="submit"
                    disabled={!data.name.trim() || isActionsDisabled}
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
          }}
        </Form>
      ) : null}
    </DashboardModal>
  );
};

AttributeValueEditDialog.displayName = "AttributeValueEditDialog";
