import { getAttributeValueErrorMessage } from "@dashboard/attributes/errors";
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { AttributeErrorFragment, AttributeInputTypeEnum } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AttributeValueEditDialogFormData } from "../../utils/data";
import AttributeSwatchField from "../AttributeSwatchField";
import { getAttributeValueFields } from "./utils";

export interface AttributeValueEditDialogProps {
  attributeValue: AttributeValueEditDialogFormData | null;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  open: boolean;
  onSubmit: (data: AttributeValueEditDialogFormData) => void;
  onClose: () => void;
  inputType?: AttributeInputTypeEnum;
}

const AttributeValueEditDialog: React.FC<AttributeValueEditDialogProps> = ({
  attributeValue,
  confirmButtonState,
  disabled,
  errors: apiErrors,
  onClose,
  onSubmit,
  open,
  inputType,
}) => {
  const intl = useIntl();
  const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;
  const attributeValueFields = getAttributeValueFields(attributeValue, isSwatch);
  const initialForm: AttributeValueEditDialogFormData = {
    name: attributeValue?.name ?? "",
    ...attributeValueFields,
  };
  const errors = useModalDialogErrors(apiErrors, open);
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" data-test-id="edit-attribute-value-dialog">
        <Form initial={initialForm} onSubmit={onSubmit}>
          {({ errors, set, change, clearErrors, setError, data, submit }) => (
            <DashboardModal.Grid>
              <DashboardModal.Title>
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
              </DashboardModal.Title>

              <TextField
                data-test-id="value-name"
                autoFocus
                disabled={disabled}
                error={!!formErrors.name}
                fullWidth
                helperText={getAttributeValueErrorMessage(formErrors.name, intl)}
                name={"name" as keyof AttributeValueEditDialogFormData}
                label={intl.formatMessage({
                  id: "UhcALJ",
                  defaultMessage: "Name",
                  description: "attribute name",
                })}
                value={data.name}
                onChange={change}
              />

              {isSwatch && (
                <AttributeSwatchField
                  data={data}
                  errors={errors}
                  clearErrors={clearErrors}
                  setError={setError}
                  set={set}
                />
              )}

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  data-test-id="submit"
                  transitionState={confirmButtonState}
                  disabled={data.name === ""}
                  onClick={submit}
                >
                  <FormattedMessage {...buttonMessages.save} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Grid>
          )}
        </Form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AttributeValueEditDialog.displayName = "AttributeValueEditDialog";
export default AttributeValueEditDialog;
