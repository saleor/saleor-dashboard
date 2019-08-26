import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Form from "@saleor/components/Form";
import { FormSpacer } from "@saleor/components/FormSpacer";
import ListField from "@saleor/components/ListField";
import { buttonMessages } from "@saleor/intl";

export interface FormData {
  name: string;
  values: Array<{
    label: string;
    value: string;
  }>;
}

export interface ProductTypeAttributeEditDialogProps {
  disabled: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
  name: string;
  opened: boolean;
  title: string;
  values: Array<{
    label: string;
    value: string;
  }>;
  onClose: () => void;
  onConfirm: (data: FormData) => void;
}

const ProductTypeAttributeEditDialog: React.StatelessComponent<
  ProductTypeAttributeEditDialogProps
> = ({ disabled, errors, name, opened, title, values, onClose, onConfirm }) => {
  const intl = useIntl();

  const initialForm: FormData = {
    name: name || "",
    values: values || []
  };
  return (
    <Dialog onClose={onClose} open={opened}>
      <Form errors={errors} initial={initialForm} onSubmit={onConfirm}>
        {({ change, data, errors: formErrors }) => (
          <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              <TextField
                disabled={disabled}
                error={!!formErrors.name}
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "Attribute name"
                })}
                helperText={formErrors.name}
                name="name"
                value={data.name}
                onChange={change}
              />
              <FormSpacer />
              <ListField
                autoComplete="off"
                disabled={disabled}
                error={
                  !!formErrors.values ||
                  !!formErrors.addValues ||
                  !!formErrors.removeValues
                }
                fullWidth
                name="values"
                label={intl.formatMessage({
                  defaultMessage: "Attribute values"
                })}
                helperText={
                  formErrors.values ||
                  formErrors.addValues ||
                  formErrors.removeValues
                }
                values={data.values}
                onChange={change}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.cancel} />
              </Button>
              <Button color="primary" variant="contained" type="submit">
                <FormattedMessage {...buttonMessages.confirm} />
              </Button>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
ProductTypeAttributeEditDialog.displayName = "ProductTypeAttributeEditDialog";
export default ProductTypeAttributeEditDialog;
