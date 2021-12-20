import { Typography } from "@material-ui/core";
import FormSpacer from "@saleor/components/FormSpacer";
import { Button } from "@saleor/macaw-ui";
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
      <Typography>
        <FormattedMessage defaultMessage="Success! In a few minutes you’ll receive a message with instructions on how to reset your password." />
      </Typography>
      <FormSpacer />
      <Button
        className={classes.submit}
        variant="primary"
        onClick={onBack}
        type="submit"
      >
        <FormattedMessage defaultMessage="Back to login" description="button" />
      </Button>
    </>
  );
};

ResetPasswordSuccessPage.displayName = "ResetPasswordSuccessPage";
export default ResetPasswordSuccessPage;
