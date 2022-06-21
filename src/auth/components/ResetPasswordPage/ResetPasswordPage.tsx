import { TextField, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { IconButton } from "@saleor/components/IconButton";
import { APP_MOUNT_URI } from "@saleor/config";
import { RequestPasswordResetMutation } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { ArrowRightIcon } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useStyles from "../styles";

export interface ResetPasswordPageFormData {
  email: string;
}
export interface ResetPasswordPageProps {
  disabled: boolean;
  error: string;
  onSubmit: (
    data: ResetPasswordPageFormData,
  ) => SubmitPromise<
    RequestPasswordResetMutation["requestPasswordReset"]["errors"]
  >;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = props => {
  const { disabled, error, onSubmit } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Form initial={{ email: "" }} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => (
        <>
          <IconButton className={classes.backBtn} href={APP_MOUNT_URI}>
            <ArrowRightIcon className={classes.arrow} />
          </IconButton>
          <Typography variant="h3" className={classes.header}>
            <FormattedMessage id="Yy/yDL" defaultMessage="Reset password" />
          </Typography>
          {!!error && <div className={classes.panel}>{error}</div>}
          <Typography variant="caption" color="textSecondary">
            <FormattedMessage
              id="54M0Gu"
              defaultMessage="Provide us with an email - if we find it in our database we will send you a link to reset your password. You should be able to find it in your inbox in the next couple of minutes."
            />
          </Typography>
          <FormSpacer />
          <TextField
            autoFocus
            disabled={disabled}
            fullWidth
            autoComplete="username"
            label={intl.formatMessage(commonMessages.email)}
            name="email"
            onChange={handleChange}
            value={data.email}
            inputProps={{
              "data-test-id": "email",
            }}
          />
          <FormSpacer />
          <Button
            data-test-id="submit"
            className={classes.submit}
            disabled={disabled}
            variant="primary"
            onClick={handleSubmit}
            type="submit"
          >
            <FormattedMessage
              id="lm9NSK"
              defaultMessage="Send an email with reset link"
              description="password reset, button"
            />
          </Button>
        </>
      )}
    </Form>
  );
};

ResetPasswordPage.displayName = "ResetPasswordPage";
export default ResetPasswordPage;
