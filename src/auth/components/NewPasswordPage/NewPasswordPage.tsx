import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { AccountErrorFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { TextField } from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

/**
 * @interface NewPasswordPageFormData
 * @property {string} password - 新密码。
 * @property {string} confirmPassword - 确认的新密码。
 *
 * 新密码页面的表单数据。
 */
export interface NewPasswordPageFormData {
  password: string;
  confirmPassword: string;
}

/**
 * @interface NewPasswordPageProps
 * @property {boolean} loading - 表单是否正在加载。
 * @property {AccountErrorFragment[]} errors - 要显示的错误。
 * @property {(data: NewPasswordPageFormData) => SubmitPromise} onSubmit - 提交表单的回调。
 *
 * NewPasswordPage 组件的属性。
 */
export interface NewPasswordPageProps {
  loading: boolean;
  errors: AccountErrorFragment[];
  onSubmit: (data: NewPasswordPageFormData) => SubmitPromise;
}

const initialForm: NewPasswordPageFormData = {
  confirmPassword: "",
  password: "",
};

/**
 * NewPasswordPage 组件，用于显示设置新密码的表单。
 *
 * 此组件允许用户输入并确认新密码。它处理
 * 表单验证、显示错误，并将新密码提交到服务器。
 *
 * @param {NewPasswordPageProps} props - NewPasswordPage 组件的属性。
 * @returns {React.ReactElement} 一个显示新密码表单的 React 元素。
 */
const NewPasswordPage: React.FC<NewPasswordPageProps> = props => {
  const { loading, errors, onSubmit } = props;
  const intl = useIntl();

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => {
        const passwordError = data.password !== data.confirmPassword && data.password.length > 0;

        return (
          <>
            <Text size={6} fontWeight="bold" lineHeight={3} marginBottom={2}>
              <FormattedMessage
                id="WhKGPA"
                defaultMessage="Set up new password"
                description="page title"
              />
            </Text>
            {errors.map(error => (
              <Box
                borderRadius={4}
                padding={4}
                backgroundColor="critical1"
                width="100%"
                marginBottom={2}
                key={`${error.code}-${error.field}`}
              >
                {getAccountErrorMessage(error, intl)}
              </Box>
            ))}
            <Text size={4} fontWeight="light" color="default2" display="block" marginTop={2}>
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
              width="100%"
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
