import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import { getAttributeValueErrorMessage } from "@saleor/attributes/errors";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { buttonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import omit from "lodash/omit";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import slugify from "slugify";

import { AttributeDetails_attribute_values } from "../../types/AttributeDetails";
import * as M from "./messages";

const slugifyValue = (value: string) =>
  slugify(value, {
    lower: true,
    strict: true
  });

export interface AttributeValueEditDialogFormData {
  name: string;
  slug?: string;
  value?: string;
}

export interface AttributeValueEditDialogProps {
  attributeValue: AttributeDetails_attribute_values | null;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  open: boolean;
  onSubmit: (data: AttributeValueEditDialogFormData) => void;
  onClose: () => void;
}

const AttributeValueEditDialog: React.FC<AttributeValueEditDialogProps> = ({
  attributeValue,
  confirmButtonState,
  disabled,
  errors: apiErrors,
  onClose,
  onSubmit,
  open
}) => {
  const intl = useIntl();
  const initialForm: AttributeValueEditDialogFormData = {
    name: attributeValue?.name ?? "",
    slug: attributeValue?.slug ?? "",
    value: attributeValue?.value ?? ""
  };

  const fields = [
    {
      message: M.dialogMessages.name,
      field: "name"
    },
    {
      message: M.dialogMessages.adminName,
      field: "slug"
    },
    {
      message: M.dialogMessages.attributeValue,
      field: "value"
    }
  ];
  const errors = useModalDialogErrors(apiErrors, open);
  const formErrors = getFormErrors(["name", "value"], errors);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        {attributeValue === null ? M.addValue : M.editValue}
      </DialogTitle>
      <Form
        initial={initialForm}
        onSubmit={data => onSubmit(omit(data, ["slug"]))}
      >
        {({ change, data, submit, set }) => (
          <>
            <DialogContent>
              {fields.map(({ message, field }, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <FormSpacer />}
                  <TextField
                    autoFocus={idx === 0}
                    disabled={disabled || field === "slug"}
                    error={!!formErrors[field]}
                    fullWidth
                    helperText={getAttributeValueErrorMessage(
                      formErrors[field],
                      intl
                    )}
                    name={field as keyof AttributeValueEditDialogFormData}
                    label={intl.formatMessage(message)}
                    value={data[field]}
                    onChange={evt => {
                      change(evt);

                      if (field === "name") {
                        const newValue = slugifyValue(evt.target.value);
                        set({ value: newValue, slug: newValue });
                      }
                    }}
                  />
                </React.Fragment>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <ConfirmButton
                transitionState={confirmButtonState}
                color="primary"
                variant="contained"
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
