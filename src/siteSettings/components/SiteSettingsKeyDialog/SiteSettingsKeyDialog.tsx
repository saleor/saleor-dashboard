import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Form, { FormProps } from "@saleor/components/Form";
import { FormSpacer } from "@saleor/components/FormSpacer";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { buttonMessages } from "@saleor/intl";
import { translatedAuthorizationKeyTypes } from "../../../misc";
import { AuthorizationKeyType } from "../../../types/globalTypes";

export interface SiteSettingsKeyDialogForm {
  key: string;
  password: string;
  type: AuthorizationKeyType;
}

export interface SiteSettingsKeyDialogProps
  extends Pick<
    FormProps<SiteSettingsKeyDialogForm>,
    Exclude<keyof FormProps<SiteSettingsKeyDialogForm>, "children">
  > {
  open: boolean;
  onClose: () => void;
}

const SiteSettingsKeyDialog: React.StatelessComponent<
  SiteSettingsKeyDialogProps
> = ({ errors, initial, open, onClose, onSubmit }) => {
  const intl = useIntl();
  const keyTypes = translatedAuthorizationKeyTypes();

  return (
    <Dialog onClose={onClose} maxWidth="xs" open={open}>
      <Form initial={initial} onSubmit={onSubmit} errors={errors}>
        {({ change, data, errors }) => (
          <>
            <DialogTitle>
              <FormattedMessage
                defaultMessage="Add New Authorization Key"
                description="dialog header"
              />
            </DialogTitle>
            <DialogContent>
              <SingleSelectField
                choices={Object.keys(keyTypes).map(key => ({
                  label: keyTypes[key],
                  value: key
                }))}
                error={!!errors.keyType}
                label={intl.formatMessage({
                  defaultMessage: "Authentication type",
                  description: "authentication provider name"
                })}
                hint={errors.keyType}
                name="type"
                onChange={change}
                value={data.type}
              />
              <FormSpacer />
              <TextField
                error={!!errors.key}
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "Key",
                  description: "authentication provider API key"
                })}
                helperText={errors.key}
                name="key"
                onChange={change}
                value={data.key}
              />
              <FormSpacer />
              <TextField
                error={!!errors.password}
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "Password"
                })}
                helperText={errors.password}
                name="password"
                onChange={change}
                value={data.password}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.cancel} />
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
