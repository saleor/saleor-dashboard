import { Button } from "@dashboard/components/Button";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { AccountErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useStyles from "../styles";

export interface NewPasswordPageFormData {
  password: string;
  confirmPassword: string;
}
export interface NewPasswordPageProps {
  loading: boolean;
  errors: AccountErrorFragment[];
  onSubmit: (data: NewPasswordPageFormData) => SubmitPromise;
}

const initialForm: NewPasswordPageFormData = {
  confirmPassword: "",
  password: "",
};
const NewPasswordPage: React.FC<NewPasswordPageProps> = props => {
  const { loading, errors, onSubmit } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => {
        const passwordError = data.password !== data.confirmPassword && data.password.length > 0;

        return (
          <>
            <Text size={6} fontWeight="bold" lineHeight={3} className={classes.header}>
              <FormattedMessage
                id="WhKGPA"
                defaultMessage="Set up new password"
                description="page title"
              />
            </Text>
            {errors.map(error => (
              <div className={classes.panel} key={`${error.code}-${error.field}`}>
                {getAccountErrorMessage(error, intl)}
              </div>
            ))}
            <Text size={2} fontWeight="light" color="default2">
              <FormattedMessage
                id="m0Dz+2"
                defaultMessage="Please set up a new password for your account. Repeat your new password to make sure you will be able to remember it."
              />
            </Text>
            <FormSpacer />
            <TextField
              autoFocus
              fullWidth
              autoComplete="none"
              disabled={loading}
              label={intl.formatMessage({
                id: "Ev6SEF",
                defaultMessage: "New Password",
              })}
              name="password"
              onChange={handleChange}
              type="password"
              value={data.password}
              inputProps={{
                "data-test-id": "password",
                spellCheck: false,
              }}
              required
            />
            <FormSpacer />
            <TextField
              fullWidth
              error={passwordError}
              autoComplete="none"
              disabled={loading}
              label={intl.formatMessage({
                id: "vfG+nh",
                defaultMessage: "Confirm Password",
              })}
              name="confirmPassword"
              onChange={handleChange}
              type="password"
              value={data.confirmPassword}
              helperText={
                passwordError &&
                intl.formatMessage({
                  id: "7Chrsf",
                  defaultMessage: "Passwords do not match",
                })
              }
              inputProps={{
                "data-test-id": "confirm-password",
                spellCheck: false,
              }}
              required
            />
            <FormSpacer />
            <Button
              data-test-id="button-bar-confirm"
              className={classes.submit}
              disabled={loading || data.password.length === 0 || passwordError}
              variant="primary"
              onClick={handleSubmit}
              type="submit"
            >
              <FormattedMessage
                id="S22jIs"
                defaultMessage="Set new password"
                description="button"
              />
            </Button>
          </>
        );
      }}
    </Form>
  );
};

NewPasswordPage.displayName = "NewPasswordPage";
export default NewPasswordPage;
