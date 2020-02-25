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
import SingleSelectField from "@saleor/components/SingleSelectField";
import { buttonMessages } from "@saleor/intl";
import { UserError, DialogProps } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
import { authorizationKeyTypes } from "../../../misc";
import { AuthorizationKeyType } from "../../../types/globalTypes";

export interface SiteSettingsKeyDialogForm {
  key: string;
  password: string;
  type: AuthorizationKeyType;
}

export interface SiteSettingsKeyDialogProps extends DialogProps {
  errors: UserError[];
  initial: SiteSettingsKeyDialogForm;
  onSubmit: (data: SiteSettingsKeyDialogForm) => void;
}

const SiteSettingsKeyDialog: React.FC<SiteSettingsKeyDialogProps> = ({
  errors,
  initial,
  open,
  onClose,
  onSubmit
}) => {
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} maxWidth="xs" open={open}>
      <Form initial={initial} onSubmit={onSubmit}>
        {({ change, data }) => (
          <>
            <DialogTitle>
              <FormattedMessage
                defaultMessage="Add New Authorization Key"
                description="dialog header"
              />
            </DialogTitle>
            <DialogContent>
              <SingleSelectField
                choices={Object.keys(authorizationKeyTypes).map(key => ({
                  label: authorizationKeyTypes[key],
                  value: key
                }))}
                error={!!getFieldError(errors, "keyType")}
                label={intl.formatMessage({
                  defaultMessage: "Authentication type",
                  description: "authentication provider name"
                })}
                hint={getFieldError(errors, "keyType")?.message}
                name="type"
                onChange={change}
                value={data.type}
              />
              <FormSpacer />
              <TextField
                error={!!getFieldError(errors, "key")}
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "Key",
                  description: "authentication provider API key"
                })}
                helperText={getFieldError(errors, "key")?.message}
                name="key"
                onChange={change}
                value={data.key}
              />
              <FormSpacer />
              <TextField
                error={!!getFieldError(errors, "password")}
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "Password"
                })}
                helperText={getFieldError(errors, "password")?.message}
                name="password"
                onChange={change}
                value={data.password}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <Button color="primary" type="submit" variant="contained">
                <FormattedMessage
                  defaultMessage="Add authentication"
                  description="button"
                />
              </Button>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
SiteSettingsKeyDialog.displayName = "SiteSettingsKeyDialog";
export default SiteSettingsKeyDialog;
