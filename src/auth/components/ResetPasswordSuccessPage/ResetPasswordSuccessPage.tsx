import { Button } from "@dashboard/components/Button";
import FormSpacer from "@dashboard/components/FormSpacer";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import useStyles from "../styles";

export interface ResetPasswordSuccessPageFormData {
  email: string;
}
export interface ResetPasswordSuccessPageProps {
  onBack: () => void;
}

const ResetPasswordSuccessPage: React.FC<ResetPasswordSuccessPageProps> = props => {
  const { onBack } = props;
  const classes = useStyles(props);

  return (
    <>
      <Text size={6} fontWeight="bold" lineHeight={3} className={classes.header}>
        <FormattedMessage id="Yy/yDL" defaultMessage="Reset password" />
      </Text>
      <Text>
        <FormattedMessage
          id="2ob30/"
          defaultMessage="Success! In a few minutes you’ll receive a message with instructions on how to reset your password."
        />
      </Text>
      <FormSpacer />
      <Button
        className={classes.submit}
        variant="primary"
        onClick={onBack}
        type="submit"
        data-test-id="back-to-login-button"
      >
        <FormattedMessage id="2oyWT9" defaultMessage="Back to login" description="button" />
      </Button>
    </>
  );
};

ResetPasswordSuccessPage.displayName = "ResetPasswordSuccessPage";
export default ResetPasswordSuccessPage;
