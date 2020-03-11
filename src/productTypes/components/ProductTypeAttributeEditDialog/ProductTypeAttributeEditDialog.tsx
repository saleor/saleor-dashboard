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
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";

export interface FormData {
  name: string;
  values: Array<{
    label: string;
    value: string;
  }>;
}

export interface ProductTypeAttributeEditDialogProps {
  disabled: boolean;
  errors: UserError[];
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

const ProductTypeAttributeEditDialog: React.FC<ProductTypeAttributeEditDialogProps> = ({
  disabled,
  errors,
  name,
  opened,
  title,
  values,
  onClose,
  onConfirm
}) => {
  const intl = useIntl();

  const initialForm: FormData = {
    name: name || "",
    values: values || []
  };
  return (
    <Dialog onClose={onClose} open={opened}>
      <Form initial={initialForm} onSubmit={onConfirm}>
        {({ change, data }) => (
          <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              <TextField
                disabled={disabled}
                error={!!getFieldError(errors, "name")}
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "Attribute name"
                })}
                helperText={getFieldError(errors, "name")?.message}
                name="name"
                value={data.name}
                onChange={change}
              />
              <FormSpacer />
              <ListField
                autoComplete="off"
                disabled={disabled}
                error={
                  !!getFieldError(errors, "values") ||
                  !!getFieldError(errors, "addValues") ||
                  !!getFieldError(errors, "removeValues")
                }
                fullWidth
                name="values"
                label={intl.formatMessage({
                  defaultMessage: "Attribute values"
                })}
                helperText={
                  getFieldError(errors, "values") ||
                  getFieldError(errors, "addValues") ||
                  getFieldError(errors, "removeValues")
                }
                values={data.values}
                onChange={change}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
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
