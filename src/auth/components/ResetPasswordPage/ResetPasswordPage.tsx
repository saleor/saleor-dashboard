import { useLastLoginMethod } from "@dashboard/auth/hooks/useLastLoginMethod";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { getAppMountUri } from "@dashboard/config";
import { AccountErrorCode } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { TextField } from "@material-ui/core";
import { Box, Button, Paragraph, Text } from "@saleor/macaw-ui-next";
import { ArrowLeft } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { ChangingPasswordWarning } from "../ChangingPasswordWarning";

export interface ResetPasswordPageFormData {
  email: string;
}
interface ResetPasswordPageProps {
  disabled: boolean;
  error: string;
  onSubmit: (data: ResetPasswordPageFormData) => SubmitPromise<AccountErrorCode[]>;
}

const ResetPasswordPage = (props: ResetPasswordPageProps) => {
  const { disabled, error, onSubmit } = props;
  const intl = useIntl();
  const { hasUserLoggedViaExternalMethod } = useLastLoginMethod();

  return (
    <Form initial={{ email: "" }} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => (
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Button
            as="a"
            icon={<ArrowLeft size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
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
          <Paragraph size={2} color="default2" fontWeight="bold">
            <FormattedMessage
              id="h7yWcT"
              defaultMessage="Enter your email. If it matches an account, we’ll send you a reset link within a few minutes."
            />
          </Paragraph>

          {hasUserLoggedViaExternalMethod && (
            <>
              <FormSpacer />
              <ChangingPasswordWarning />
            </>
          )}
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
