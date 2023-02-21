import { getAttributeValueErrorMessage } from "@dashboard/attributes/errors";
import BackButton from "@dashboard/components/BackButton";
import ConfirmButton from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import {
  AttributeErrorFragment,
  AttributeInputTypeEnum,
} from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AttributeValueEditDialogFormData } from "../../utils/data";
import AttributeSwatchField from "../AttributeSwatchField";

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
  const attributeValueFields = attributeValue?.fileUrl
    ? {
        fileUrl: attributeValue?.fileUrl,
        contentType: attributeValue?.contentType,
      }
    : { value: attributeValue?.value ?? "" };

  const initialForm: AttributeValueEditDialogFormData = {
    name: attributeValue?.name ?? "",
    ...attributeValueFields,
  };
  const errors = useModalDialogErrors(apiErrors, open);
  const formErrors = getFormErrors(["name"], errors);
  const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle disableTypography>
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
      </DialogTitle>
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ errors, set, change, clearErrors, setError, data, submit }) => (
          <>
            <DialogContent>
              <TextField
                data-test-id="value-name"
                autoFocus
                disabled={disabled}
                error={!!formErrors.name}
                fullWidth
                helperText={getAttributeValueErrorMessage(
                  formErrors.name,
                  intl,
                )}
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
            </DialogContent>
            <DialogActions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                data-test-id="submit"
                transitionState={confirmButtonState}
                onClick={submit}
              >
                <FormattedMessage {...buttonMessages.save} />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
AttributeValueEditDialog.displayName = "AttributeValueEditDialog";
export default AttributeValueEditDialog;
