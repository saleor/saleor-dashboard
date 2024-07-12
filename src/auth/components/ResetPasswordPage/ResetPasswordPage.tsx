import { Button } from "@dashboard/components/Button";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { IconButton } from "@dashboard/components/IconButton";
import { getAppMountUri } from "@dashboard/config";
import { AccountErrorCode } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { TextField } from "@material-ui/core";
import { ArrowRightIcon } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useStyles from "../styles";

export interface ResetPasswordPageFormData {
  email: string;
}
export interface ResetPasswordPageProps {
  disabled: boolean;
  error: string;
  onSubmit: (data: ResetPasswordPageFormData) => SubmitPromise<AccountErrorCode[]>;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = props => {
  const { disabled, error, onSubmit } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Form initial={{ email: "" }} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => (
        <>
          <IconButton className={classes.backBtn} href={getAppMountUri()} variant="secondary">
            <ArrowRightIcon className={classes.arrow} />
          </IconButton>
          <Text size={6} fontWeight="bold" lineHeight={3} className={classes.header}>
            <FormattedMessage id="Yy/yDL" defaultMessage="Reset password" />
          </Text>
          {!!error && <div className={classes.panel}>{error}</div>}
          <Text size={2} fontWeight="light" color="default2">
            <FormattedMessage
              id="54M0Gu"
              defaultMessage="Provide us with an email - if we find it in our database we will send you a link to reset your password. You should be able to find it in your inbox in the next couple of minutes."
            />
          </Text>
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
              spellCheck: false,
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
