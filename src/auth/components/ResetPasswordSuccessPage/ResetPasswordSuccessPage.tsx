import FormSpacer from "@dashboard/components/FormSpacer";
import { Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

export interface ResetPasswordSuccessPageFormData {
  email: string;
}
export interface ResetPasswordSuccessPageProps {
  onBack: () => void;
}

const ResetPasswordSuccessPage = (props: ResetPasswordSuccessPageProps) => {
  const { onBack } = props;

  return (
    <>
      <Text size={6} fontWeight="bold" lineHeight={3}>
        <FormattedMessage id="Yy/yDL" defaultMessage="Reset password" />
      </Text>
      <Text display="block" marginTop={4}>
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
        width="100%"
      >
        <FormattedMessage id="2oyWT9" defaultMessage="Back to login" description="button" />
      </Button>
    </>
  );
};

ResetPasswordSuccessPage.displayName = "ResetPasswordSuccessPage";
export default ResetPasswordSuccessPage;
