import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { getAppMountUri } from "@dashboard/config";
import { AccountErrorCode } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { TextField } from "@material-ui/core";
import { ArrowLeftIcon, Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

/**
 * @interface ResetPasswordPageFormData
 * @property {string} email - 用户的电子邮件地址。
 *
 * 重置密码页面的表单数据。
 */
export interface ResetPasswordPageFormData {
  email: string;
}

/**
 * @interface ResetPasswordPageProps
 * @property {boolean} disabled - 表单是否被禁用。
 * @property {string} error - 要显示的错误消息。
 * @property {(data: ResetPasswordPageFormData) => SubmitPromise<AccountErrorCode[]>} onSubmit - 提交表单的回调。
 *
 * ResetPasswordPage 组件的属性。
 */
export interface ResetPasswordPageProps {
  disabled: boolean;
  error: string;
  onSubmit: (data: ResetPasswordPageFormData) => SubmitPromise<AccountErrorCode[]>;
}

/**
 * ResetPasswordPage 组件，用于显示请求密码重置的表单。
 *
 * 此组件允许用户输入其电子邮件地址以接收密码
 * 重置链接。它处理表单提交并显示发生的任何错误。
 *
 * @param {ResetPasswordPageProps} props - ResetPasswordPage 组件的属性。
 * @returns {React.ReactElement} 一个显示密码重置表单的 React 元素。
 */
const ResetPasswordPage: React.FC<ResetPasswordPageProps> = props => {
  const { disabled, error, onSubmit } = props;
  const intl = useIntl();

  return (
    <Form initial={{ email: "" }} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => (
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Button
            as="a"
            icon={<ArrowLeftIcon />}
            href={getAppMountUri()}
            variant="secondary"
            marginBottom={4}
          />

          <Text size={6} fontWeight="bold" lineHeight={3} marginBottom={2}>
            <FormattedMessage id="Yy/yDL" defaultMessage="Reset password" />
          </Text>
          {!!error && (
            <Box
              borderRadius={4}
              padding={4}
              backgroundColor="critical1"
              width="100%"
              marginBottom={2}
            >
              <Text>{error}</Text>
            </Box>
          )}
          <Text fontWeight="light" color="default2" display="block">
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
            disabled={disabled}
            variant="primary"
            onClick={handleSubmit}
            type="submit"
            width="100%"
          >
            <FormattedMessage
              id="lm9NSK"
              defaultMessage="Send an email with reset link"
              description="password reset, button"
            />
          </Button>
        </Box>
      )}
    </Form>
  );
};

ResetPasswordPage.displayName = "ResetPasswordPage";
export default ResetPasswordPage;
