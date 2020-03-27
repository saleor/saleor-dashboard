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
import { DialogProps } from "@saleor/types";
import { getFormErrors } from "@saleor/utils/errors";
import { ShopErrorFragment } from "@saleor/siteSettings/types/ShopErrorFragment";
import getShopErrorMessage from "@saleor/utils/errors/shop";
import { authorizationKeyTypes } from "../../../misc";
import { AuthorizationKeyType } from "../../../types/globalTypes";

export interface SiteSettingsKeyDialogForm {
  key: string;
  password: string;
  type: AuthorizationKeyType;
}

export interface SiteSettingsKeyDialogProps extends DialogProps {
  errors: ShopErrorFragment[];
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

  const formErrors = getFormErrors(["keyType", "key", "password"], errors);

  return (
    <Dialog onClose={onClose} maxWidth="xs" fullWidth open={open}>
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
                error={!!formErrors.keyType}
                label={intl.formatMessage({
                  defaultMessage: "Authentication type",
                  description: "authentication provider name"
                })}
                hint={getShopErrorMessage(formErrors.keyType, intl)}
                name="type"
                onChange={change}
                value={data.type}
              />
              <FormSpacer />
              <TextField
                error={!!formErrors.key}
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "Key",
                  description: "authentication provider API key"
                })}
                helperText={getShopErrorMessage(formErrors.key, intl)}
                name="key"
                onChange={change}
                value={data.key}
              />
              <FormSpacer />
              <TextField
                error={!!formErrors.password}
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "Password"
                })}
                helperText={getShopErrorMessage(formErrors.password, intl)}
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
