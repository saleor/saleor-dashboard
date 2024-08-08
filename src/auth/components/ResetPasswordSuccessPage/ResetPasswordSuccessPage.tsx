import { Button } from "@dashboard/components/Button";
import FormSpacer from "@dashboard/components/FormSpacer";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface ResetPasswordSuccessPageFormData {
  email: string;
}
export interface ResetPasswordSuccessPageProps {
  onBack: () => void;
}

const ResetPasswordSuccessPage: React.FC<ResetPasswordSuccessPageProps> = props => {
  const { onBack } = props;

  return (
    <>
      <Text size={6} fontWeight="bold" lineHeight={3} marginBottom={2}>
        <FormattedMessage id="Yy/yDL" defaultMessage="Reset password" />
      </Text>
      <Text display="block">
        <FormattedMessage
          id="2ob30/"
          defaultMessage="Success! In a few minutes you’ll receive a message with instructions on how to reset your password."
        />
      </Text>
      <FormSpacer />
      <Button
        variant="primary"
        onClick={onBack}
        type="submit"
        data-test-id="back-to-login-button"
        fullWidth
      >
        <FormattedMessage id="2oyWT9" defaultMessage="Back to login" description="button" />
      </Button>
    </>
  );
};

ResetPasswordSuccessPage.displayName = "ResetPasswordSuccessPage";
export default ResetPasswordSuccessPage;
